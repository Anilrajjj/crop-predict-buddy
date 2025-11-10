/**
 * ML API Service
 * Handles communication with the trained ML model API
 */

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface MLPredictionRequest {
  soil: {
    ph: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    organicMatter: number;
  };
  weather: {
    temperature: number;
    rainfall: number;
    humidity: number;
    sunlightHours: number;
  };
  cropType: string;
}

export interface MLPredictionResponse {
  status: string;
  predictions: {
    irrigation: {
      litersPerAcre: number;
      frequency: string;
      method: string;
      efficiency: number;
      criticalPeriods: string[];
    };
    fertilizer: {
      nitrogen: number;
      phosphorus: number;
      potassium: number;
      applicationSchedule: string[];
      efficiency: number;
    };
    yieldPrediction: {
      expectedYield: number;
      yieldIncrease: number;
      limitingFactors: string[];
      confidence: number;
    };
    riskAssessment: {
      waterStress: number;
      nutrientDeficiency: number;
      climateRisk: number;
      overallRisk: string;
    };
    sustainabilityTip: string;
    economicImpact: {
      costReduction: number;
      profitIncrease: number;
    };
  };
  model_info: {
    type: string;
    accuracy: string;
    data_source: string;
  };
}

export class MLApiService {
  private static instance: MLApiService;
  private isApiAvailable: boolean = false;

  private constructor() {
    this.checkApiHealth();
  }

  public static getInstance(): MLApiService {
    if (!MLApiService.instance) {
      MLApiService.instance = new MLApiService();
    }
    return MLApiService.instance;
  }

  private async checkApiHealth(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      this.isApiAvailable = data.status === 'healthy';
      console.log('ML API Health:', data);
    } catch (error) {
      console.warn('ML API not available, falling back to mock predictions:', error);
      this.isApiAvailable = false;
    }
  }

  public async getPredictions(inputData: MLPredictionRequest): Promise<MLPredictionResponse> {
    if (!this.isApiAvailable) {
      console.warn('ML API not available, using fallback predictions');
      return this.getFallbackPredictions(inputData);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputData),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: MLPredictionResponse = await response.json();
      
      if (data.status !== 'success') {
        throw new Error(`API returned error: ${data.status}`);
      }

      return data;
    } catch (error) {
      console.error('ML API prediction failed:', error);
      console.log('Falling back to mock predictions');
      return this.getFallbackPredictions(inputData);
    }
  }

  public async getAvailableCrops(): Promise<string[]> {
    if (!this.isApiAvailable) {
      return ['rice', 'wheat', 'maize', 'cotton', 'sugarcane', 'tomato', 'potato', 'soybean', 'barley', 'sorghum', 'groundnut', 'mustard'];
    }

    try {
      const response = await fetch(`${API_BASE_URL}/crops`);
      const data = await response.json();
      return data.crops || [];
    } catch (error) {
      console.error('Failed to fetch crop types:', error);
      return ['rice', 'wheat', 'maize', 'cotton', 'sugarcane', 'tomato', 'potato', 'soybean'];
    }
  }

  public async getModelInfo(): Promise<any> {
    if (!this.isApiAvailable) {
      return {
        type: 'Mock Model',
        accuracy: 'Low',
        data_source: 'Hardcoded parameters'
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/model-info`);
      const data = await response.json();
      return data.model_info || {};
    } catch (error) {
      console.error('Failed to fetch model info:', error);
      return {};
    }
  }

  private getFallbackPredictions(inputData: MLPredictionRequest): MLPredictionResponse {
    // Fallback to the existing mock model (do not use CommonJS `require` in the browser)
    // If you want to use the advanced model implementation, switch to dynamic `import()`
    // and make this method async. For now we return the hardcoded fallback below.
    return {
      status: 'success',
      predictions: {
        irrigation: {
          litersPerAcre: 1000,
          frequency: 'Every 2-3 days',
          method: 'Drip Irrigation',
          efficiency: 85,
          criticalPeriods: ['Flowering stage', 'Early grain filling']
        },
        fertilizer: {
          nitrogen: 100,
          phosphorus: 50,
          potassium: 60,
          applicationSchedule: ['25% at planting', '50% at vegetative stage', '25% at flowering'],
          efficiency: 80
        },
        yieldPrediction: {
          expectedYield: 3.5,
          yieldIncrease: 15,
          limitingFactors: ['Using fallback predictions'],
          confidence: 70
        },
        riskAssessment: {
          waterStress: 20,
          nutrientDeficiency: 15,
          climateRisk: 10,
          overallRisk: 'Medium'
        },
        sustainabilityTip: 'Implement precision agriculture techniques to optimize resource usage.',
        economicImpact: {
          costReduction: 10,
          profitIncrease: 12
        }
      },
      model_info: {
        type: 'Fallback Mock Model',
        accuracy: 'Low',
        data_source: 'Hardcoded parameters'
      }
    };
  }

  public isApiReady(): boolean {
    return this.isApiAvailable;
  }
}

export const mlApiService = MLApiService.getInstance();
