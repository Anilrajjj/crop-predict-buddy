"""
Flask API Server for Agricultural Predictions
Serves trained ML models to the React frontend
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from model_predictor import AgriculturalPredictor

app = Flask(__name__)
CORS(app)

# Initialize predictor
predictor = AgriculturalPredictor()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Agricultural Prediction API is running',
        'models_loaded': len(predictor.models) > 0
    })

@app.route('/api/predict', methods=['POST'])
def predict_agriculture():
    """Main prediction endpoint"""
    try:
        # Get input data from request
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['soil', 'weather', 'cropType']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'error': f'Missing required field: {field}',
                    'status': 'error'
                }), 400
        
        # Validate soil data
        soil_fields = ['ph', 'nitrogen', 'phosphorus', 'potassium', 'organicMatter']
        for field in soil_fields:
            if field not in data['soil']:
                return jsonify({
                    'error': f'Missing soil field: {field}',
                    'status': 'error'
                }), 400
        
        # Validate weather data
        weather_fields = ['temperature', 'rainfall', 'humidity', 'sunlightHours']
        for field in weather_fields:
            if field not in data['weather']:
                return jsonify({
                    'error': f'Missing weather field: {field}',
                    'status': 'error'
                }), 400
        
        # Generate predictions
        predictions = predictor.predict_all(data)
        
        return jsonify({
            'status': 'success',
            'predictions': predictions,
            'model_info': {
                'type': 'Random Forest + XGBoost + Neural Networks',
                'accuracy': 'High',
                'data_source': 'Agricultural Research Dataset'
            }
        })
        
    except Exception as e:
        return jsonify({
            'error': f'Prediction failed: {str(e)}',
            'status': 'error'
        }), 500

@app.route('/api/crops', methods=['GET'])
def get_crop_types():
    """Get available crop types"""
    try:
        crops = predictor.label_encoders['crop_type']
        return jsonify({
            'status': 'success',
            'crops': crops
        })
    except Exception as e:
        return jsonify({
            'error': f'Failed to get crop types: {str(e)}',
            'status': 'error'
        }), 500

@app.route('/api/model-info', methods=['GET'])
def get_model_info():
    """Get model information and performance metrics"""
    try:
        with open('models/model_metadata.json', 'r') as f:
            metadata = json.load(f)
        
        return jsonify({
            'status': 'success',
            'model_info': {
                'feature_count': len(metadata['feature_columns']),
                'best_models': metadata['best_models'],
                'evaluation_results': metadata['evaluation_results']
            }
        })
    except Exception as e:
        return jsonify({
            'error': f'Failed to get model info: {str(e)}',
            'status': 'error'
        }), 500

@app.route('/api/batch-predict', methods=['POST'])
def batch_predict():
    """Batch prediction endpoint for multiple inputs"""
    try:
        data = request.get_json()
        
        if 'inputs' not in data or not isinstance(data['inputs'], list):
            return jsonify({
                'error': 'Missing or invalid inputs array',
                'status': 'error'
            }), 400
        
        predictions = []
        for input_data in data['inputs']:
            try:
                pred = predictor.predict_all(input_data)
                predictions.append({
                    'input': input_data,
                    'predictions': pred,
                    'status': 'success'
                })
            except Exception as e:
                predictions.append({
                    'input': input_data,
                    'error': str(e),
                    'status': 'error'
                })
        
        return jsonify({
            'status': 'success',
            'predictions': predictions,
            'total_processed': len(predictions)
        })
        
    except Exception as e:
        return jsonify({
            'error': f'Batch prediction failed: {str(e)}',
            'status': 'error'
        }), 500

if __name__ == '__main__':
    print("Starting Agricultural Prediction API...")
    print("API Endpoints:")
    print("  GET  /api/health - Health check")
    print("  POST /api/predict - Single prediction")
    print("  GET  /api/crops - Available crop types")
    print("  GET  /api/model-info - Model performance info")
    print("  POST /api/batch-predict - Batch predictions")
    print("\nStarting server on http://localhost:5000")
    
    app.run(host='0.0.0.0', port=5000, debug=True)

