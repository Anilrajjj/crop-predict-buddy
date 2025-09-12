#!/bin/bash

echo "Starting Agricultural ML Model Training..."
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed or not in PATH"
    echo "Please install Python 3.8+ and try again"
    exit 1
fi

echo "Python found, starting training..."
echo

# Install requirements and train models
python3 train_models.py

echo
echo "Training complete! Starting API server..."
echo

# Start the Flask API
python3 flask_api.py

