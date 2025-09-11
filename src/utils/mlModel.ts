// Mock ML Model - In production, this would call a real API endpoint
// This simulates the behavior of a trained Random Forest/XGBoost model

interface SoilData {
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
}

interface WeatherData {
  temperature: number;
  rainfall: number;
  humidity: number;
  sunlightHours: number;
}

interface InputData {
  soil: SoilData;
  weather: WeatherData;
  cropType: string;
}

interface PredictionResults {
  irrigation: {
    litersPerAcre: number;
    frequency: string;
    method: string;
  };
  fertilizer: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  sustainabilityTip: string;
  confidence: number;
  cropYieldIncrease: number;
}

// Simulated crop requirements database
const cropRequirements = {
  rice: {
    baseWater: 1200,
    baseFertilizer: { n: 120, p: 60, k: 40 },
    phOptimal: 6.0,
    tempOptimal: 28,
    yieldBoost: 25
  },
  wheat: {
    baseWater: 800,
    baseFertilizer: { n: 100, p: 50, k: 30 },
    phOptimal: 6.5,
    tempOptimal: 22,
    yieldBoost: 18
  },
  maize: {
    baseWater: 600,
    baseFertilizer: { n: 150, p: 70, k: 80 },
    phOptimal: 6.8,
    tempOptimal: 25,
    yieldBoost: 22
  },
  cotton: {
    baseWater: 700,
    baseFertilizer: { n: 80, p: 40, k: 60 },
    phOptimal: 7.0,
    tempOptimal: 30,
    yieldBoost: 20
  },
  sugarcane: {
    baseWater: 1500,
    baseFertilizer: { n: 200, p: 80, k: 120 },
    phOptimal: 6.5,
    tempOptimal: 28,
    yieldBoost: 30
  },
  tomato: {
    baseWater: 500,
    baseFertilizer: { n: 140, p: 60, k: 180 },
    phOptimal: 6.2,
    tempOptimal: 24,
    yieldBoost: 35
  },
  potato: {
    baseWater: 400,
    baseFertilizer: { n: 110, p: 80, k: 140 },
    phOptimal: 6.0,
    tempOptimal: 18,
    yieldBoost: 28
  },
  soybean: {
    baseWater: 450,
    baseFertilizer: { n: 60, p: 40, k: 50 },
    phOptimal: 6.8,
    tempOptimal: 25,
    yieldBoost: 15
  }
};

const sustainabilityTips = [
  "Use drip irrigation to save up to 60% water compared to flood irrigation while maintaining crop health.",
  "Implement crop rotation with legumes to naturally fix nitrogen and reduce fertilizer dependency by 30%.",
  "Apply organic compost to improve soil structure and water retention, reducing irrigation needs by 25%.",
  "Use precision agriculture techniques with IoT sensors to optimize resource usage and reduce waste.",
  "Consider companion planting to naturally control pests and improve soil nutrients.",
  "Implement rainwater harvesting systems to reduce dependency on groundwater resources.",
  "Use cover crops during off-seasons to prevent soil erosion and maintain soil fertility naturally.",
  "Apply fertilizers during optimal weather conditions to maximize uptake and minimize runoff."
];

