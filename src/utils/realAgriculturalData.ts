// Real Agricultural Science-Based Prediction Model
// Based on actual research from FAO, USDA, and agricultural universities

export interface CropData {
  name: string;
  scientificName: string;
  waterRequirement: {
    base: number; // mm per season
    criticalStages: {
      germination: number;
      vegetative: number;
      flowering: number;
      maturity: number;
    };
  };
  nutrientRequirement: {
    nitrogen: { min: number; max: number; optimal: number };
    phosphorus: { min: number; max: number; optimal: number };
    potassium: { min: number; max: number; optimal: number };
  };
  soilRequirements: {
    phRange: { min: number; max: number; optimal: number };
    organicMatter: { min: number; optimal: number };
    drainage: string;
  };
  climateRequirements: {
    tempRange: { min: number; max: number; optimal: number };
    humidityRange: { min: number; max: number; optimal: number };
    sunlightHours: { min: number; optimal: number };
    growingDays: number;
  };
  yieldPotential: {
    average: number; // tons per hectare
    maximum: number;
    factors: string[];
  };
}

// Real crop database based on FAO and agricultural research
export const cropDatabase: Record<string, CropData> = {
  rice: {
    name: "Rice",
    scientificName: "Oryza sativa",
    waterRequirement: {
      base: 1200,
      criticalStages: {
        germination: 0.15,
        vegetative: 0.25,
        flowering: 0.35,
        maturity: 0.25
      }
    },
    nutrientRequirement: {
      nitrogen: { min: 80, max: 150, optimal: 120 },
      phosphorus: { min: 40, max: 80, optimal: 60 },
      potassium: { min: 30, max: 60, optimal: 40 }
    },
    soilRequirements: {
      phRange: { min: 5.5, max: 7.0, optimal: 6.0 },
      organicMatter: { min: 2.0, optimal: 4.0 },
      drainage: "poor to moderate"
    },
    climateRequirements: {
      tempRange: { min: 20, max: 35, optimal: 28 },
      humidityRange: { min: 70, max: 90, optimal: 80 },
      sunlightHours: { min: 6, optimal: 8 },
      growingDays: 120
    },
    yieldPotential: {
      average: 4.5,
      maximum: 8.0,
      factors: ["water management", "variety selection", "pest control"]
    }
  },
  wheat: {
    name: "Wheat",
    scientificName: "Triticum aestivum",
    waterRequirement: {
      base: 450,
      criticalStages: {
        germination: 0.20,
        vegetative: 0.30,
        flowering: 0.30,
        maturity: 0.20
      }
    },
    nutrientRequirement: {
      nitrogen: { min: 80, max: 140, optimal: 100 },
      phosphorus: { min: 30, max: 70, optimal: 50 },
      potassium: { min: 20, max: 50, optimal: 30 }
    },
    soilRequirements: {
      phRange: { min: 6.0, max: 7.5, optimal: 6.5 },
      organicMatter: { min: 1.5, optimal: 3.0 },
      drainage: "good"
    },
    climateRequirements: {
      tempRange: { min: 15, max: 25, optimal: 22 },
      humidityRange: { min: 40, max: 70, optimal: 55 },
      sunlightHours: { min: 7, optimal: 9 },
      growingDays: 140
    },
    yieldPotential: {
      average: 3.2,
      maximum: 6.5,
      factors: ["soil fertility", "disease management", "timing"]
    }
  },
  maize: {
    name: "Maize",
    scientificName: "Zea mays",
    waterRequirement: {
      base: 500,
      criticalStages: {
        germination: 0.15,
        vegetative: 0.25,
        flowering: 0.40,
        maturity: 0.20
      }
    },
    nutrientRequirement: {
      nitrogen: { min: 120, max: 200, optimal: 150 },
      phosphorus: { min: 50, max: 90, optimal: 70 },
      potassium: { min: 60, max: 120, optimal: 80 }
    },
    soilRequirements: {
      phRange: { min: 6.0, max: 7.8, optimal: 6.8 },
      organicMatter: { min: 2.0, optimal: 4.5 },
      drainage: "good"
    },
    climateRequirements: {
      tempRange: { min: 18, max: 32, optimal: 25 },
      humidityRange: { min: 50, max: 80, optimal: 65 },
      sunlightHours: { min: 8, optimal: 10 },
      growingDays: 110
    },
    yieldPotential: {
      average: 5.8,
      maximum: 12.0,
      factors: ["hybrid variety", "plant density", "nutrient timing"]
    }
  },
  tomato: {
    name: "Tomato",
    scientificName: "Solanum lycopersicum",
    waterRequirement: {
      base: 400,
      criticalStages: {
        germination: 0.10,
        vegetative: 0.25,
        flowering: 0.40,
        maturity: 0.25
      }
    },
    nutrientRequirement: {
      nitrogen: { min: 100, max: 180, optimal: 140 },
      phosphorus: { min: 40, max: 80, optimal: 60 },
      potassium: { min: 120, max: 220, optimal: 180 }
    },
    soilRequirements: {
      phRange: { min: 6.0, max: 6.8, optimal: 6.2 },
      organicMatter: { min: 3.0, optimal: 5.0 },
      drainage: "excellent"
    },
    climateRequirements: {
      tempRange: { min: 18, max: 29, optimal: 24 },
      humidityRange: { min: 60, max: 80, optimal: 70 },
      sunlightHours: { min: 6, optimal: 8 },
      growingDays: 85
    },
    yieldPotential: {
      average: 45,
      maximum: 85,
      factors: ["greenhouse cultivation", "pruning", "disease prevention"]
    }
  },
  cotton: {
    name: "Cotton",
    scientificName: "Gossypium hirsutum",
    waterRequirement: {
      base: 700,
      criticalStages: {
        germination: 0.15,
        vegetative: 0.25,
        flowering: 0.40,
        maturity: 0.20
      }
    },
    nutrientRequirement: {
      nitrogen: { min: 60, max: 120, optimal: 80 },
      phosphorus: { min: 25, max: 60, optimal: 40 },
      potassium: { min: 40, max: 80, optimal: 60 }
    },
    soilRequirements: {
      phRange: { min: 6.5, max: 8.0, optimal: 7.0 },
      organicMatter: { min: 1.5, optimal: 3.0 },
      drainage: "good"
    },
    climateRequirements: {
      tempRange: { min: 20, max: 37, optimal: 30 },
      humidityRange: { min: 40, max: 70, optimal: 55 },
      sunlightHours: { min: 8, optimal: 10 },
      growingDays: 180
    },
    yieldPotential: {
      average: 1.8,
      maximum: 3.5,
      factors: ["pest management", "irrigation scheduling", "variety"]
    }
  },
  potato: {
    name: "Potato",
    scientificName: "Solanum tuberosum",
    waterRequirement: {
      base: 350,
      criticalStages: {
        germination: 0.15,
        vegetative: 0.25,
        flowering: 0.35,
        maturity: 0.25
      }
    },
    nutrientRequirement: {
      nitrogen: { min: 80, max: 140, optimal: 110 },
      phosphorus: { min: 60, max: 100, optimal: 80 },
      potassium: { min: 100, max: 180, optimal: 140 }
    },
    soilRequirements: {
      phRange: { min: 5.5, max: 6.5, optimal: 6.0 },
      organicMatter: { min: 2.5, optimal: 4.0 },
      drainage: "excellent"
    },
    climateRequirements: {
      tempRange: { min: 15, max: 22, optimal: 18 },
      humidityRange: { min: 65, max: 85, optimal: 75 },
      sunlightHours: { min: 6, optimal: 8 },
      growingDays: 90
    },
    yieldPotential: {
      average: 25,
      maximum: 50,
      factors: ["seed quality", "hilling", "storage conditions"]
    }
  },
  soybean: {
    name: "Soybean",
    scientificName: "Glycine max",
    waterRequirement: {
      base: 450,
      criticalStages: {
        germination: 0.15,
        vegetative: 0.25,
        flowering: 0.35,
        maturity: 0.25
      }
    },
    nutrientRequirement: {
      nitrogen: { min: 40, max: 80, optimal: 60 }, // Lower due to N-fixation
      phosphorus: { min: 30, max: 60, optimal: 40 },
      potassium: { min: 40, max: 80, optimal: 50 }
    },
    soilRequirements: {
      phRange: { min: 6.0, max: 7.5, optimal: 6.8 },
      organicMatter: { min: 2.0, optimal: 3.5 },
      drainage: "good"
    },
    climateRequirements: {
      tempRange: { min: 20, max: 30, optimal: 25 },
      humidityRange: { min: 60, max: 80, optimal: 70 },
      sunlightHours: { min: 7, optimal: 9 },
      growingDays: 120
    },
    yieldPotential: {
      average: 2.8,
      maximum: 5.2,
      factors: ["nodulation", "row spacing", "maturity group"]
    }
  },
  sugarcane: {
    name: "Sugarcane",
    scientificName: "Saccharum officinarum",
    waterRequirement: {
      base: 1200,
      criticalStages: {
        germination: 0.15,
        vegetative: 0.40,
        flowering: 0.25,
        maturity: 0.20
      }
    },
    nutrientRequirement: {
      nitrogen: { min: 150, max: 250, optimal: 200 },
      phosphorus: { min: 60, max: 100, optimal: 80 },
      potassium: { min: 100, max: 180, optimal: 120 }
    },
    soilRequirements: {
      phRange: { min: 6.0, max: 7.5, optimal: 6.5 },
      organicMatter: { min: 2.5, optimal: 4.5 },
      drainage: "moderate"
    },
    climateRequirements: {
      tempRange: { min: 22, max: 35, optimal: 28 },
      humidityRange: { min: 70, max: 90, optimal: 80 },
      sunlightHours: { min: 8, optimal: 10 },
      growingDays: 360
    },
    yieldPotential: {
      average: 70,
      maximum: 140,
      factors: ["variety selection", "ratoon management", "harvest timing"]
    }
  }
};

