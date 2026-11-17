# Crop Predict Buddy 🌾

A web app that gives farmers **irrigation, fertilizer (N/P/K), and yield recommendations** from soil and weather inputs, backed by ML models served through a Flask API.

**Live demo:** https://crop-predict-buddy.vercel.app

---

## How it works

```
React + TypeScript UI  ──►  Flask prediction API  ──►  Trained models
(form + results dashboard)   (ml_training/flask_api.py)   (Random Forest, XGBoost, Neural Net)
```

1. The user enters soil values (pH, N, P, K, organic matter), weather values (temperature, rainfall, humidity, sunlight), crop type, and planting month.
2. The frontend calls the `/api/predict` endpoint.
3. The API runs the trained models and returns irrigation needs, fertilizer amounts, and expected yield, along with risk indicators.

**Supported crops:** barley, cotton, maize, potato, rice, sorghum, soybean, sugarcane, tomato, wheat.

## Models

For each target (irrigation, nitrogen, phosphorus, potassium, yield, yield increase), three model types are trained and compared:

- Random Forest
- XGBoost
- Neural Network (Keras)

Features include raw soil and weather inputs plus engineered features (`ph_stress`, `nutrient_balance`, `weather_stress`). Evaluation results (MSE, MAE, R²) are saved in `ml_training/models/model_metadata.json`.

> **Note on data:** the training data is **synthetic**. It is generated in `ml_training/dataset_fetcher.py` from agronomic ranges and rules. Because the models learn rules that were used to create the data, the scores are much higher than real-world performance would be. The next step is to train on real field data.

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| ML | Python, scikit-learn, XGBoost, TensorFlow/Keras, pandas |
| API | Flask |
| Deployment | Vercel (frontend), Railway (API) |

## Run locally

**1. Start the ML API**
```bash
cd ml_training
pip install -r requirements.txt
python train_models.py   # optional: retrain the models
python flask_api.py      # serves http://localhost:5000
```

**2. Start the frontend** (in a new terminal, from the repo root)
```bash
npm install
npm run dev
```

To use a deployed API instead, set `VITE_API_BASE_URL` in a `.env` file (for example `VITE_API_BASE_URL=https://your-api.up.railway.app/api`).

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/predict` | Get recommendations |
| GET | `/api/crops` | List supported crops |
| GET | `/api/model-info` | Model and evaluation details |
| POST | `/api/batch-predict` | Recommendations for several inputs at once |

See `ml_training/README.md` for the training pipeline in detail.
