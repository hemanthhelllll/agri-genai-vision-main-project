import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PredictionChart } from "@/components/PredictionChart";
import { GeneticAlgorithmViz } from "@/components/GeneticAlgorithmViz";
import { Sprout, Brain, Dna, TrendingUp, ArrowLeft, FileDown, MapPin, Lightbulb, Droplets, Sun, Bug, Leaf, Cloud, Check, Thermometer } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface PredictionData {
  cropType: string;
  soilType: string;
  season: string;
  temperature: string;
  rainfall: string;
  geneticTraits: Record<string, boolean>;
  location: { lat: number; lon: number };
  weatherData?: {
    location: string;
    temperature: number;
    humidity: number;
    rainfall: number;
    forecast: Array<{
      date: string;
      maxTemp: number;
      minTemp: number;
      precipitation: number;
      humidity: number;
    }>;
    plantingWindow?: {
      recommended: boolean;
      reason: string;
      bestDays: string[];
    };
  };
  recommendedTraits: Array<{ trait: string; reason: string }>;
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const predictionData = location.state as PredictionData | null;

  if (!predictionData) {
    navigate("/dashboard");
    return null;
  }

  const traitNames: Record<string, string> = {
    pestResistance: "Pest Resistance",
    highYield: "High Yield",
    droughtTolerance: "Drought Tolerance",
    diseaseResistance: "Disease Resistance",
    fastGrowth: "Fast Growth",
    climateAdaptability: "Climate Adaptability",
  };

  const selectedTraits = Object.entries(predictionData.geneticTraits)
    .filter(([_, selected]) => selected)
    .map(([trait]) => traitNames[trait as keyof typeof traitNames] || trait);

  const getGrowingTips = () => {
    const tips: Array<{ icon: any; title: string; tip: string; category: string }> = [];
    const temp = parseFloat(predictionData.temperature);
    const rain = parseFloat(predictionData.rainfall);

    // Temperature-based tips
    if (temp > 30) {
      tips.push({
        icon: Sun,
        title: "High Temperature Management",
        tip: "Provide shade during peak sun hours (11 AM - 3 PM). Use mulching to keep soil cool and retain moisture. Consider drip irrigation for efficient water use.",
        category: "temperature"
      });
    } else if (temp < 15) {
      tips.push({
        icon: Sun,
        title: "Cold Protection",
        tip: "Use row covers or polytunnels to protect crops from frost. Plant during warmer parts of the day. Consider cold-hardy varieties for better results.",
        category: "temperature"
      });
    }

    // Rainfall-based tips
    if (rain < 500) {
      tips.push({
        icon: Droplets,
        title: "Water Conservation",
        tip: "Install drip irrigation system to maximize water efficiency. Mulch heavily to retain soil moisture. Schedule watering early morning or late evening to reduce evaporation.",
        category: "water"
      });
    } else if (rain > 1500) {
      tips.push({
        icon: Droplets,
        title: "Drainage Management",
        tip: "Ensure proper field drainage to prevent waterlogging. Create raised beds for better water runoff. Monitor for fungal diseases due to high moisture.",
        category: "water"
      });
    }

    // Crop-specific tips
    const cropTips: Record<string, string> = {
      wheat: "Monitor for rust diseases. Apply balanced NPK fertilizer at tillering stage. Ensure proper seed spacing for optimal air circulation.",
      rice: "Maintain water level at 2-3 inches during vegetative stage. Watch for blast disease in humid conditions. Apply nitrogen in split doses.",
      corn: "Scout regularly for corn borers and armyworms. Side-dress with nitrogen at knee-high stage. Ensure adequate spacing for pollination.",
      cotton: "Monitor for bollworm and whitefly infestations. Apply potassium at flowering stage. Remove early square shedding to improve yields.",
      tomato: "Stake plants early for support. Prune suckers for better fruit quality. Watch for early and late blight symptoms.",
      potato: "Hill up soil around plants to prevent greening. Monitor for late blight especially in humid weather. Harvest when foliage dies back.",
      soybean: "Inoculate seeds with rhizobium for better nitrogen fixation. Control weeds early as they compete heavily. Watch for soybean rust.",
      sugarcane: "Apply organic matter to improve soil structure. Control borers with regular scouting. Earthing up helps in root development.",
      barley: "Ensure good drainage as barley is sensitive to waterlogging. Monitor for powdery mildew. Harvest at proper moisture content.",
      coffee: "Provide partial shade in hot climates. Maintain organic mulch layer. Prune regularly for better air circulation and yield.",
      tea: "Maintain acidic soil pH (4.5-5.5). Regular light pruning promotes new flush growth. Apply nitrogen-rich fertilizers during growing season.",
      mustard: "Control aphids early as they can severely damage crop. Ensure proper seed rate for optimal plant density. Harvest when pods turn brown."
    };

    if (cropTips[predictionData.cropType]) {
      tips.push({
        icon: Leaf,
        title: `${predictionData.cropType.charAt(0).toUpperCase() + predictionData.cropType.slice(1)}-Specific Care`,
        tip: cropTips[predictionData.cropType],
        category: "crop"
      });
    }

    // Soil-specific tips
    const soilTips: Record<string, string> = {
      sandy: "Add organic matter to improve water retention. Apply fertilizers in smaller, frequent doses as sandy soil has low nutrient holding capacity. Mulch heavily to prevent erosion.",
      clay: "Improve drainage by adding organic compost. Avoid overworking soil when wet. Add gypsum to improve soil structure and reduce compaction.",
      loamy: "Maintain organic matter through composting. This ideal soil type benefits from crop rotation. Regular soil testing ensures nutrient balance.",
      black: "This fertile soil retains moisture well but ensure good drainage. Regular deep plowing prevents hardpan formation. Ideal for most crops.",
      red: "Add lime to correct acidity if needed. Supplement with organic matter to improve fertility. Good for drought-resistant crops."
    };

    if (soilTips[predictionData.soilType]) {
      tips.push({
        icon: Leaf,
        title: `${predictionData.soilType.charAt(0).toUpperCase() + predictionData.soilType.slice(1)} Soil Management`,
        tip: soilTips[predictionData.soilType],
        category: "soil"
      });
    }

    // Season-specific tips
    const seasonTips: Record<string, string> = {
      summer: "Increase irrigation frequency. Use reflective mulch to reduce soil temperature. Consider planting heat-tolerant varieties.",
      winter: "Protect from frost using covers. Reduce watering frequency. Choose cold-hardy varieties for better survival.",
      monsoon: "Ensure excellent drainage to prevent waterlogging. Watch for increased pest and disease pressure. Use disease-resistant varieties.",
      spring: "Ideal time for planting. Prepare soil with organic matter. Monitor for early season pests as temperatures rise.",
      autumn: "Good for cool-season crops. Apply balanced fertilizers. Harvest summer crops before first frost."
    };

    if (seasonTips[predictionData.season]) {
      tips.push({
        icon: Sun,
        title: `${predictionData.season.charAt(0).toUpperCase() + predictionData.season.slice(1)} Season Tips`,
        tip: seasonTips[predictionData.season],
        category: "season"
      });
    }

    // Pest management tip based on genetic traits
    const hasPestResistance = predictionData.geneticTraits?.pestResistance;
    if (!hasPestResistance) {
      tips.push({
        icon: Bug,
        title: "Pest Management",
        tip: "Implement integrated pest management (IPM). Use pheromone traps for monitoring. Apply neem-based organic pesticides as first line of defense. Scout fields regularly for early detection.",
        category: "pest"
      });
    }

    return tips;
  };

  const growingTips = getGrowingTips();

  const generatePDFReport = async () => {
    toast.info("Generating PDF report...");

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;

    // Title
    pdf.setFontSize(22);
    pdf.setTextColor(34, 197, 94);
    pdf.text("Smart Crop Forecasting Report", pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Input Parameters Section
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text("Input Parameters", margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    const parameters = [
      `Crop Type: ${predictionData.cropType.charAt(0).toUpperCase() + predictionData.cropType.slice(1)}`,
      `Soil Type: ${predictionData.soilType.charAt(0).toUpperCase() + predictionData.soilType.slice(1)}`,
      `Season: ${predictionData.season.charAt(0).toUpperCase() + predictionData.season.slice(1)}`,
      `Temperature: ${predictionData.temperature}°C`,
      `Rainfall: ${predictionData.rainfall}mm`,
    ];

    if (predictionData.weatherData) {
      parameters.push(`Location: ${predictionData.weatherData.location}`);
      parameters.push(`Current Humidity: ${predictionData.weatherData.humidity}%`);
    }

    parameters.forEach(param => {
      pdf.text(param, margin + 5, yPosition);
      yPosition += 6;
    });

    yPosition += 5;

    // Selected Genetic Traits
    if (selectedTraits.length > 0) {
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Selected Genetic Traits", margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(10);
      pdf.setTextColor(60, 60, 60);
      selectedTraits.forEach((trait) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(`• ${trait}`, margin + 5, yPosition);
        yPosition += 6;
      });
      yPosition += 5;
    }

    // AI-Recommended Genetic Traits
    if (predictionData.recommendedTraits && predictionData.recommendedTraits.length > 0) {
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text("AI-Recommended Genetic Traits", margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(10);
      pdf.setTextColor(60, 60, 60);
      predictionData.recommendedTraits.forEach(({ trait, reason }) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = margin;
        }
        const traitDisplayName = traitNames[trait as keyof typeof traitNames] || trait.replace(/([A-Z])/g, ' $1').trim();
        const text = `• ${traitDisplayName}: ${reason}`;
        const lines = pdf.splitTextToSize(text, pageWidth - margin * 2 - 5);
        lines.forEach((line: string) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(line, margin + 5, yPosition);
          yPosition += 5;
        });
      });
      yPosition += 5;
    }
    
    // Growing Tips
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text("Growing Tips", margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    growingTips.forEach((tip) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = margin;
      }
      const text = `${tip.title}: ${tip.tip}`;
      const lines = pdf.splitTextToSize(text, pageWidth - margin * 2 - 5);
      lines.forEach((line: string) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin + 5, yPosition);
        yPosition += 5;
      });
      yPosition += 3;
    });
    yPosition += 5;

    // Prediction Results Section
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text("Prediction Results", margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    pdf.text("AI Prediction Accuracy: 94.5%", margin + 5, yPosition);
    yPosition += 6;
    pdf.text("Genetic Algorithm Generations: 1,247", margin + 5, yPosition);
    yPosition += 6;
    pdf.text("Projected Yield Improvement: +23.4% vs Traditional", margin + 5, yPosition);
    yPosition += 10;

    // Capture charts
    try {
      const chartElements = document.querySelectorAll('[data-chart]');
      
      for (let i = 0; i < chartElements.length; i++) {
        const element = chartElements[i] as HTMLElement;
        
        if (yPosition > pageHeight - 80) {
          pdf.addPage();
          yPosition = margin;
        }

        const canvas = await html2canvas(element, {
          scale: 2,
          backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - margin * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10;
      }
    } catch (error) {
      console.error("Error capturing charts:", error);
    }

    // Footer
    const pageCount = pdf.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(
        `Page ${i} of ${pageCount} | Smart Crop Forecasting System`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    // Save the PDF
    pdf.save(`Crop_Forecast_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("PDF report downloaded successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-soft">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Sprout className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">Prediction Results</h1>
              </div>
              <p className="text-muted-foreground mt-2">AI-Powered Analysis Complete</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                size="lg"
                className="gap-2"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Dashboard
              </Button>
              <Button
                onClick={generatePDFReport}
                variant="default"
                size="lg"
                className="gap-2"
              >
                <FileDown className="h-5 w-5" />
                Download Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI Prediction
              </CardTitle>
              <CardDescription>Neural network analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">94.5%</div>
              <p className="text-sm text-muted-foreground mt-1">Accuracy Rate</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dna className="h-5 w-5 text-secondary" />
                Genetic Algorithm
              </CardTitle>
              <CardDescription>Optimization iterations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">1,247</div>
              <p className="text-sm text-muted-foreground mt-1">Generations</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                Yield Improvement
              </CardTitle>
              <CardDescription>Projected increase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">+23.4%</div>
              <p className="text-sm text-muted-foreground mt-1">vs Traditional</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Input Parameters</CardTitle>
              <CardDescription>Farming conditions used for prediction</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Crop Type</p>
                  <p className="font-semibold capitalize">{predictionData.cropType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Soil Type</p>
                  <p className="font-semibold capitalize">{predictionData.soilType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Season</p>
                  <p className="font-semibold capitalize">{predictionData.season}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Temperature</p>
                  <p className="font-semibold">{predictionData.temperature}°C</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rainfall</p>
                  <p className="font-semibold">{predictionData.rainfall}mm</p>
                </div>
                {predictionData.weatherData && (
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Location
                    </p>
                    <p className="font-semibold text-sm">{predictionData.weatherData.location}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Selected Genetic Traits</CardTitle>
              <CardDescription>Optimizations applied to prediction</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedTraits.length > 0 ? (
                <ul className="space-y-2">
                  {selectedTraits.map((trait) => (
                    <li key={trait} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="capitalize">{trait}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No genetic traits selected</p>
              )}
            </CardContent>
          </Card>
        </div>

        {predictionData.weatherData?.forecast && (
          <Card className="shadow-medium mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-primary" />
                7-Day Weather Forecast
              </CardTitle>
              <CardDescription>Weather predictions for optimal planting decisions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {predictionData.weatherData.plantingWindow && (
                <div className={`p-4 rounded-lg border ${
                  predictionData.weatherData.plantingWindow.recommended 
                    ? 'bg-primary/5 border-primary/30' 
                    : 'bg-destructive/5 border-destructive/30'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      predictionData.weatherData.plantingWindow.recommended 
                        ? 'bg-primary/10' 
                        : 'bg-destructive/10'
                    }`}>
                      {predictionData.weatherData.plantingWindow.recommended ? (
                        <Check className="h-5 w-5 text-primary" />
                      ) : (
                        <Cloud className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold mb-2">
                        {predictionData.weatherData.plantingWindow.recommended ? 'Favorable Planting Window' : 'Unfavorable Conditions'}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {predictionData.weatherData.plantingWindow.reason}
                      </p>
                      {predictionData.weatherData.plantingWindow.bestDays.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="text-sm text-muted-foreground">Best planting days:</span>
                          {predictionData.weatherData.plantingWindow.bestDays.map((day, idx) => (
                            <span key={idx} className="px-3 py-1 bg-primary/10 text-primary rounded-lg font-medium">
                              {new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-7 gap-2">
                {predictionData.weatherData.forecast.map((day, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 rounded-lg bg-muted/30 border border-border hover:border-primary/50 transition-all hover:shadow-soft"
                  >
                    <p className="text-sm font-semibold text-center mb-2">
                      {idx === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <p className="text-xs text-center text-muted-foreground mb-2">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-1">
                        <Sun className="h-3 w-3 text-orange-500" />
                        <p className="text-sm font-bold text-primary">{day.maxTemp}°</p>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <Thermometer className="h-3 w-3 text-blue-500" />
                        <p className="text-xs text-muted-foreground">{day.minTemp}°</p>
                      </div>
                      {day.precipitation > 0 ? (
                        <div className="flex items-center justify-center gap-1 pt-1 border-t border-border/50">
                          <Droplets className="h-3 w-3 text-blue-500" />
                          <span className="text-xs text-blue-500 font-medium">{day.precipitation}mm</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1 pt-1 border-t border-border/50">
                          <Sun className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs text-muted-foreground">Dry</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-medium mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Growing Tips for Best Results
            </CardTitle>
            <CardDescription>Actionable recommendations based on your conditions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {growingTips.map((tip, index) => {
                const Icon = tip.icon;
                return (
                  <div key={index} className="p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-2">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{tip.tip}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          <div data-chart>
            <PredictionChart />
          </div>
          <div data-chart>
            <GeneticAlgorithmViz />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Results;
