# Chronic Kidney Disease (CKD) Detection Portal 🏥🧠

A state-of-the-art clinical decision support system designed to predict and analyze Chronic Kidney Disease (CKD) using an ensemble **Random Forest Classifier** and a high-fidelity React/Vite dashboard interface.

---

## 🚀 Key Features

*   **Dynamic Prediction Engine**: Integrates a trained Scikit-Learn `RandomForestClassifier` with a lightweight, high-performance FastAPI backend.
*   **Intuitive 4-Phase Wizard**: Guides clinicians through vitals, hematology, chemistry, and systemic history parameters with robust client-side validation.
*   **Real-time Feature Importance**: Ranks all 24 medical parameters descending according to their contribution to the active patient risk model.
*   **Clinical Risk Factor Auditing**: Dynamically flags risk factors such as Proteinuria, Low Specific Gravity, Low Hemoglobin, and Hypertension history.
*   **HIPAA Audit Logs**: Implements access logging, neural weight calibrations, and clinical user profile auditing.
*   **Sleek Modern UI**: Premium aesthetics using smooth micro-animations, tailored dark slate themes, and responsive design systems.

---

## 🛠️ Technology Stack

### Backend & Machine Learning
*   **Language**: Python 3.10+
*   **Server Framework**: FastAPI (Uvicorn)
*   **ML Libraries**: Scikit-Learn, NumPy, Pandas
*   **Serialization**: Pickle

### Frontend Portal
*   **Core**: React 18, TypeScript, Vite
*   **Styles**: Custom Vanilla CSS and modern Tailwind components
*   **Animations**: Framer Motion
*   **Icons**: Lucide React

---

## 📁 Repository Structure

```text
ckd-prediction-system-main/
├── ckd-backend/          # FastAPI ML Inference Server
│   ├── main.py           # Model loader, scaler, risk-analysis & CORS config
│   └── requirements.txt  # Python package dependencies
├── ckd-frontend/         # React SPA Portal
│   ├── src/              # Multi-step forms, layouts, settings, and pages
│   ├── index.html        # Main template
│   └── package.json      # React project script configuration
└── model/                # ML Pipeline Assets
    ├── train_model.py    # Clean-train pipeline script
    ├── model.pkl         # Serialized Random Forest model
    ├── cleaned_ckd.csv   # Structured UCI clinical training dataset
    └── CCP.ipynb         # Model exploratory analysis notebook
```

---

## ⚙️ Quick Start

### 1. Launch the Backend Server
Navigate to `ckd-backend/` and install dependencies:
```bash
cd ckd-backend
pip install -r requirements.txt
```
Start the FastAPI server:
```bash
python main.py
```
The server will boot on `http://localhost:8000`.

### 2. Launch the Frontend Portal
Navigate to `ckd-frontend/` and install node packages:
```bash
cd ckd-frontend
npm install
```
Start the Vite local development server:
```bash
npm run dev
```
The application will boot on `http://localhost:5173` (or the next available port, e.g. `5174`).
