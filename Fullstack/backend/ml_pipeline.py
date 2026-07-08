import os
import argparse
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

# Paths
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')
os.makedirs(MODEL_DIR, exist_ok=True)

def load_data(filepath):
    ext = os.path.splitext(filepath)[1].lower()
    if ext == '.csv':
        return pd.read_csv(filepath)
    elif ext in ['.xls', '.xlsx']:
        return pd.read_excel(filepath)
    elif ext == '.json':
        return pd.read_json(filepath)
    else:
        raise ValueError(f"Unsupported file format: {ext}")

def run_pipeline(dataset_path, target_col, output_model_name):
    print(f"--- Starting AI Model Training Pipeline ---")
    print(f"Dataset: {dataset_path}")
    print(f"Target Column: {target_col}")
    
    if not os.path.exists(dataset_path):
        print(f"Error: Dataset not found at {dataset_path}")
        return
        
    try:
        df = load_data(dataset_path)
    except Exception as e:
        print(f"Error loading data: {e}")
        return
        
    if target_col not in df.columns:
        print(f"Error: Target column '{target_col}' not found in dataset.")
        return
    
    print("Cleaning and engineering features (Handling missing values/duplicates)...")
    # Automatic Cleaning
    df = df.drop_duplicates()
    
    # Simple imputation: numerical with mean, categorical with mode
    for col in df.columns:
        if df[col].dtype in ['float64', 'int64']:
            df[col] = df[col].fillna(df[col].mean())
        else:
            df[col] = df[col].fillna(df[col].mode()[0])
            
    # Auto-encode categorical variables (simplified)
    X = df.drop(columns=[target_col])
    X = pd.get_dummies(X, drop_first=True)
    y = df[target_col]
    
    print("Splitting dataset into train and test sets...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training Random Forest Classifier model...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    print("Evaluating model...")
    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)
    
    print(f"\nModel Accuracy: {accuracy * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, predictions))
    
    model_path = os.path.join(MODEL_DIR, output_model_name)
    print(f"Saving trained model to {model_path}")
    joblib.dump(model, model_path)
    print("--- Pipeline Completed Successfully ---")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generic ML Pipeline for Kaggle Datasets")
    parser.add_argument("--dataset", type=str, default=os.path.join(os.path.dirname(__file__), 'data', 'sample_student_performance.csv'), help="Path to dataset")
    parser.add_argument("--target", type=str, default="passed", help="Target column name")
    parser.add_argument("--output", type=str, default="student_performance_model.joblib", help="Output model filename")
    
    args = parser.parse_args()
    run_pipeline(args.dataset, args.target, args.output)
