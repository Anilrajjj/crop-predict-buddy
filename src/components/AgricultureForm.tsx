import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Leaf, CloudRain, Thermometer, Gauge } from "lucide-react";

interface FormData {
  // Soil data
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
  
  // Weather data
  temperature: number;
  rainfall: number;
  humidity: number;
  sunlightHours: number;
  
  // Crop type
  cropType: string;
}

interface AgricultureFormProps {
  onSubmit: (data: FormData) => void;
  loading: boolean;
}

const AgricultureForm = ({ onSubmit, loading }: AgricultureFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    ph: 6.5,
    nitrogen: 20,
    phosphorus: 15,
    potassium: 25,
    organicMatter: 3.0,
    temperature: 25,
    rainfall: 100,
    humidity: 65,
    sunlightHours: 8,
    cropType: ""
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'cropType' ? value : parseFloat(value) || 0
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-[var(--shadow-card)]">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
          <Leaf className="w-6 h-6" />
          Smart Agriculture Advisor
        </CardTitle>
        <CardDescription className="text-lg">
          Get AI-powered recommendations for optimal irrigation and fertilization
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Soil Data Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-earth-brown" />
              <h3 className="text-lg font-semibold text-foreground">Soil Parameters</h3>
            </div>
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="ph" className="text-sm font-medium">pH Level</Label>
                <Input
                  id="ph"
                  type="number"
                  step="0.1"
                  min="3"
                  max="10"
                  value={formData.ph}
                  onChange={(e) => handleInputChange('ph', e.target.value)}
                  placeholder="6.5"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="nitrogen" className="text-sm font-medium">Nitrogen (ppm)</Label>
                <Input
                  id="nitrogen"
                  type="number"
                  min="0"
                  value={formData.nitrogen}
                  onChange={(e) => handleInputChange('nitrogen', e.target.value)}
                  placeholder="20"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="phosphorus" className="text-sm font-medium">Phosphorus (ppm)</Label>
                <Input
                  id="phosphorus"
                  type="number"
                  min="0"
                  value={formData.phosphorus}
                  onChange={(e) => handleInputChange('phosphorus', e.target.value)}
                  placeholder="15"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="potassium" className="text-sm font-medium">Potassium (ppm)</Label>
                <Input
                  id="potassium"
                  type="number"
                  min="0"
                  value={formData.potassium}
                  onChange={(e) => handleInputChange('potassium', e.target.value)}
                  placeholder="25"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="organicMatter" className="text-sm font-medium">Organic Matter (%)</Label>
                <Input
                  id="organicMatter"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.organicMatter}
                  onChange={(e) => handleInputChange('organicMatter', e.target.value)}
                  placeholder="3.0"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Weather Data Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CloudRain className="w-5 h-5 text-sky-blue" />
              <h3 className="text-lg font-semibold text-foreground">Weather Conditions</h3>
            </div>
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="temperature" className="text-sm font-medium">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  value={formData.temperature}
                  onChange={(e) => handleInputChange('temperature', e.target.value)}
                  placeholder="25"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="rainfall" className="text-sm font-medium">Rainfall (mm/month)</Label>
                <Input
                  id="rainfall"
                  type="number"
                  min="0"
                  value={formData.rainfall}
                  onChange={(e) => handleInputChange('rainfall', e.target.value)}
                  placeholder="100"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="humidity" className="text-sm font-medium">Humidity (%)</Label>
                <Input
                  id="humidity"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.humidity}
                  onChange={(e) => handleInputChange('humidity', e.target.value)}
                  placeholder="65"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="sunlightHours" className="text-sm font-medium">Sunlight Hours/Day</Label>
                <Input
                  id="sunlightHours"
                  type="number"
                  min="0"
                  max="16"
                  value={formData.sunlightHours}
                  onChange={(e) => handleInputChange('sunlightHours', e.target.value)}
                  placeholder="8"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Crop Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-leaf-green" />
              <h3 className="text-lg font-semibold text-foreground">Crop Information</h3>
            </div>
            <Separator />
            
            <div className="max-w-md">
              <Label htmlFor="cropType" className="text-sm font-medium">Crop Type</Label>
              <Select value={formData.cropType} onValueChange={(value) => handleInputChange('cropType', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select crop type" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="rice">Rice</SelectItem>
                  <SelectItem value="wheat">Wheat</SelectItem>
                  <SelectItem value="maize">Maize</SelectItem>
                  <SelectItem value="cotton">Cotton</SelectItem>
                  <SelectItem value="sugarcane">Sugarcane</SelectItem>
                  <SelectItem value="tomato">Tomato</SelectItem>
                  <SelectItem value="potato">Potato</SelectItem>
                  <SelectItem value="soybean">Soybean</SelectItem>
                  <SelectItem value="barley">Barley</SelectItem>
                  <SelectItem value="sorghum">Sorghum</SelectItem>
                  <SelectItem value="groundnut">Groundnut</SelectItem>
                  <SelectItem value="mustard">Mustard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button 
              type="submit" 
              className="px-8 py-3 text-lg bg-[var(--gradient-nature)] hover:opacity-90 transition-opacity shadow-[var(--shadow-soft)]"
              disabled={loading || !formData.cropType}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Thermometer className="w-5 h-5 mr-2" />
                  Get Recommendations
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AgricultureForm;