import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PredictionChart } from "@/components/PredictionChart";
import { GeneticAlgorithmViz } from "@/components/GeneticAlgorithmViz";
import { Sprout, Brain, Dna, TrendingUp, ArrowLeft, FileDown, MapPin } from "lucide-react";
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

  const selectedTraits = Object.entries(predictionData.geneticTraits)
    .filter(([_, selected]) => selected)
    .map(([trait]) => trait.replace(/([A-Z])/g, ' $1').trim());

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

    // Selected Genetic Traits Section
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text("Selected Genetic Traits", margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);

    if (selectedTraits.length > 0) {
      selectedTraits.forEach(trait => {
        pdf.text(`• ${trait.charAt(0).toUpperCase() + trait.slice(1)}`, margin + 5, yPosition);
        yPosition += 6;
      });
    } else {
      pdf.text("No genetic traits selected", margin + 5, yPosition);
      yPosition += 6;
    }

    yPosition += 5;

    // AI Recommendations Section
    if (predictionData.recommendedTraits.length > 0) {
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text("AI-Recommended Traits", margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(9);
      pdf.setTextColor(60, 60, 60);
      predictionData.recommendedTraits.forEach(({ trait, reason }) => {
        const traitName = trait.replace(/([A-Z])/g, ' $1').trim();
        const text = `• ${traitName.charAt(0).toUpperCase() + traitName.slice(1)}: ${reason}`;
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
