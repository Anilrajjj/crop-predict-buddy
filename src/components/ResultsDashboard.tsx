import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Droplets, Zap, Leaf, Lightbulb, TrendingUp, BarChart3 } from "lucide-react";

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

interface ResultsDashboardProps {
  results: PredictionResults;
  cropType: string;
}

const ResultsDashboard = ({ results, cropType }: ResultsDashboardProps) => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <Card className="bg-[var(--gradient-nature)] text-primary-foreground shadow-[var(--shadow-card)]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <TrendingUp className="w-6 h-6" />
            AI Recommendations for {cropType.charAt(0).toUpperCase() + cropType.slice(1)}
          </CardTitle>
          <CardDescription className="text-primary-foreground/80 text-lg">
            Prediction Confidence: <Badge variant="secondary" className="ml-2">{results.confidence}%</Badge>
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Irrigation Recommendations */}
        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sky-blue">
              <Droplets className="w-5 h-5" />
              Irrigation Requirements
            </CardTitle>
            <CardDescription>Optimal water management for your crop</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-sky-blue mb-2">
                {results.irrigation.litersPerAcre.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Liters per acre per day</div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Frequency:</span>
                <Badge variant="outline">{results.irrigation.frequency}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Recommended Method:</span>
                <Badge variant="secondary">{results.irrigation.method}</Badge>
              </div>
            </div>
            
            <div className="bg-sky-blue/10 p-3 rounded-lg">
              <p className="text-sm text-foreground">
                <strong>Water Efficiency:</strong> This irrigation plan can save up to 40% water compared to traditional methods.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Fertilizer Recommendations */}
        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-leaf-green">
              <Zap className="w-5 h-5" />
              Fertilizer Requirements
            </CardTitle>
            <CardDescription>Nutrient optimization for maximum yield</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-leaf-green">{results.fertilizer.nitrogen}</div>
                <div className="text-xs text-muted-foreground">kg/acre</div>
                <div className="text-sm font-medium">Nitrogen (N)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-harvest-gold">{results.fertilizer.phosphorus}</div>
                <div className="text-xs text-muted-foreground">kg/acre</div>
                <div className="text-sm font-medium">Phosphorus (P)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-earth-brown">{results.fertilizer.potassium}</div>
                <div className="text-xs text-muted-foreground">kg/acre</div>
                <div className="text-sm font-medium">Potassium (K)</div>
              </div>
            </div>
            
            <Separator />
            
            <div className="bg-leaf-green/10 p-3 rounded-lg">
              <p className="text-sm text-foreground">
                <strong>Application Schedule:</strong> Split into 3 applications - at planting, vegetative stage, and flowering.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Yield Prediction */}
        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-harvest-gold">
              <BarChart3 className="w-5 h-5" />
              Expected Yield Impact
            </CardTitle>
            <CardDescription>Projected improvement with our recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-harvest-gold">+{results.cropYieldIncrease}%</div>
              <div className="text-sm text-muted-foreground">Increase in crop yield</div>
            </div>
            <div className="mt-4 bg-harvest-gold/10 p-3 rounded-lg">
              <p className="text-sm text-foreground">
                Following these recommendations could increase your harvest by approximately <strong>{results.cropYieldIncrease}%</strong> compared to conventional farming methods.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sustainability Tip */}
        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent">
              <Lightbulb className="w-5 h-5" />
              Sustainability Tip
            </CardTitle>
            <CardDescription>Eco-friendly farming practices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-accent/10 p-4 rounded-lg">
              <p className="text-sm text-foreground leading-relaxed">
                {results.sustainabilityTip}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-leaf-green" />
              <span className="text-sm font-medium text-leaf-green">Eco-Friendly Practice</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResultsDashboard;