import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Sprout, Brain, Dna, TrendingUp, Cloud, Shield, Leaf, Droplets, Bug, Zap, Thermometer, Check, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useWeatherData } from "@/hooks/useWeatherData";
import { Checkbox } from "@/components/ui/checkbox";
import wheatImg from "@/assets/crops/wheat.jpg";
import riceImg from "@/assets/crops/rice.jpg";
import cornImg from "@/assets/crops/corn.jpg";
import cottonImg from "@/assets/crops/cotton.jpg";
import tomatoImg from "@/assets/crops/tomato.jpg";
import potatoImg from "@/assets/crops/potato.jpg";
import soybeanImg from "@/assets/crops/soybean.jpg";
import sugarcaneImg from "@/assets/crops/sugarcane.jpg";
import barleyImg from "@/assets/crops/barley.jpg";
import coffeeImg from "@/assets/crops/coffee.jpg";
import teaImg from "@/assets/crops/tea.jpg";
import mustardImg from "@/assets/crops/mustard.jpg";

const crops = [
  { id: "wheat", name: "Wheat", image: wheatImg },
  { id: "rice", name: "Rice", image: riceImg },
  { id: "corn", name: "Corn", image: cornImg },
  { id: "cotton", name: "Cotton", image: cottonImg },
  { id: "tomato", name: "Tomato", image: tomatoImg },
  { id: "potato", name: "Potato", image: potatoImg },
  { id: "soybean", name: "Soybean", image: soybeanImg },
  { id: "sugarcane", name: "Sugarcane", image: sugarcaneImg },
  { id: "barley", name: "Barley", image: barleyImg },
  { id: "coffee", name: "Coffee", image: coffeeImg },
  { id: "tea", name: "Tea", image: teaImg },
  { id: "mustard", name: "Mustard", image: mustardImg },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [predicting, setPredicting] = useState(false);
  const [cropType, setCropType] = useState("");
  const [soilType, setSoilType] = useState("");
  const [season, setSeason] = useState("");
  const [temperature, setTemperature] = useState("");
  const [rainfall, setRainfall] = useState("");
  const [location, setLocation] = useState({ latitude: '', longitude: '' });
  const [cityName, setCityName] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [geneticTraits, setGeneticTraits] = useState({
    pestResistance: false,
    highYield: false,
    droughtTolerance: false,
    diseaseResistance: false,
    fastGrowth: false,
    climateAdaptability: false,
  });

  const { weatherData, loading: weatherLoading, error: weatherError } = useWeatherData({
    latitude: location.latitude ? parseFloat(location.latitude) : undefined,
    longitude: location.longitude ? parseFloat(location.longitude) : undefined,
    cityName: cityName || undefined,
    enabled: true,
  });

  // Auto-detect location on component mount
  useEffect(() => {
    const autoDetectLocation = () => {
      if (!navigator.geolocation) {
        return;
      }

      setIsGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude: latitude.toString(), longitude: longitude.toString() });
          setIsGettingLocation(false);
          toast.success("Location detected automatically!");
        },
        (error) => {
          console.log("Auto-detection skipped:", error.message);
          setIsGettingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    };

    autoDetectLocation();
  }, []);

  useEffect(() => {
    if (weatherData) {
      setTemperature(weatherData.temperature.toString());
      setRainfall(weatherData.rainfall.toString());
      toast.success(`Weather data loaded for ${weatherData.location}`);
    }
  }, [weatherData]);

  useEffect(() => {
    if (weatherError) {
      toast.error(weatherError);
    }
  }, [weatherError]);

  const getSuggestedTraits = () => {
    const suggestions: Array<{ trait: string; reason: string }> = [];
    const temp = parseFloat(temperature || "0");
    const rain = parseFloat(rainfall || "0");

    // Temperature-based suggestions
    if (temp > 30) {
      suggestions.push({
        trait: "droughtTolerance",
        reason: "High temperatures increase water stress on crops"
      });
      suggestions.push({
        trait: "climateAdaptability",
        reason: "Adaptable varieties perform better in extreme heat"
      });
    } else if (temp < 15) {
      suggestions.push({
        trait: "climateAdaptability",
        reason: "Cold-resistant varieties are essential for low temperatures"
      });
    }

    // Rainfall-based suggestions
    if (rain < 500) {
      suggestions.push({
        trait: "droughtTolerance",
        reason: "Low rainfall areas require drought-resistant varieties"
      });
    } else if (rain > 1500) {
      suggestions.push({
        trait: "diseaseResistance",
        reason: "High moisture increases disease susceptibility"
      });
    }

    // Season-based suggestions
    if (season === "monsoon") {
      suggestions.push({
        trait: "diseaseResistance",
        reason: "Monsoon season has higher disease pressure"
      });
    }

    // Always recommend high yield for better productivity
    suggestions.push({
      trait: "highYield",
      reason: "Maximizes crop productivity and farmer income"
    });

    // Pest resistance is always beneficial
    suggestions.push({
      trait: "pestResistance",
      reason: "Reduces crop losses and pesticide costs"
    });

    // Fast growth for quick harvest cycles
    if (season === "spring" || season === "autumn") {
      suggestions.push({
        trait: "fastGrowth",
        reason: "Shorter growing season benefits from fast-maturing varieties"
      });
    }

    return suggestions;
  };

  const handlePredict = () => {
    if (!cropType || !soilType || !season || !temperature || !rainfall) {
      toast.error("Please fill in all fields");
      return;
    }

    setPredicting(true);
    
    setTimeout(() => {
      const recommendedTraits = getSuggestedTraits();
      
      navigate("/results", {
        state: {
          cropType,
          soilType,
          season,
          temperature,
          rainfall,
          geneticTraits,
          location: {
            lat: parseFloat(location.latitude) || 0,
            lon: parseFloat(location.longitude) || 0,
          },
          weatherData,
          recommendedTraits,
        },
      });
      setPredicting(false);
    }, 2000);
  };

  const handleGeneticTraitChange = (trait: keyof typeof geneticTraits) => {
    setGeneticTraits(prev => ({
      ...prev,
      [trait]: !prev[trait]
    }));
  };

  const selectedCrop = crops.find(crop => crop.id === cropType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4 animate-fade-in">
            <div className="flex items-center justify-center gap-3">
              <Sprout className="w-12 h-12 text-primary" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Smart Crop Forecasting
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Optimize your harvest with AI-powered predictions and genetic insights
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Location & Weather
                </CardTitle>
                <CardDescription>
                  Enter city name or coordinates to get weather data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cityName">City Name</Label>
                  <Input
                    id="cityName"
                    type="text"
                    placeholder="e.g., New Delhi, London, Tokyo"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    disabled={isGettingLocation}
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or use coordinates</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      placeholder="e.g., 28.6139"
                      value={location.latitude}
                      onChange={(e) => setLocation({ ...location, latitude: e.target.value })}
                      disabled={isGettingLocation}
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      placeholder="e.g., 77.2090"
                      value={location.longitude}
                      onChange={(e) => setLocation({ ...location, longitude: e.target.value })}
                      disabled={isGettingLocation}
                    />
                  </div>
                </div>

                {weatherLoading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Cloud className="w-4 h-4 animate-pulse" />
                    <span>Loading weather data...</span>
                  </div>
                )}

                {weatherData && (
                  <div className="space-y-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{weatherData.location}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-orange-500" />
                        <span className="text-sm">{weatherData.temperature}°C</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">{weatherData.humidity}%</span>
                      </div>
                    </div>
                    
                    {weatherData.plantingWindow && (
                      <div className={`p-3 rounded-md ${weatherData.plantingWindow.recommended ? 'bg-green-500/10 border border-green-500/20' : 'bg-amber-500/10 border border-amber-500/20'}`}>
                        <div className="flex items-start gap-2">
                          <Shield className={`w-4 h-4 mt-0.5 ${weatherData.plantingWindow.recommended ? 'text-green-600' : 'text-amber-600'}`} />
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${weatherData.plantingWindow.recommended ? 'text-green-700' : 'text-amber-700'}`}>
                              {weatherData.plantingWindow.recommended ? 'Good Planting Window' : 'Caution Advised'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {weatherData.plantingWindow.reason}
                            </p>
                            {weatherData.plantingWindow.bestDays.length > 0 && (
                              <p className="text-xs mt-2 font-medium">
                                Best days: {weatherData.plantingWindow.bestDays.join(', ')}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-primary" />
                  Crop Selection
                </CardTitle>
                <CardDescription>Choose the crop you want to analyze</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="crop">Crop Type</Label>
                  <Select value={cropType} onValueChange={setCropType}>
                    <SelectTrigger id="crop">
                      <SelectValue placeholder="Select crop type" />
                    </SelectTrigger>
                    <SelectContent>
                      {crops.map(crop => (
                        <SelectItem key={crop.id} value={crop.id}>
                          {crop.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCrop && (
                  <div className="relative h-48 rounded-lg overflow-hidden border border-primary/20">
                    <img 
                      src={selectedCrop.image} 
                      alt={selectedCrop.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                      <p className="text-white font-semibold text-lg p-4">{selectedCrop.name}</p>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="soil">Soil Type</Label>
                  <Select value={soilType} onValueChange={setSoilType}>
                    <SelectTrigger id="soil">
                      <SelectValue placeholder="Select soil type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clay">Clay</SelectItem>
                      <SelectItem value="sandy">Sandy</SelectItem>
                      <SelectItem value="loamy">Loamy</SelectItem>
                      <SelectItem value="black">Black</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="season">Season</Label>
                  <Select value={season} onValueChange={setSeason}>
                    <SelectTrigger id="season">
                      <SelectValue placeholder="Select season" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summer">Summer</SelectItem>
                      <SelectItem value="winter">Winter</SelectItem>
                      <SelectItem value="monsoon">Monsoon</SelectItem>
                      <SelectItem value="spring">Spring</SelectItem>
                      <SelectItem value="autumn">Autumn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="w-5 h-5 text-primary" />
                Environmental Parameters
              </CardTitle>
              <CardDescription>Fine-tune the growing conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="temperature" className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4" />
                    Temperature (°C)
                  </Label>
                  <Input
                    id="temperature"
                    type="number"
                    placeholder="e.g., 25"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rainfall" className="flex items-center gap-2">
                    <Droplets className="w-4 h-4" />
                    Rainfall (mm)
                  </Label>
                  <Input
                    id="rainfall"
                    type="number"
                    placeholder="e.g., 150"
                    value={rainfall}
                    onChange={(e) => setRainfall(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dna className="w-5 h-5 text-primary" />
                Genetic Traits Optimization
              </CardTitle>
              <CardDescription>Select desired genetic traits for your crop</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <Checkbox
                    id="pestResistance"
                    checked={geneticTraits.pestResistance}
                    onCheckedChange={() => handleGeneticTraitChange("pestResistance")}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="pestResistance"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                    >
                      <Bug className="w-4 h-4 text-primary" />
                      Pest Resistance
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Enhanced protection against common pests
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <Checkbox
                    id="highYield"
                    checked={geneticTraits.highYield}
                    onCheckedChange={() => handleGeneticTraitChange("highYield")}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="highYield"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                    >
                      <TrendingUp className="w-4 h-4 text-primary" />
                      High Yield
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Optimized for maximum crop production
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <Checkbox
                    id="droughtTolerance"
                    checked={geneticTraits.droughtTolerance}
                    onCheckedChange={() => handleGeneticTraitChange("droughtTolerance")}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="droughtTolerance"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                    >
                      <Droplets className="w-4 h-4 text-primary" />
                      Drought Tolerance
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Survives with minimal water requirements
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <Checkbox
                    id="diseaseResistance"
                    checked={geneticTraits.diseaseResistance}
                    onCheckedChange={() => handleGeneticTraitChange("diseaseResistance")}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="diseaseResistance"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4 text-primary" />
                      Disease Resistance
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Better immunity against crop diseases
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <Checkbox
                    id="fastGrowth"
                    checked={geneticTraits.fastGrowth}
                    onCheckedChange={() => handleGeneticTraitChange("fastGrowth")}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="fastGrowth"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                    >
                      <Zap className="w-4 h-4 text-primary" />
                      Fast Growth
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Reduced time to harvest
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <Checkbox
                    id="climateAdaptability"
                    checked={geneticTraits.climateAdaptability}
                    onCheckedChange={() => handleGeneticTraitChange("climateAdaptability")}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="climateAdaptability"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                    >
                      <Thermometer className="w-4 h-4 text-primary" />
                      Climate Adaptability
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Adapts to varying climate conditions
                    </p>
                  </div>
                </div>
              </div>
              
              {(cropType || soilType || season || temperature || rainfall) && (
                <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Brain className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm mb-2">AI Suggestions Based on Your Inputs</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        Our system recommends the following traits for optimal results:
                      </p>
                      <ul className="text-xs space-y-1">
                        {getSuggestedTraits().slice(0, 3).map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <Check className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                            <span>
                              <strong>{suggestion.trait.replace(/([A-Z])/g, ' $1').trim()}:</strong> {suggestion.reason}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {weatherData?.forecast && weatherData.forecast.length > 0 && (
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-primary" />
                  7-Day Weather Forecast
                </CardTitle>
                <CardDescription>
                  Plan your planting based on upcoming weather conditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
                  {weatherData.forecast.map((day, index) => (
                    <div 
                      key={day.date}
                      className={`p-3 rounded-lg border ${
                        weatherData.plantingWindow?.bestDays.includes(day.date)
                          ? 'bg-green-500/10 border-green-500/30'
                          : 'bg-muted/50'
                      }`}
                    >
                      <div className="text-xs font-medium text-center mb-2">
                        {index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">High</span>
                          <span className="font-medium">{day.maxTemp}°C</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Low</span>
                          <span className="font-medium">{day.minTemp}°C</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <Droplets className="w-3 h-3 text-blue-500" />
                          <span className="font-medium">{day.precipitation}mm</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Humidity</span>
                          <span className="font-medium">{day.humidity}%</span>
                        </div>
                      </div>
                      {weatherData.plantingWindow?.bestDays.includes(day.date) && (
                        <div className="mt-2 flex items-center justify-center gap-1 text-xs text-green-700 font-medium">
                          <Check className="w-3 h-3" />
                          <span>Best Day</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-primary/20">
            <CardContent className="pt-6">
              <Button
                size="lg"
                className="w-full text-lg py-6"
                onClick={handlePredict}
                disabled={predicting || !cropType || !soilType || !season || !temperature || !rainfall}
              >
                {predicting ? (
                  <>
                    <Brain className="w-5 h-5 mr-2 animate-pulse" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5 mr-2" />
                    Generate Prediction
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
