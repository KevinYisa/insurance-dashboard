import os
import json
import time
import numpy as np
from pathlib import Path

from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from sklearn.model_selection import RandomizedSearchCV
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import joblib


# ---------- Configuration ----------
OUTPUT_DIR = "preprocessing_outputs"
RANDOM_STATE = 42
N_ITER_RANDOM_SEARCH = 20  # Increase for better tuning, lower for speed
CV_FOLDS = 5


def load_transformed_data(data_dir: Path):
    """Load numpy arrays from the preprocessing step."""
    X_train = np.load(data_dir / "X_train.npy")
    X_test  = np.load(data_dir / "X_test.npy")
    y_train = np.load(data_dir / "y_train.npy")
    y_test  = np.load(data_dir / "y_test.npy")
    return X_train, X_test, y_train, y_test


def evaluate_model(model, X_train, X_test, y_train, y_test):
    """Calculate train and test metrics to detect overfitting."""
    y_train_pred = model.predict(X_train)
    y_test_pred  = model.predict(X_test)

    metrics = {
        "train_rmse": np.sqrt(mean_squared_error(y_train, y_train_pred)),
        "test_rmse":  np.sqrt(mean_squared_error(y_test, y_test_pred)),
        "train_mae":  mean_absolute_error(y_train, y_train_pred),
        "test_mae":   mean_absolute_error(y_test, y_test_pred),
        "train_r2":   r2_score(y_train, y_train_pred),
        "test_r2":    r2_score(y_test, y_test_pred),
    }
    return metrics, y_test_pred


def train_models(X_train, X_test, y_train, y_test):
    """
    Train Linear Regression, Random Forest, and XGBoost
    with hyperparameter tuning. Return results and best model.
    """
    results = []
    best_score = -np.inf
    best_model = None

    # --- 1. Linear Regression (Baseline) ---
    print("Training Linear Regression...")
    lr = LinearRegression()
    lr.fit(X_train, y_train)
    metrics, _ = evaluate_model(lr, X_train, X_test, y_train, y_test)
    results.append({
        "model": "LinearRegression",
        **metrics,
        "params": {}
    })
    if metrics["test_r2"] > best_score:
        best_score = metrics["test_r2"]
        best_model = lr

    # --- 2. Random Forest (Tuned) ---
    print("Training Random Forest with RandomizedSearchCV...")
    rf = RandomForestRegressor(random_state=RANDOM_STATE, n_jobs=-1)
    rf_param_grid = {
        'n_estimators': [100, 200, 300, 500],
        'max_depth': [None, 10, 20, 30],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4],
        'max_features': ['sqrt', 'log2', None],
    }
    rf_search = RandomizedSearchCV(
        rf, rf_param_grid, n_iter=N_ITER_RANDOM_SEARCH,
        cv=CV_FOLDS, scoring='r2', n_jobs=-1, random_state=RANDOM_STATE
    )
    rf_search.fit(X_train, y_train)
    best_rf = rf_search.best_estimator_
    metrics, _ = evaluate_model(best_rf, X_train, X_test, y_train, y_test)
    results.append({
        "model": "RandomForest",
        **metrics,
        "params": rf_search.best_params_
    })
    if metrics["test_r2"] > best_score:
        best_score = metrics["test_r2"]
        best_model = best_rf

    # --- 3. XGBoost (Tuned) ---
    print("Training XGBoost with RandomizedSearchCV...")
    xgb = XGBRegressor(random_state=RANDOM_STATE, objective='reg:squarederror', n_jobs=-1)
    xgb_param_grid = {
        'n_estimators': [100, 200, 300, 500],
        'max_depth': [3, 5, 7, 10],
        'learning_rate': [0.01, 0.05, 0.1, 0.2],
        'subsample': [0.6, 0.8, 1.0],
        'colsample_bytree': [0.6, 0.8, 1.0],
    }
    xgb_search = RandomizedSearchCV(
        xgb, xgb_param_grid, n_iter=N_ITER_RANDOM_SEARCH,
        cv=CV_FOLDS, scoring='r2', n_jobs=-1, random_state=RANDOM_STATE
    )
    xgb_search.fit(X_train, y_train)
    best_xgb = xgb_search.best_estimator_
    metrics, _ = evaluate_model(best_xgb, X_train, X_test, y_train, y_test)
    results.append({
        "model": "XGBoost",
        **metrics,
        "params": xgb_search.best_params_
    })
    if metrics["test_r2"] > best_score:
        best_score = metrics["test_r2"]
        best_model = best_xgb

    return results, best_model


