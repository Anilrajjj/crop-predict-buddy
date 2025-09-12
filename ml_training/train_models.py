#!/usr/bin/env python3
"""
Main script to train all agricultural ML models
Run this script to generate datasets and train all models
"""

import os
import sys
import subprocess
from dataset_fetcher import AgriculturalDatasetFetcher
from model_trainer import AgriculturalModelTrainer

def install_requirements():
    """Install required Python packages"""
    print("Installing Python requirements...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("Requirements installed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"Error installing requirements: {e}")
        sys.exit(1)

def main():
    """Main training pipeline"""
    print("="*60)
    print("AGRICULTURAL ML MODEL TRAINING PIPELINE")
    print("="*60)
    
    # Install requirements
    install_requirements()
    
    # Step 1: Generate datasets
    print("\n1. GENERATING AGRICULTURAL DATASETS")
    print("-" * 40)
    fetcher = AgriculturalDatasetFetcher()
    
    # Generate all datasets
    crop_df = fetcher.fetch_crop_yield_dataset()
    weather_df = fetcher.fetch_weather_dataset()
    combined_df = fetcher.create_combined_dataset()
    
    print(f"✓ Generated {len(combined_df)} training samples")
    print(f"✓ Features: {len(combined_df.columns) - 6} input features")
    print(f"✓ Targets: 6 prediction targets")
    
    # Step 2: Train models
    print("\n2. TRAINING MACHINE LEARNING MODELS")
    print("-" * 40)
    trainer = AgriculturalModelTrainer()
    trainer.train_all_models()
    
    print("\n3. MODEL TRAINING COMPLETE!")
    print("-" * 40)
    print("✓ Random Forest models trained")
    print("✓ XGBoost models trained") 
    print("✓ Neural Network models trained")
    print("✓ Models saved to 'models/' directory")
    print("✓ Performance metrics saved")
    
    # Step 3: Test API
    print("\n4. TESTING PREDICTION API")
    print("-" * 40)
    try:
        from model_predictor import AgriculturalPredictor
        predictor = AgriculturalPredictor()
        
        # Test prediction
        test_input = {
            'soil': {
                'ph': 6.5,
                'nitrogen': 20,
                'phosphorus': 15,
                'potassium': 25,
                'organicMatter': 3.0
            },
            'weather': {
                'temperature': 25,
                'rainfall': 100,
                'humidity': 65,
                'sunlightHours': 8
            },
            'cropType': 'rice'
        }
        
        prediction = predictor.predict_all(test_input)
        print("✓ Test prediction successful!")
        print(f"✓ Irrigation: {prediction['irrigation']['litersPerAcre']} L/acre")
        print(f"✓ Fertilizer: N={prediction['fertilizer']['nitrogen']}, P={prediction['fertilizer']['phosphorus']}, K={prediction['fertilizer']['potassium']}")
        print(f"✓ Yield: {prediction['yieldPrediction']['expectedYield']} tons/hectare")
        
    except Exception as e:
        print(f"⚠ API test failed: {e}")
    
    print("\n" + "="*60)
    print("TRAINING PIPELINE COMPLETE!")
    print("="*60)
    print("\nNext steps:")
    print("1. Start the Flask API: python flask_api.py")
    print("2. Update React app to use the API")
    print("3. Deploy models to production")
    print("\nModels are ready for accurate agricultural predictions!")

if __name__ == "__main__":
    main()

