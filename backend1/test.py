import joblib

# Load the scaler
scaler = joblib.load('model/scaler_prominence.joblib')

# Print the number of features
print(f"Number of features: {scaler.n_features_in_}")

# Print feature names if available
if hasattr(scaler, 'feature_names_in_'):
    print(f"Feature names: {scaler.feature_names_in_}")
else:
    print("Feature names not available. Check training data or scaler version.")