// Simulate ML model prediction with realistic adjustments
export const predictAgricultureRecommendations = async (
  inputData: InputData
): Promise<PredictionResults> => {
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const { soil, weather, cropType } = inputData;
  const cropReq = cropRequirements[cropType as keyof typeof cropRequirements];
  
  if (!cropReq) {
    throw new Error(`Crop type ${cropType} not supported`);
  }

  // Calculate irrigation needs based on multiple factors
  let irrigationMultiplier = 1.0;
  
  // Adjust for rainfall
  if (weather.rainfall < 50) irrigationMultiplier += 0.4;
  else if (weather.rainfall < 100) irrigationMultiplier += 0.2;
  else if (weather.rainfall > 200) irrigationMultiplier -= 0.3;
  
  // Adjust for temperature
  const tempDiff = Math.abs(weather.temperature - cropReq.tempOptimal);
  irrigationMultiplier += tempDiff * 0.02;
  
  // Adjust for humidity
  if (weather.humidity < 40) irrigationMultiplier += 0.2;
  else if (weather.humidity > 80) irrigationMultiplier -= 0.1;
  
  // Adjust for sunlight
  if (weather.sunlightHours > 10) irrigationMultiplier += 0.1;
  else if (weather.sunlightHours < 6) irrigationMultiplier -= 0.1;
  
  // Adjust for soil organic matter (better water retention)
  if (soil.organicMatter > 4) irrigationMultiplier -= 0.15;
  else if (soil.organicMatter < 2) irrigationMultiplier += 0.2;

  const finalIrrigation = Math.max(200, Math.round(cropReq.baseWater * irrigationMultiplier));

  // Calculate fertilizer needs
  let nMultiplier = 1.0, pMultiplier = 1.0, kMultiplier = 1.0;
  
  // Adjust based on soil nutrient levels
  if (soil.nitrogen < 15) nMultiplier += 0.3;
  else if (soil.nitrogen > 30) nMultiplier -= 0.2;
  
  if (soil.phosphorus < 10) pMultiplier += 0.4;
  else if (soil.phosphorus > 25) pMultiplier -= 0.3;
  
  if (soil.potassium < 20) kMultiplier += 0.3;
  else if (soil.potassium > 40) kMultiplier -= 0.2;
  
  // Adjust for pH (affects nutrient availability)
  const phDiff = Math.abs(soil.ph - cropReq.phOptimal);
  if (phDiff > 1) {
    nMultiplier += 0.2;
    pMultiplier += 0.2;
    kMultiplier += 0.2;
  }
  
  // Adjust for organic matter (natural nutrients)
  if (soil.organicMatter > 4) {
    nMultiplier -= 0.2;
    pMultiplier -= 0.15;
  }

  const finalN = Math.round(cropReq.baseFertilizer.n * nMultiplier);
  const finalP = Math.round(cropReq.baseFertilizer.p * pMultiplier);
  const finalK = Math.round(cropReq.baseFertilizer.k * kMultiplier);

  // Determine irrigation method and frequency
  let method = "Drip Irrigation";
  let frequency = "Daily";
  
  if (finalIrrigation > 1000) {
    method = weather.rainfall > 150 ? "Sprinkler System" : "Drip Irrigation";
    frequency = "Twice Daily";
  } else if (finalIrrigation < 400) {
    frequency = "Every 2-3 Days";
  }

  // Calculate confidence based on data quality
  let confidence = 85;
  if (Math.abs(soil.ph - cropReq.phOptimal) < 0.5) confidence += 5;
  if (soil.organicMatter > 3) confidence += 3;
  if (weather.rainfall >= 50 && weather.rainfall <= 200) confidence += 4;
  if (weather.humidity >= 40 && weather.humidity <= 70) confidence += 3;
  
  confidence = Math.min(98, confidence);

  // Calculate yield increase potential
  let yieldIncrease = cropReq.yieldBoost;
  if (soil.organicMatter > 4) yieldIncrease += 5;
  if (Math.abs(soil.ph - cropReq.phOptimal) < 0.3) yieldIncrease += 3;
  
  yieldIncrease = Math.min(45, yieldIncrease);

  // Select random sustainability tip
  const randomTip = sustainabilityTips[Math.floor(Math.random() * sustainabilityTips.length)];

  return {
    irrigation: {
      litersPerAcre: finalIrrigation,
      frequency,
      method
    },
    fertilizer: {
      nitrogen: finalN,
      phosphorus: finalP,
      potassium: finalK
    },
    sustainabilityTip: randomTip,
    confidence,
    cropYieldIncrease: yieldIncrease
  };
};