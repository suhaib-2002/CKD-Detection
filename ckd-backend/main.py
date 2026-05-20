import os
import pickle
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="CKD Prediction System Backend", version="1.0.0")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define exact StandardScaler parameters derived from linear regression
SCALING_PARAMS = {
    "age": {"mean": 51.5625, "std": 16.9618},
    "bp": {"mean": 76.5750, "std": 13.4729},
    "bgr": {"mean": 145.0625, "std": 75.1666},
    "bu": {"mean": 56.6930, "std": 49.3335},
    "sc": {"mean": 2.9971, "std": 5.6218},
    "sod": {"mean": 137.6313, "std": 9.1948},
    "pot": {"mean": 4.5772, "std": 2.8178},
    "hemo": {"mean": 12.5425, "std": 2.7131},
    "pcv": {"mean": 39.0825, "std": 8.1520},
    "wbcc": {"mean": 8298.5000, "std": 2526.4298},
    "rbcc": {"mean": 4.7377, "std": 0.8404}
}

# Predefined order of features expected by the trained Random Forest model
FEATURE_COLUMNS = [
    'age', 'bp', 'sg', 'al', 'su', 'rbc', 'pc', 'pcc', 'ba', 'bgr',
    'bu', 'sc', 'sod', 'pot', 'hemo', 'pcv', 'wbcc', 'rbcc', 'htn', 'dm',
    'cad', 'appet', 'pe', 'ane'
]

# Map internal feature column keys to user-friendly medical names for frontend
CLINICAL_LABELS = {
    'age': 'Age',
    'bp': 'Blood Pressure',
    'sg': 'Specific Gravity',
    'al': 'Albumin',
    'su': 'Sugar',
    'rbc': 'Red Blood Cells',
    'pc': 'Pus Cell',
    'pcc': 'Pus Cell Clumps',
    'ba': 'Bacteria',
    'bgr': 'Blood Glucose Random',
    'bu': 'Blood Urea',
    'sc': 'Serum Creatinine',
    'sod': 'Sodium',
    'pot': 'Potassium',
    'hemo': 'Hemoglobin',
    'pcv': 'Packed Cell Volume',
    'wbcc': 'White Blood Cell Count',
    'rbcc': 'Red Blood Cell Count',
    'htn': 'Hypertension',
    'dm': 'Diabetes Mellitus',
    'cad': 'Coronary Artery Disease',
    'appet': 'Appetite',
    'pe': 'Pedal Edema',
    'ane': 'Anemia'
}

# Path to the serialized RandomForest model
MODEL_PATH = r"e:\ckd-prediction-system-main\model\model.pkl"
model = None

@app.on_event("startup")
def load_model():
    global model
    if not os.path.exists(MODEL_PATH):
        raise RuntimeError(f"Trained model pickle not found at: {MODEL_PATH}")
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    print("Successfully loaded Random Forest model!")

class PredictionRequest(BaseModel):
    features: dict

