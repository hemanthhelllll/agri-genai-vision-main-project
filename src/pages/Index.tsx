import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Dna, Sprout, BarChart3, CloudRain, Thermometer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/ai-farming-hero.jpg";
import aiPredictionImg from "@/assets/ai-prediction.jpg";
import geneticAlgorithmImg from "@/assets/genetic-algorithm.jpg";
import dataAnalyticsImg from "@/assets/data-analytics.jpg";
import weatherImg from "@/assets/weather-integration.jpg";
import soilAnalysisImg from "@/assets/soil-analysis.jpg";
import cropRecommendationsImg from "@/assets/crop-recommendations.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sprout className="h-12 w-12" />
            <h1 className="text-5xl md:text-6xl font-bold">Smart Crop Forecasting</h1>
          </div>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-95">
            Revolutionary agricultural intelligence combining AI neural networks with genetic algorithms
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/dashboard")}
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-8 py-6"
          >
            Launch Dashboard
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          Advanced Agricultural Technology
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="shadow-soft hover:shadow-medium transition-all duration-300 border-2 border-border hover:border-primary/50 overflow-hidden group">
            <div className="h-48 overflow-hidden">
              <img 
                src={aiPredictionImg} 
                alt="AI Neural Networks visualization" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
              />
            </div>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>AI Neural Networks</CardTitle>
              <CardDescription>Deep learning models trained on millions of agricultural data points</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Multi-layer perceptron analysis</li>
                <li>• Real-time yield predictions</li>
                <li>• 94.5% accuracy rate</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-all duration-300 border-2 border-border hover:border-secondary/50 overflow-hidden group">
            <div className="h-48 overflow-hidden">
              <img 
                src={geneticAlgorithmImg} 
                alt="Genetic Algorithms DNA visualization" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
              />
            </div>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <Dna className="h-6 w-6 text-secondary" />
              </div>
              <CardTitle>Genetic Algorithms</CardTitle>
              <CardDescription>Evolutionary optimization for maximum crop yield</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Population-based optimization</li>
                <li>• Adaptive parameter tuning</li>
                <li>• Multi-objective solutions</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-all duration-300 border-2 border-border hover:border-accent/50 overflow-hidden group">
            <div className="h-48 overflow-hidden">
              <img 
                src={dataAnalyticsImg} 
                alt="Data Analytics dashboard" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
              />
            </div>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>Data Analytics</CardTitle>
              <CardDescription>Comprehensive insights from historical and real-time data</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Trend analysis & forecasting</li>
                <li>• Interactive visualizations</li>
                <li>• Export detailed reports</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-all duration-300 border-2 border-border hover:border-chart-1/50 overflow-hidden group">
            <div className="h-48 overflow-hidden">
              <img 
                src={weatherImg} 
                alt="Weather Integration cloud patterns" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
              />
            </div>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-chart-1/10 flex items-center justify-center mb-4">
                <CloudRain className="h-6 w-6 text-chart-1" />
              </div>
              <CardTitle>Weather Integration</CardTitle>
              <CardDescription>Real-time climate data for accurate predictions</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Rainfall pattern analysis</li>
                <li>• Seasonal forecasting</li>
                <li>• Climate change adaptation</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-all duration-300 border-2 border-border hover:border-chart-2/50 overflow-hidden group">
            <div className="h-48 overflow-hidden">
              <img 
                src={soilAnalysisImg} 
                alt="Soil Analysis layered earth" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
              />
            </div>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-chart-2/10 flex items-center justify-center mb-4">
                <Thermometer className="h-6 w-6 text-chart-2" />
              </div>
              <CardTitle>Soil Analysis</CardTitle>
              <CardDescription>Multi-parameter soil health assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• pH and nutrient levels</li>
                <li>• Moisture content tracking</li>
                <li>• Soil type optimization</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-all duration-300 border-2 border-border hover:border-chart-3/50 overflow-hidden group">
            <div className="h-48 overflow-hidden">
              <img 
                src={cropRecommendationsImg} 
                alt="Crop Recommendations with wheat and corn" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
              />
            </div>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-chart-3/10 flex items-center justify-center mb-4">
                <Sprout className="h-6 w-6 text-chart-3" />
              </div>
              <CardTitle>Crop Recommendations</CardTitle>
              <CardDescription>Intelligent crop selection based on conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Location-specific suggestions</li>
                <li>• Yield maximization</li>
                <li>• Risk assessment</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-hero py-16 mt-16">
        <div className="container mx-auto px-4 text-center text-primary-foreground">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-lg mb-8 opacity-95 max-w-2xl mx-auto">
            Join thousands of farmers using AI-powered insights to increase yields and optimize resources
          </p>
          <Button 
            size="lg"
            onClick={() => navigate("/dashboard")}
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-8 py-6"
          >
            Start Forecasting Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