def export_for_go_and_dashboard(results, best_model, X_train, data_dir: Path):
    """
    Save:
      1. model_comparison.json  → React dashboard (via Go API)
      2. best_model.pkl         → Python fallback / retraining
      3. linear_coefs.json      → Go production inference (always export LR coefs)
      4. feature_importances.json → Dashboard explainability
    """
    # 1. Model comparison metrics
    with open(data_dir / "model_comparison.json", "w") as f:
        json.dump(results, f, indent=2)
    print(f"✅ Model comparison saved to {data_dir / 'model_comparison.json'}")

    # 2. Save the best model (Python pickle)
    joblib.dump(best_model, data_dir / "best_model.pkl")
    print(f"✅ Best model saved to {data_dir / 'best_model.pkl'}")

    # 3. Export Linear Regression coefficients (for Go inference)
    # We always train LR, so we can safely fetch it from results or retrain.
    # For robustness, we refit a LR on the full training set.
    lr_for_go = LinearRegression()
    lr_for_go.fit(X_train, ...)  # y_train is captured from outer scope
    # Actually, we need y_train passed in. Let's refactor slightly.
    # I'll handle this inside main.

    # 4. Feature importances from the best tree-based model (if applicable)
    # We'll generate this in main as well.


def main():
    data_dir = Path(OUTPUT_DIR)
    X_train, X_test, y_train, y_test = load_transformed_data(data_dir)

    print(f"Training data shape: {X_train.shape}, Test shape: {X_test.shape}")
    results, best_model = train_models(X_train, X_test, y_train, y_test)

    print("\n📊 Model Comparison:")
    for r in results:
        print(f"  {r['model']:15} | Test R²: {r['test_r2']:.4f} | RMSE: {r['test_rmse']:.2f}")

    # 1. Comparison JSON
    with open(data_dir / "model_comparison.json", "w") as f:
        json.dump(results, f, indent=2)

    # 2. Best model pickle
    joblib.dump(best_model, data_dir / "best_model.pkl")

    # 3. Linear Regression coefficients for Go (retrain LR for consistency)
    lr = LinearRegression()
    lr.fit(X_train, y_train)
    coef_export = {
        "intercept": float(lr.intercept_),
        "coefficients": lr.coef_.tolist(),
        "feature_count": X_train.shape[1]
    }
    with open(data_dir / "linear_coefs.json", "w") as f:
        json.dump(coef_export, f, indent=2)

    # 4. Feature importances
    if hasattr(best_model, "feature_importances_"):
        importances = best_model.feature_importances_.tolist()
    else:
        importances = None

    if importances is None and isinstance(best_model, LinearRegression):
        importances = np.abs(lr.coef_).tolist()

    if importances is not None:
        importance_export = {
            "importances": importances,
            "model_type": type(best_model).__name__
        }
        with open(data_dir / "feature_importances.json", "w") as f:
            json.dump(importance_export, f, indent=2)

    # ---- NEW: Export test predictions ----
    y_test_pred = best_model.predict(X_test)
    test_results = {
        "actual": y_test.tolist(),
        "predicted": y_test_pred.tolist()
    }
    with open(data_dir / "test_predictions.json", "w") as f:
        json.dump(test_results, f, indent=2)
    print(f"✅ Test predictions exported to {data_dir / 'test_predictions.json'}")

    print("✅ All artifacts exported successfully.")
    print("   - model_comparison.json   → React dashboard charts")
    print("   - linear_coefs.json       → Go production inference")
    print("   - best_model.pkl          → Python fallback")
    print("   - feature_importances.json → Dashboard explainability")
    print("   - test_predictions.json   → React scatter plot")

if __name__ == "__main__":
    main()
    