class PredictionResponse(BaseModel):
    prediction: str
    probability: float
    risk_factors: list[str]
    feature_importance: list[dict]

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    if model is None:
        raise HTTPException(status_code=503, detail="Prediction model not initialized.")
    
    raw = request.features
    
    # 1. Parse and preprocess each feature into the expected X vector
    processed_features = {}
    risk_factors = []
    
    # helper to convert float safely
    def get_float(val, default=0.0):
        if val is None or str(val).strip() == "":
            return default
        try:
            return float(str(val).strip())
        except ValueError:
            return default
            
    # helper to convert int safely
    def get_int(val, default=0):
        if val is None or str(val).strip() == "":
            return default
        try:
            return int(str(val).strip())
        except ValueError:
            return default

    # Continuous Features - Normalize with derived StandardScaler parameters
    for feat in ["age", "bp", "bgr", "bu", "sc", "sod", "pot", "hemo", "pcv", "wbcc", "rbcc"]:
        # Match camelCase frontend fields to backend snake_case column names
        frontend_key = feat
        if feat == "bp":
            frontend_key = "bloodPressure"
        elif feat == "bgr":
            frontend_key = "bloodGlucoseRandom"
        elif feat == "bu":
            frontend_key = "bloodUrea"
        elif feat == "sc":
            frontend_key = "serumCreatinine"
        elif feat == "sod":
            frontend_key = "sodium"
        elif feat == "pot":
            frontend_key = "potassium"
        elif feat == "hemo":
            frontend_key = "hemoglobin"
        elif feat == "pcv":
            frontend_key = "packedCellVolume"
        elif feat == "wbcc":
            frontend_key = "whiteBloodCellCount"
        elif feat == "rbcc":
            frontend_key = "redBloodCellCount"
            
        raw_val = get_float(raw.get(frontend_key), default=None)
        
        if raw_val is None:
            # Impute with mean (scaled representation is 0.0)
            processed_features[feat] = 0.0
        else:
            mean = SCALING_PARAMS[feat]["mean"]
            std = SCALING_PARAMS[feat]["std"]
            processed_features[feat] = (raw_val - mean) / std
            
            # Clinical Risk Factor Threshold Checks
            if feat == "sc" and raw_val > 1.2:
                risk_factors.append(f"High Serum Creatinine ({raw_val} mg/dL)")
            elif feat == "bp" and raw_val > 80:
                risk_factors.append(f"Elevated Blood Pressure ({int(raw_val)} mmHg)")
            elif feat == "hemo" and raw_val < 12.0:
                risk_factors.append(f"Low Hemoglobin ({raw_val} g/dL)")
            elif feat == "bgr" and raw_val > 140:
                risk_factors.append(f"Elevated Blood Glucose ({int(raw_val)} mg/dL)")
            elif feat == "bu" and raw_val > 40:
                risk_factors.append(f"High Blood Urea ({raw_val} mg/dL)")

    # SG, Albumin, Sugar (numeric but not normalized)
    processed_features["sg"] = get_float(raw.get("specificGravity"), default=1.0177)
    processed_features["al"] = get_int(raw.get("albumin"), default=0)
    processed_features["su"] = get_int(raw.get("sugar"), default=0)
    
    if processed_features["sg"] < 1.015:
        risk_factors.append(f"Low Urine Specific Gravity ({processed_features['sg']})")
    if processed_features["al"] > 0:
        risk_factors.append(f"Proteinuria (Albumin level {processed_features['al']}+)")
    if processed_features["su"] > 0:
        risk_factors.append(f"Glycosuria (Sugar level {processed_features['su']}+)")

    # Categorical Binary Fields (normal/abnormal, present/notpresent, yes/no, good/poor)
    binary_mappings = {
        "rbc": ("redBloodCells", "normal", 1, 0, 1),
        "pc": ("pusCell", "normal", 1, 0, 1),
        "pcc": ("pusCellClumps", "present", 1, 0, 0),
        "ba": ("bacteria", "present", 1, 0, 0),
        "htn": ("hypertension", "yes", 1, 0, 0),
        "dm": ("diabetesMellitus", "yes", 1, 0, 0),
        "cad": ("coronaryArteryDisease", "yes", 1, 0, 0),
        "appet": ("appetite", "good", 1, 0, 1),
        "pe": ("pedalEdema", "yes", 1, 0, 0),
        "ane": ("anemia", "yes", 1, 0, 0)
    }
    
    for feat, (front_key, positive_val, pos_num, neg_num, default) in binary_mappings.items():
        val = str(raw.get(front_key, "")).strip().lower()
        if val == "":
            processed_features[feat] = default
        else:
            processed_features[feat] = pos_num if val == positive_val else neg_num
            
        # Clinical Risk Factor History Checks
        if feat == "htn" and processed_features[feat] == 1:
            risk_factors.append("Hypertension History")
        elif feat == "dm" and processed_features[feat] == 1:
            risk_factors.append("Diabetes Mellitus History")
        elif feat == "cad" and processed_features[feat] == 1:
            risk_factors.append("Coronary Artery Disease History")
        elif feat == "pe" and processed_features[feat] == 1:
            risk_factors.append("Pedal Edema (Swelling)")
        elif feat == "ane" and processed_features[feat] == 1:
            risk_factors.append("Clinical Anemia")

    # Assemble feature vector in the EXACT order expected by the model
    x_vector = [processed_features[col] for col in FEATURE_COLUMNS]
    
    # 2. Run prediction
    prediction_numeric = int(model.predict([x_vector])[0])
    prediction_label = "CKD" if prediction_numeric == 1 else "NOT CKD"
    
    probabilities = model.predict_proba([x_vector])[0]
    risk_probability = float(probabilities[1])  # Class 1 is CKD risk
    
    # 3. Extract Feature Importances
    importances = model.feature_importances_
    sorted_idx = np.argsort(importances)[::-1]
    
    feature_importance_list = []
    for idx in sorted_idx:
        feat_name = FEATURE_COLUMNS[idx]
        clinical_name = CLINICAL_LABELS.get(feat_name, feat_name)
        importance_score = float(importances[idx])
        feature_importance_list.append({
            "name": clinical_name,
            "importance": importance_score
        })
        
    return PredictionResponse(
        prediction=prediction_label,
        probability=risk_probability,
        risk_factors=risk_factors if risk_factors else ["No acute risk factors flagged"],
        feature_importance=feature_importance_list
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