// Environmental stress factors based on research
export const stressFunctions = {
  // Water stress coefficient (FAO-56 methodology)
  waterStress: (actualET: number, potentialET: number): number => {
    const ratio = actualET / potentialET;
    if (ratio >= 0.8) return 1.0;
    if (ratio >= 0.6) return 0.8 + (ratio - 0.6) * 1.0;
    if (ratio >= 0.4) return 0.6 + (ratio - 0.4) * 1.0;
    return Math.max(0.3, ratio * 1.5);
  },

  // Temperature stress (based on cardinal temperatures)
  temperatureStress: (temp: number, optimal: number, min: number, max: number): number => {
    if (temp >= min && temp <= max) {
      const deviation = Math.abs(temp - optimal);
      const range = Math.max(optimal - min, max - optimal);
      return Math.max(0.5, 1 - (deviation / range) * 0.5);
    }
    return 0.1; // Severe stress outside range
  },

  // pH stress on nutrient availability
  phStress: (ph: number, optimal: number): number => {
    const deviation = Math.abs(ph - optimal);
    if (deviation <= 0.5) return 1.0;
    if (deviation <= 1.0) return 0.8;
    if (deviation <= 1.5) return 0.6;
    return 0.4;
  },

  // Nutrient deficiency/toxicity stress
  nutrientStress: (actual: number, optimal: number, min: number, max: number): number => {
    if (actual < min) return Math.max(0.3, actual / min);
    if (actual > max) return Math.max(0.4, 1 - (actual - max) / max);
    const deviation = Math.abs(actual - optimal) / optimal;
    return Math.max(0.7, 1 - deviation * 0.3);
  }
};

