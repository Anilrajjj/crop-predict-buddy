import json
import os
import numpy as np
import streamlit as st

from model_predictor import AgriculturalPredictor

st.set_page_config(page_title="Crop Predict Buddy", page_icon="🌾", layout="centered")

@st.cache_resource
def load_predictor():
    return AgriculturalPredictor(models_dir="models")

predictor = load_predictor()

st.title("🌾 Crop Predict Buddy")
st.caption("Data‑driven irrigation, fertilizer and yield recommendations")

with st.form("inputs"):
    col1, col2 = st.columns(2)
    with col1:
        crop = st.selectbox("Crop Type", [
            "rice", "wheat", "maize", "cotton", "sugarcane",
            "tomato", "potato", "soybean", "barley", "sorghum",
            "groundnut", "mustard"
        ])
        ph = st.number_input("Soil pH", value=6.5, min_value=3.0, max_value=10.0, step=0.1)
        nitrogen = st.number_input("Nitrogen (ppm)", value=20.0, min_value=0.0)
        phosphorus = st.number_input("Phosphorus (ppm)", value=15.0, min_value=0.0)
        potassium = st.number_input("Potassium (ppm)", value=25.0, min_value=0.0)
        organic = st.number_input("Organic Matter (%)", value=3.0, min_value=0.0, step=0.1)
    with col2:
        temp = st.number_input("Temperature (°C)", value=25.0)
        rain = st.number_input("Rainfall (mm/month)", value=100.0, min_value=0.0)
        humid = st.number_input("Humidity (%)", value=65.0, min_value=0.0, max_value=100.0)
        sun = st.number_input("Sunlight Hours/Day", value=8.0, min_value=0.0, max_value=16.0)

    submitted = st.form_submit_button("Get Recommendations")

if submitted:
    input_data = {
        "soil": {
            "ph": float(ph),
            "nitrogen": float(nitrogen),
            "phosphorus": float(phosphorus),
            "potassium": float(potassium),
            "organicMatter": float(organic)
        },
        "weather": {
            "temperature": float(temp),
            "rainfall": float(rain),
            "humidity": float(humid),
            "sunlightHours": float(sun)
        },
        "cropType": crop
    }

    with st.spinner("Running models..."):
        results = predictor.predict_all(input_data)

    st.subheader("Irrigation")
    irr = results["irrigation"]
    st.metric("Liters per acre", irr["litersPerAcre"])
    st.write(f"Method: {irr['method']} · Frequency: {irr['frequency']} · Efficiency: {irr['efficiency']}%")

    st.subheader("Fertilizer (kg)")
    fert = results["fertilizer"]
    c1, c2, c3 = st.columns(3)
    c1.metric("Nitrogen", fert["nitrogen"])
    c2.metric("Phosphorus", fert["phosphorus"])
    c3.metric("Potassium", fert["potassium"])
    st.write("Schedule:", ", ".join(fert["applicationSchedule"]))

    st.subheader("Yield")
    y = results["yieldPrediction"]
    st.metric("Expected Yield (t/ha)", y["expectedYield"])
    st.write(f"Confidence: {y['confidence']}%")
    st.write("Limiting Factors:", ", ".join(y["limitingFactors"]))

    st.subheader("Risk & Economics")
    r = results["riskAssessment"]
    st.write(f"Overall Risk: {r['overallRisk']} · Water: {r['waterStress']} · Nutrient: {r['nutrientDeficiency']} · Climate: {r['climateRisk']}")
    e = results["economicImpact"]
    st.write(f"Cost Reduction: {e['costReduction']}% · Profit Increase: {e['profitIncrease']}%")

    st.info(results["sustainabilityTip"]) 

st.caption("Models are loaded from /ml_training/models. Train locally with python ml_training/train_models.py")


