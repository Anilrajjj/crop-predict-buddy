"""
ML Model Trainer for Agricultural Predictions
Trains multiple models for irrigation, fertilizer, and yield predictions
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV, RandomizedSearchCV
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import xgboost as xgb
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, BatchNormalization
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping
import joblib
import json
import os
from typing import Dict, Tuple, List
import matplotlib.pyplot as plt
import seaborn as sns

class AgriculturalModelTrainer:
    def __init__(self, data_dir: str = "data", models_dir: str = "models"):
        self.data_dir = data_dir
        self.models_dir = models_dir
        os.makedirs(models_dir, exist_ok=True)
        
        self.label_encoders = {}
        self.scalers = {}
        self.models = {}
        self.feature_columns = []
        
        # Fast training mode for development (set FAST_TRAIN=0 to disable)
        self.fast_train = os.getenv("FAST_TRAIN", "1") == "1"
        
    def load_and_preprocess_data(self) -> Tuple[pd.DataFrame, Dict[str, pd.DataFrame]]:
        """Load and preprocess the agricultural dataset"""
        print("Loading and preprocessing data...")
        
        # Load combined dataset
        df = pd.read_csv(f"{self.data_dir}/combined_agricultural_dataset.csv")
        
        # Encode categorical variables
        le_crop = LabelEncoder()
        df['crop_type_encoded'] = le_crop.fit_transform(df['crop_type'])
        self.label_encoders['crop_type'] = le_crop
        
        # Define feature columns
        self.feature_columns = [
            'soil_ph', 'nitrogen_ppm', 'phosphorus_ppm', 'potassium_ppm', 'organic_matter_pct',
            'temperature_c', 'rainfall_mm', 'humidity_pct', 'sunlight_hours', 'wind_speed_kmh', 'pressure_hpa',
            'growing_days', 'planting_month', 'crop_type_encoded',
            'ph_stress', 'nutrient_balance', 'weather_stress'
        ]
        
        # Prepare target variables
        targets = {
            'irrigation': df['irrigation_liters_per_acre'],
            'nitrogen_fertilizer': df['nitrogen_fertilizer_kg'],
            'phosphorus_fertilizer': df['phosphorus_fertilizer_kg'],
            'potassium_fertilizer': df['potassium_fertilizer_kg'],
            'yield': df['expected_yield_tons_per_hectare'],
            'yield_increase': df['yield_increase_percent']
        }
        
        # Create target dataframes
        target_dfs = {}
        for target_name, target_values in targets.items():
            target_df = df[self.feature_columns].copy()
            target_df[target_name] = target_values
            target_dfs[target_name] = target_df
        
        print(f"Data loaded: {df.shape[0]} samples, {len(self.feature_columns)} features")
        return df, target_dfs
    
    def train_random_forest_models(self, target_dfs: Dict[str, pd.DataFrame]) -> Dict[str, RandomForestRegressor]:
        """Train Random Forest models for all targets"""
        print("\nTraining Random Forest models...")
        
        rf_models = {}
        
        for target_name, target_df in target_dfs.items():
            print(f"Training RF model for {target_name}...")
            
            X = target_df.drop([target_name], axis=1)
            y = target_df[target_name]
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Scale features
            scaler = StandardScaler()
            X_train_scaled = scaler.fit_transform(X_train)
            X_test_scaled = scaler.transform(X_test)
            
            self.scalers[target_name] = scaler
            # Persist feature scaler for inference
            joblib.dump(scaler, f"{self.models_dir}/scaler_{target_name}.pkl")
            
            # Hyperparameter tuning (fast randomized search by default)
            if self.fast_train:
                param_distributions = {
                    'n_estimators': [100, 150, 200],
                    'max_depth': [None, 12, 20],
                    'min_samples_split': [2, 5],
                    'min_samples_leaf': [1, 2],
                    'max_features': ['sqrt', 'log2', None]
                }
                rf = RandomForestRegressor(random_state=42, n_jobs=-1, bootstrap=True)
                search = RandomizedSearchCV(
                    rf,
                    param_distributions=param_distributions,
                    n_iter=12,
                    cv=3,
                    scoring='neg_mean_squared_error',
                    n_jobs=-1,
                    random_state=42
                )
            else:
                param_grid = {
                    'n_estimators': [100, 200, 300],
                    'max_depth': [10, 20, None],
                    'min_samples_split': [2, 5, 10],
                    'min_samples_leaf': [1, 2, 4],
                    'max_features': ['sqrt', 'log2', None]
                }
                rf = RandomForestRegressor(random_state=42, n_jobs=-1, bootstrap=True)
                search = GridSearchCV(
                    rf, param_grid, cv=5, scoring='neg_mean_squared_error', n_jobs=-1
                )

            search.fit(X_train_scaled, y_train)
            best_rf = search.best_estimator_
            rf_models[target_name] = best_rf
            
            # Evaluate model
            y_pred = best_rf.predict(X_test_scaled)
            mse = mean_squared_error(y_test, y_pred)
            r2 = r2_score(y_test, y_pred)
            mae = mean_absolute_error(y_test, y_pred)
            
            print(f"  {target_name} - MSE: {mse:.2f}, R²: {r2:.3f}, MAE: {mae:.2f}")
            
            # Save model
            joblib.dump(best_rf, f"{self.models_dir}/rf_{target_name}_model.pkl")
        
        return rf_models
    
    def train_xgboost_models(self, target_dfs: Dict[str, pd.DataFrame]) -> Dict[str, xgb.XGBRegressor]:
        """Train XGBoost models for all targets"""
        print("\nTraining XGBoost models...")
        
        xgb_models = {}
        
        for target_name, target_df in target_dfs.items():
            print(f"Training XGBoost model for {target_name}...")
            
            X = target_df.drop([target_name], axis=1)
            y = target_df[target_name]
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Scale features
            scaler = StandardScaler()
            X_train_scaled = scaler.fit_transform(X_train)
            X_test_scaled = scaler.transform(X_test)
            
            # XGBoost parameters
            params = {
                'n_estimators': 200,
                'max_depth': 6,
                'learning_rate': 0.1,
                'subsample': 0.8,
                'colsample_bytree': 0.8,
                'random_state': 42
            }
            
            xgb_model = xgb.XGBRegressor(**params)
            xgb_model.fit(X_train_scaled, y_train)
            xgb_models[target_name] = xgb_model
            
            # Evaluate model
            y_pred = xgb_model.predict(X_test_scaled)
            mse = mean_squared_error(y_test, y_pred)
            r2 = r2_score(y_test, y_pred)
            mae = mean_absolute_error(y_test, y_pred)
            
            print(f"  {target_name} - MSE: {mse:.2f}, R²: {r2:.3f}, MAE: {mae:.2f}")
            
            # Save model
            joblib.dump(xgb_model, f"{self.models_dir}/xgb_{target_name}_model.pkl")
        
        return xgb_models
    
    def train_neural_network_models(self, target_dfs: Dict[str, pd.DataFrame]) -> Dict[str, tf.keras.Model]:
        """Train Neural Network models for all targets"""
        print("\nTraining Neural Network models...")
        
        nn_models = {}
        
        for target_name, target_df in target_dfs.items():
            print(f"Training NN model for {target_name}...")
            
            X = target_df.drop([target_name], axis=1)
            y = target_df[target_name]
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Scale features
            scaler = StandardScaler()
            X_train_scaled = scaler.fit_transform(X_train)
            X_test_scaled = scaler.transform(X_test)
            
            # Scale targets
            y_scaler = StandardScaler()
            y_train_scaled = y_scaler.fit_transform(y_train.values.reshape(-1, 1)).flatten()
            y_test_scaled = y_scaler.transform(y_test.values.reshape(-1, 1)).flatten()
            
            # Build neural network
            model = Sequential([
                Dense(128, activation='relu', input_shape=(X_train_scaled.shape[1],)),
                BatchNormalization(),
                Dropout(0.3),
                Dense(64, activation='relu'),
                BatchNormalization(),
                Dropout(0.3),
                Dense(32, activation='relu'),
                Dropout(0.2),
                Dense(1, activation='linear')
            ])
            
            model.compile(
                optimizer=Adam(learning_rate=0.001),
                loss='mse',
                metrics=['mae']
            )
            
            # Early stopping
            early_stopping = EarlyStopping(
                monitor='val_loss', patience=20, restore_best_weights=True
            )
            
            # Train model
            history = model.fit(
                X_train_scaled, y_train_scaled,
                validation_data=(X_test_scaled, y_test_scaled),
                epochs=200,
                batch_size=32,
                callbacks=[early_stopping],
                verbose=0
            )
            
            nn_models[target_name] = model
            
            # Evaluate model
            y_pred_scaled = model.predict(X_test_scaled, verbose=0).flatten()
            y_pred = y_scaler.inverse_transform(y_pred_scaled.reshape(-1, 1)).flatten()
            
            mse = mean_squared_error(y_test, y_pred)
            r2 = r2_score(y_test, y_pred)
            mae = mean_absolute_error(y_test, y_pred)
            
            print(f"  {target_name} - MSE: {mse:.2f}, R²: {r2:.3f}, MAE: {mae:.2f}")
            
            # Save model
            model.save(f"{self.models_dir}/nn_{target_name}_model.h5")
            joblib.dump(y_scaler, f"{self.models_dir}/nn_{target_name}_scaler.pkl")
        
        return nn_models
    
    def evaluate_models(self, target_dfs: Dict[str, pd.DataFrame]) -> Dict[str, Dict[str, float]]:
        """Evaluate all trained models and return performance metrics"""
        print("\nEvaluating all models...")
        
        evaluation_results = {}
        
        for target_name, target_df in target_dfs.items():
            print(f"Evaluating models for {target_name}...")
            
            X = target_df.drop([target_name], axis=1)
            y = target_df[target_name]
            
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Scale features
            # Load persisted scaler for this target to mirror inference path
            scaler_path = f"{self.models_dir}/scaler_{target_name}.pkl"
            if os.path.exists(scaler_path):
                scaler = joblib.load(scaler_path)
                X_test_scaled = scaler.transform(X_test)
            else:
                # Fallback: fit a temp scaler (shouldn't happen in normal flow)
                temp_scaler = StandardScaler().fit(X)
                X_test_scaled = temp_scaler.transform(X_test)
            
            results = {}
            
            # Evaluate Random Forest
            try:
                rf_model = joblib.load(f"{self.models_dir}/rf_{target_name}_model.pkl")
                y_pred_rf = rf_model.predict(X_test_scaled)
                results['random_forest'] = {
                    'mse': mean_squared_error(y_test, y_pred_rf),
                    'r2': r2_score(y_test, y_pred_rf),
                    'mae': mean_absolute_error(y_test, y_pred_rf)
                }
            except:
                results['random_forest'] = {'mse': float('inf'), 'r2': 0, 'mae': float('inf')}
            
            # Evaluate XGBoost
            try:
                xgb_model = joblib.load(f"{self.models_dir}/xgb_{target_name}_model.pkl")
                y_pred_xgb = xgb_model.predict(X_test_scaled)
                results['xgboost'] = {
                    'mse': mean_squared_error(y_test, y_pred_xgb),
                    'r2': r2_score(y_test, y_pred_xgb),
                    'mae': mean_absolute_error(y_test, y_pred_xgb)
                }
            except:
                results['xgboost'] = {'mse': float('inf'), 'r2': 0, 'mae': float('inf')}
            
            # Evaluate Neural Network
            try:
                nn_model = tf.keras.models.load_model(f"{self.models_dir}/nn_{target_name}_model.h5")
                y_scaler = joblib.load(f"{self.models_dir}/nn_{target_name}_scaler.pkl")
                y_pred_nn_scaled = nn_model.predict(X_test_scaled, verbose=0).flatten()
                y_pred_nn = y_scaler.inverse_transform(y_pred_nn_scaled.reshape(-1, 1)).flatten()
                results['neural_network'] = {
                    'mse': mean_squared_error(y_test, y_pred_nn),
                    'r2': r2_score(y_test, y_pred_nn),
                    'mae': mean_absolute_error(y_test, y_pred_nn)
                }
            except:
                results['neural_network'] = {'mse': float('inf'), 'r2': 0, 'mae': float('inf')}
            
            evaluation_results[target_name] = results
        
        return evaluation_results
    
    def save_model_metadata(self, evaluation_results: Dict[str, Dict[str, Dict[str, float]]]):
        """Save model metadata and performance metrics"""
        metadata = {
            'feature_columns': self.feature_columns,
            'label_encoders': {
                'crop_type': list(self.label_encoders['crop_type'].classes_)
            },
            'evaluation_results': evaluation_results,
            'best_models': {}
        }
        
        # Determine best model for each target
        for target_name, results in evaluation_results.items():
            best_model = min(results.keys(), key=lambda x: results[x]['mse'])
            metadata['best_models'][target_name] = best_model
        
        with open(f"{self.models_dir}/model_metadata.json", 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print(f"Model metadata saved to {self.models_dir}/model_metadata.json")
    
    def train_all_models(self):
        """Train all models and save results"""
        print("Starting comprehensive model training...")
        
        # Load and preprocess data
        df, target_dfs = self.load_and_preprocess_data()
        
        # Train all model types
        rf_models = self.train_random_forest_models(target_dfs)
        xgb_models = self.train_xgboost_models(target_dfs)
        nn_models = self.train_neural_network_models(target_dfs)
        
        # Evaluate models
        evaluation_results = self.evaluate_models(target_dfs)
        
        # Save metadata
        self.save_model_metadata(evaluation_results)
        
        # Print summary
        print("\n" + "="*50)
        print("TRAINING COMPLETE - MODEL PERFORMANCE SUMMARY")
        print("="*50)
        
        for target_name, results in evaluation_results.items():
            print(f"\n{target_name.upper()}:")
            for model_name, metrics in results.items():
                print(f"  {model_name}: R² = {metrics['r2']:.3f}, MAE = {metrics['mae']:.2f}")
        
        print(f"\nModels saved to: {self.models_dir}/")
        print("Ready for deployment!")

if __name__ == "__main__":
    trainer = AgriculturalModelTrainer()
    trainer.train_all_models()