// Sustainability recommendations based on practices
export const sustainabilityDatabase = {
  irrigation: [
    {
      practice: "Drip irrigation systems can reduce water usage by 30-50% compared to flood irrigation while maintaining or improving yields.",
      waterSaving: 40,
      applicableCrops: ["tomato", "cotton", "potato", "maize"]
    },
    {
      practice: "Mulching with organic materials reduces water evaporation by 25-35% and improves soil structure.",
      waterSaving: 30,
      applicableCrops: ["tomato", "potato", "cotton"]
    },
    {
      practice: "Soil moisture sensors can optimize irrigation timing, reducing water use by 15-25% through precision scheduling.",
      waterSaving: 20,
      applicableCrops: ["rice", "wheat", "maize", "sugarcane"]
    }
  ],
  fertilizer: [
    {
      practice: "Split nitrogen applications improve nutrient use efficiency by 20-30% and reduce environmental losses.",
      nutrientEfficiency: 25,
      applicableCrops: ["rice", "wheat", "maize", "sugarcane"]
    },
    {
      practice: "Legume cover crops can fix 50-200 kg/ha of nitrogen, reducing synthetic fertilizer needs significantly.",
      nutrientEfficiency: 35,
      applicableCrops: ["maize", "wheat", "cotton"]
    },
    {
      practice: "Composted organic matter improves soil fertility and can reduce fertilizer requirements by 20-40%.",
      nutrientEfficiency: 30,
      applicableCrops: ["tomato", "potato", "maize", "wheat"]
    }
  ],
  soil: [
    {
      practice: "No-till farming preserves soil structure and organic matter, improving water retention by 15-25%.",
      soilHealth: 8,
      applicableCrops: ["wheat", "maize", "soybean"]
    },
    {
      practice: "Crop rotation with diverse species breaks pest cycles and improves soil nutrient cycling naturally.",
      soilHealth: 9,
      applicableCrops: ["wheat", "maize", "soybean", "cotton"]
    }
  ]
};