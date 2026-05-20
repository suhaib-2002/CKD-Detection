import pandas as pd
import pickle
from sklearn.ensemble import RandomForestClassifier

# Load preprocessed dataset
df = pd.read_csv(r"e:\ckd-prediction-system-main\model\cleaned_ckd.csv")

# Ensure 'dm' and 'cad' nominal columns are numerical representations
df['dm'] = df['dm'].apply(lambda x: 1 if x == 'yes' or x == 1 or x == '1' else 0)
df['cad'] = df['cad'].apply(lambda x: 1 if x == 'yes' or x == 1 or x == '1' else 0)

# Drop rows where 'class' (target variable) is NaN
df_cleaned = df.dropna(subset=['class'])

X = df_cleaned.drop('class', axis=1)
y = df_cleaned['class']

# Fit the classifier
rf = RandomForestClassifier(random_state=42)
rf.fit(X, y)

print(f"Model successfully trained on {len(df_cleaned)} samples.")
print("Feature columns order:", X.columns.tolist())

# Export the model
model_path = r"e:\ckd-prediction-system-main\model\model.pkl"
with open(model_path, 'wb') as f:
    pickle.dump(rf, f)
print(f"Model serialized and saved to: {model_path}")
