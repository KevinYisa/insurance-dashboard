import os
import json
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder, FunctionTransformer
from sklearn.impute import SimpleImputer
import joblib
from pathlib import Path


# ---------- Configuration Loader ----------
def load_config(config_path="config.json"):
    with open(config_path, 'r') as f:
        config = json.load(f)
    return config


# ---------- Feature Engineering (Step 1) ----------
def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Add 3 explainable risk features before scaling."""
    df = df.copy()
    
    # Feature 1: Metabolic burden (multiplicative age-BMI risk)
    df['obesity_age_score'] = (df['age'] * df['bmi']) / 100.0
    
    # Feature 2: Dependency/financial strain risk
    df['dependency_load'] = df['children'] * (df['age'] / 50.0)
    
    # Feature 3: Lifestyle penalty (0 if discount eligible, else BMI-based penalty)
    discount_int = df['discount_eligibility'].astype(int)
    df['lifestyle_penalty'] = (1 - discount_int) * (df['bmi'] / 30.0)
    
    return df


# ---------- Core Processing Functions ----------
def load_data(filepath):
    return pd.read_csv(filepath)


def separate_features_target(df, target, drop_cols):
    X = df.drop(columns=[target] + drop_cols, errors='ignore')
    y = df[target]
    return X, y


def build_full_pipeline(config):
    # Base columns from config
    numeric_cols = config['numeric_features'].copy()
    cat_cols = config['categorical_features'].copy()
    bool_cols = config['boolean_features'].copy()
    
    # ADD engineered columns to numeric list dynamically
    engineered_cols = ['obesity_age_score', 'dependency_load', 'lifestyle_penalty']
    numeric_cols.extend(engineered_cols)
    
    # Update config in-memory for later exports
    config['_final_numeric_cols'] = numeric_cols
    config['_final_cat_cols'] = cat_cols
    config['_final_bool_cols'] = bool_cols

    # Step 1: Feature Engineering
    engineer_transformer = FunctionTransformer(engineer_features, validate=False)

    # Step 2: Column-wise transformations
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
        ('onehot', OneHotEncoder(handle_unknown='ignore', drop='first'))
    ])

    bool_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='constant', fill_value=0)),
        ('passthrough', 'passthrough')
    ])

    column_transformer = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_cols),
            ('cat', categorical_transformer, cat_cols),
            ('bool', bool_transformer, bool_cols)
        ],
        remainder='drop'
    )

    # Full pipeline: Engineer -> ColumnTransform
    full_pipeline = Pipeline(steps=[
        ('engineer', engineer_transformer),
        ('col_transform', column_transformer)
    ])
    
    return full_pipeline


def extract_params_for_go(pipeline, config):
    """
    Extract StandardScaler means/stds and OneHotEncoder categories
    to export as a JSON file for Go backend inference.
    """
    col_transform = pipeline.named_steps['col_transform']
    
    # Extract numeric scaler
    scaler = col_transform.named_transformers_['num'].named_steps['scaler']
    numeric_cols = config['_final_numeric_cols']
    
    # Extract categorical encoder
    encoder = col_transform.named_transformers_['cat'].named_steps['onehot']
    cat_cols = config['_final_cat_cols']
    
    params = {
        "numeric_features": {
            "columns": numeric_cols,
            "means": scaler.mean_.tolist(),
            "stds": scaler.scale_.tolist()
        },
        "categorical_features": {
            "columns": cat_cols,
            "categories": [list(cat) for cat in encoder.categories_]
        },
        "boolean_features": {
            "columns": config['_final_bool_cols']
        }
    }
    return params


def save_artifacts(pipeline, X_train, X_test, y_train, y_test, config):
    output_dir = Path(config['output_dir'])
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # 1. Save full Python pipeline (for retraining/evaluation)
    joblib.dump(pipeline, output_dir / 'full_pipeline.joblib')
    
    # 2. Save transformed data (for model training)
    X_train_t = pipeline.transform(X_train)
    X_test_t = pipeline.transform(X_test)
    np.save(output_dir / 'X_train.npy', X_train_t)
    np.save(output_dir / 'X_test.npy', X_test_t)
    np.save(output_dir / 'y_train.npy', y_train.values)
    np.save(output_dir / 'y_test.npy', y_test.values)
    
    # 3. Export JSON parameters for Go
    go_params = extract_params_for_go(pipeline, config)
    with open(output_dir / 'preprocessing_params.json', 'w') as f:
        json.dump(go_params, f, indent=2)
    
    print(f"All artifacts saved to {output_dir}")
    print(f"Go-compatible params saved to {output_dir / 'preprocessing_params.json'}")


# ---------- Main Execution ----------
def main():
    config = load_config()
    print("Loaded config.")

    # Load and split
    df = load_data(config['data_file'])
    X, y = separate_features_target(df, config['target'], config['drop_columns'])
    
    # Ensure bool columns are int
    for col in config['boolean_features']:
        if col in X.columns:
            X[col] = X[col].astype(int)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=config['test_size'],
        random_state=config['random_state']
    )

    # Build and fit pipeline
    pipeline = build_full_pipeline(config)
    pipeline.fit(X_train, y_train)  # Fit on training data only

    # Save everything
    save_artifacts(pipeline, X_train, X_test, y_train, y_test, config)
    print("Preprocessing complete.")


if __name__ == "__main__":
    main()