import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Droplets, 
  Zap, 
  Leaf, 
  Lightbulb, 
  TrendingUp, 
  BarChart3, 
  AlertTriangle,
  DollarSign,
  Calendar,
  Target,
  Activity,
  Shield
} from "lucide-react";

interface DetailedPredictions {
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
}

interface EnhancedResultsDashboardProps {
  results: DetailedPredictions;
  cropType: string;
}

const EnhancedResultsDashboard = ({ results, cropType }: EnhancedResultsDashboardProps) => {
  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-leaf-green';
      case 'medium': return 'text-harvest-gold';
      case 'high': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'secondary';
      case 'medium': return 'outline';
      case 'high': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header Card with Animation */}
      <Card className="bg-gradient-to-r from-primary to-leaf-green text-primary-foreground shadow-[var(--shadow-card)] animate-scale-in">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3 animate-bounce-gentle">
            <TrendingUp className="w-8 h-8" />
            Advanced AI Analysis for {cropType.charAt(0).toUpperCase() + cropType.slice(1)}
          </CardTitle>
          <CardDescription className="text-primary-foreground/90 text-xl">
            Comprehensive agricultural recommendations with {results.yieldPrediction.confidence}% confidence
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-[var(--shadow-card)] hover:shadow-lg transition-all duration-300 animate-slide-up">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-sky-blue mb-2 animate-pulse-glow">
              {results.irrigation.litersPerAcre.toLocaleString()}L
            </div>
            <div className="text-sm text-muted-foreground">Daily Irrigation</div>
            <div className="text-xs text-sky-blue mt-1">{results.irrigation.efficiency}% efficient</div>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)] hover:shadow-lg transition-all duration-300 animate-slide-up" style={{animationDelay: '100ms'}}>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-leaf-green mb-2 animate-pulse-glow">
              +{results.yieldPrediction.yieldIncrease}%
            </div>
            <div className="text-sm text-muted-foreground">Yield Increase</div>
            <div className="text-xs text-leaf-green mt-1">{results.yieldPrediction.expectedYield}t expected</div>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)] hover:shadow-lg transition-all duration-300 animate-slide-up" style={{animationDelay: '200ms'}}>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-harvest-gold mb-2 animate-pulse-glow">
              {results.economicImpact.costReduction}%
            </div>
            <div className="text-sm text-muted-foreground">Cost Reduction</div>
            <div className="text-xs text-harvest-gold mt-1">+{results.economicImpact.profitIncrease}% profit</div>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)] hover:shadow-lg transition-all duration-300 animate-slide-up" style={{animationDelay: '300ms'}}>
          <CardContent className="p-6 text-center">
            <div className={`text-3xl font-bold mb-2 animate-pulse-glow ${getRiskColor(results.riskAssessment.overallRisk)}`}>
              {results.riskAssessment.overallRisk}
            </div>
            <div className="text-sm text-muted-foreground">Overall Risk</div>
            <Badge variant={getRiskBadgeVariant(results.riskAssessment.overallRisk)} className="mt-1">
              Risk Level
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Enhanced Irrigation Card */}
        <Card className="shadow-[var(--shadow-card)] animate-slide-up" style={{animationDelay: '400ms'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sky-blue">
              <Droplets className="w-6 h-6 animate-float" />
              Smart Irrigation System
            </CardTitle>
            <CardDescription>Precision water management recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-4 bg-sky-blue/10 rounded-lg">
              <div className="text-4xl font-bold text-sky-blue mb-2">
                {results.irrigation.litersPerAcre.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Liters per acre per day</div>
              <Progress 
                value={results.irrigation.efficiency} 
                className="mt-3 h-2"
              />
              <div className="text-xs text-sky-blue mt-1">{results.irrigation.efficiency}% Water Use Efficiency</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Frequency</span>
                </div>
                <Badge variant="outline">{results.irrigation.frequency}</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Method</span>
                </div>
                <Badge variant="secondary">{results.irrigation.method}</Badge>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-harvest-gold" />
                Critical Irrigation Periods
              </h4>
              <div className="space-y-1">
                {results.irrigation.criticalPeriods.map((period, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-harvest-gold rounded-full" />
                    <span className="text-sm">{period}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Fertilizer Card */}
        <Card className="shadow-[var(--shadow-card)] animate-slide-up" style={{animationDelay: '500ms'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-leaf-green">
              <Zap className="w-6 h-6 animate-float" style={{animationDelay: '1s'}} />
              Precision Fertilization
            </CardTitle>
            <CardDescription>Optimized nutrient management plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-leaf-green/10 rounded-lg">
                <div className="text-2xl font-bold text-leaf-green">{results.fertilizer.nitrogen}</div>
                <div className="text-xs text-muted-foreground">kg/acre</div>
                <div className="text-sm font-medium">Nitrogen (N)</div>
              </div>
              <div className="text-center p-3 bg-harvest-gold/10 rounded-lg">
                <div className="text-2xl font-bold text-harvest-gold">{results.fertilizer.phosphorus}</div>
                <div className="text-xs text-muted-foreground">kg/acre</div>
                <div className="text-sm font-medium">Phosphorus (P)</div>
              </div>
              <div className="text-center p-3 bg-earth-brown/10 rounded-lg">
                <div className="text-2xl font-bold text-earth-brown">{results.fertilizer.potassium}</div>
                <div className="text-xs text-muted-foreground">kg/acre</div>
                <div className="text-sm font-medium">Potassium (K)</div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Nutrient Use Efficiency</span>
                <span className="text-sm text-leaf-green">{results.fertilizer.efficiency}%</span>
              </div>
              <Progress value={results.fertilizer.efficiency} className="h-2" />
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-leaf-green" />
                Application Schedule
              </h4>
              <div className="space-y-2">
                {results.fertilizer.applicationSchedule.map((schedule, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 bg-leaf-green/20 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <span>{schedule}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment and Yield Prediction Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Risk Assessment */}
        <Card className="shadow-[var(--shadow-card)] animate-slide-up" style={{animationDelay: '600ms'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-harvest-gold">
              <Shield className="w-6 h-6" />
              Risk Assessment
            </CardTitle>
            <CardDescription>Potential challenges and mitigation strategies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Water Stress Risk</span>
                  <span className="text-sm">{results.riskAssessment.waterStress}%</span>
                </div>
                <Progress value={results.riskAssessment.waterStress} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Nutrient Deficiency Risk</span>
                  <span className="text-sm">{results.riskAssessment.nutrientDeficiency}%</span>
                </div>
                <Progress value={results.riskAssessment.nutrientDeficiency} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Climate Risk</span>
                  <span className="text-sm">{results.riskAssessment.climateRisk}%</span>
                </div>
                <Progress value={results.riskAssessment.climateRisk} className="h-2" />
              </div>
            </div>
            
            <Separator />
            
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-semibold mb-1">Overall Risk Level</div>
              <Badge 
                variant={getRiskBadgeVariant(results.riskAssessment.overallRisk)}
                className="text-lg px-4 py-1"
              >
                {results.riskAssessment.overallRisk} Risk
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Yield Prediction */}
        <Card className="shadow-[var(--shadow-card)] animate-slide-up" style={{animationDelay: '700ms'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-harvest-gold">
              <BarChart3 className="w-6 h-6 animate-float" style={{animationDelay: '2s'}} />
              Yield Prediction
            </CardTitle>
            <CardDescription>Expected harvest outcomes and optimization factors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-harvest-gold/10 rounded-lg">
              <div className="text-3xl font-bold text-harvest-gold mb-2">
                {results.yieldPrediction.expectedYield} tons/ha
              </div>
              <div className="text-sm text-muted-foreground mb-2">Expected Yield</div>
              <div className="text-lg font-semibold text-leaf-green">
                +{results.yieldPrediction.yieldIncrease}% increase
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Prediction Confidence</span>
                <span className="text-sm text-leaf-green">{results.yieldPrediction.confidence}%</span>
              </div>
              <Progress value={results.yieldPrediction.confidence} className="h-2" />
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-muted-foreground" />
                Key Factors
              </h4>
              <div className="space-y-1">
                {results.yieldPrediction.limitingFactors.map((factor, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-harvest-gold rounded-full" />
                    <span className="text-sm">{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Economic Impact and Sustainability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Economic Impact */}
        <Card className="shadow-[var(--shadow-card)] animate-slide-up" style={{animationDelay: '800ms'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-harvest-gold">
              <DollarSign className="w-6 h-6" />
              Economic Impact
            </CardTitle>
            <CardDescription>Cost savings and profit optimization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-leaf-green/10 rounded-lg">
                <div className="text-2xl font-bold text-leaf-green mb-1">
                  -{results.economicImpact.costReduction}%
                </div>
                <div className="text-sm text-muted-foreground">Cost Reduction</div>
              </div>
              <div className="text-center p-4 bg-harvest-gold/10 rounded-lg">
                <div className="text-2xl font-bold text-harvest-gold mb-1">
                  +{results.economicImpact.profitIncrease}%
                </div>
                <div className="text-sm text-muted-foreground">Profit Increase</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sustainability Tip */}
        <Card className="shadow-[var(--shadow-card)] animate-slide-up" style={{animationDelay: '900ms'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-leaf-green">
              <Lightbulb className="w-6 h-6 animate-bounce-gentle" />
              Sustainability Recommendation
            </CardTitle>
            <CardDescription>Eco-friendly farming practices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-leaf-green/10 p-4 rounded-lg border-l-4 border-leaf-green">
              <p className="text-sm leading-relaxed">
                {results.sustainabilityTip}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-leaf-green" />
              <span className="text-sm font-medium text-leaf-green">Sustainable Agriculture Practice</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedResultsDashboard;