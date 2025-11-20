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
  { id: "maize", name: "Maize", image: cornImg },
  { id: "groundnut", name: "Groundnut", image: soybeanImg },
  { id: "chickpea", name: "Chickpea", image: soybeanImg },
  { id: "lentil", name: "Lentil", image: soybeanImg },
  { id: "peas", name: "Peas", image: soybeanImg },
  { id: "onion", name: "Onion", image: potatoImg },
  { id: "garlic", name: "Garlic", image: potatoImg },
  { id: "cabbage", name: "Cabbage", image: tomatoImg },
  { id: "cauliflower", name: "Cauliflower", image: tomatoImg },
  { id: "carrot", name: "Carrot", image: potatoImg },
  { id: "radish", name: "Radish", image: potatoImg },
  { id: "spinach", name: "Spinach", image: tomatoImg },
  { id: "lettuce", name: "Lettuce", image: tomatoImg },
  { id: "cucumber", name: "Cucumber", image: tomatoImg },
  { id: "pumpkin", name: "Pumpkin", image: tomatoImg },
  { id: "watermelon", name: "Watermelon", image: tomatoImg },
  { id: "mango", name: "Mango", image: coffeeImg },
  { id: "banana", name: "Banana", image: sugarcaneImg },
  { id: "apple", name: "Apple", image: coffeeImg },
  { id: "orange", name: "Orange", image: coffeeImg },
  { id: "grapes", name: "Grapes", image: coffeeImg },
  { id: "papaya", name: "Papaya", image: coffeeImg },
  { id: "guava", name: "Guava", image: coffeeImg },
];

// AI-based crop recommendation logic
const getCropRecommendations = (soilType: string, temperature: number, rainfall: number, season: string) => {
  const recommendations: { crop: string; reason: string; score: number }[] = [];
  
  crops.forEach(crop => {
    let score = 50; // Base score
    let reasons: string[] = [];

    // Rice recommendations
    if (crop.id === "rice") {
      if (soilType === "clay" || soilType === "loamy") { score += 20; reasons.push("ideal soil type"); }
      if (rainfall > 150) { score += 20; reasons.push("high rainfall suitable"); }
      if (temperature >= 20 && temperature <= 35) { score += 15; reasons.push("optimal temperature"); }
      if (season === "monsoon") { score += 15; reasons.push("perfect season"); }
    }

    // Wheat recommendations
    if (crop.id === "wheat") {
      if (soilType === "loamy" || soilType === "clay") { score += 20; reasons.push("ideal soil"); }
      if (temperature >= 10 && temperature <= 25) { score += 20; reasons.push("optimal temperature"); }
      if (rainfall >= 50 && rainfall <= 100) { score += 15; reasons.push("moderate rainfall needed"); }
      if (season === "winter") { score += 20; reasons.push("winter crop"); }
    }

    // Cotton recommendations
    if (crop.id === "cotton") {
      if (soilType === "black" || soilType === "loamy") { score += 25; reasons.push("black soil ideal"); }
      if (temperature >= 21 && temperature <= 30) { score += 15; reasons.push("warm climate suitable"); }
      if (rainfall >= 50 && rainfall <= 100) { score += 10; reasons.push("moderate rainfall"); }
      if (season === "summer" || season === "monsoon") { score += 15; reasons.push("suitable season"); }
    }

    // Sugarcane recommendations
    if (crop.id === "sugarcane") {
      if (soilType === "loamy" || soilType === "clay") { score += 20; reasons.push("rich soil needed"); }
      if (temperature >= 20 && temperature <= 35) { score += 15; reasons.push("warm climate"); }
      if (rainfall > 150) { score += 20; reasons.push("high water requirement"); }
      if (season === "monsoon") { score += 15; reasons.push("monsoon planting"); }
    }

    // Potato recommendations
    if (crop.id === "potato") {
      if (soilType === "sandy" || soilType === "loamy") { score += 20; reasons.push("well-drained soil"); }
      if (temperature >= 15 && temperature <= 25) { score += 20; reasons.push("cool climate preferred"); }
      if (season === "winter" || season === "autumn") { score += 15; reasons.push("winter crop"); }
    }

    // Tomato recommendations
    if (crop.id === "tomato") {
      if (soilType === "loamy" || soilType === "sandy") { score += 20; reasons.push("good drainage"); }
      if (temperature >= 18 && temperature <= 27) { score += 20; reasons.push("moderate temperature"); }
      if (season === "winter" || season === "spring") { score += 10; reasons.push("suitable season"); }
    }

    // Corn/Maize recommendations
    if (crop.id === "corn" || crop.id === "maize") {
      if (soilType === "loamy" || soilType === "sandy") { score += 20; reasons.push("well-drained soil"); }
      if (temperature >= 20 && temperature <= 30) { score += 15; reasons.push("warm season crop"); }
      if (rainfall >= 60 && rainfall <= 120) { score += 15; reasons.push("moderate rainfall"); }
      if (season === "summer" || season === "monsoon") { score += 10; reasons.push("warm season"); }
    }

    // Soybean recommendations
    if (crop.id === "soybean") {
      if (soilType === "loamy" || soilType === "clay") { score += 20; reasons.push("fertile soil"); }
      if (temperature >= 20 && temperature <= 30) { score += 15; reasons.push("warm climate"); }
      if (rainfall >= 50 && rainfall <= 100) { score += 15; reasons.push("moderate water"); }
      if (season === "monsoon" || season === "summer") { score += 10; reasons.push("summer crop"); }
    }

    // Groundnut recommendations
    if (crop.id === "groundnut") {
      if (soilType === "sandy" || soilType === "loamy") { score += 25; reasons.push("sandy loam ideal"); }
      if (temperature >= 20 && temperature <= 30) { score += 15; reasons.push("warm temperature"); }
      if (rainfall >= 50 && rainfall <= 75) { score += 10; reasons.push("moderate rainfall"); }
      if (season === "monsoon") { score += 15; reasons.push("monsoon crop"); }
    }

    // Chickpea recommendations
    if (crop.id === "chickpea") {
      if (soilType === "loamy" || soilType === "clay") { score += 20; reasons.push("well-drained soil"); }
      if (temperature >= 10 && temperature <= 25) { score += 20; reasons.push("cool season"); }
      if (rainfall >= 40 && rainfall <= 60) { score += 15; reasons.push("low-moderate rainfall"); }
      if (season === "winter") { score += 20; reasons.push("rabi crop"); }
    }

    // Onion recommendations
    if (crop.id === "onion") {
      if (soilType === "loamy" || soilType === "sandy") { score += 20; reasons.push("well-drained soil"); }
      if (temperature >= 13 && temperature <= 24) { score += 15; reasons.push("cool climate"); }
      if (season === "winter") { score += 15; reasons.push("winter crop"); }
    }

    // Mango recommendations
    if (crop.id === "mango") {
      if (soilType === "loamy" || soilType === "sandy") { score += 20; reasons.push("deep well-drained soil"); }
      if (temperature >= 24 && temperature <= 30) { score += 20; reasons.push("tropical climate"); }
      if (rainfall >= 75 && rainfall <= 250) { score += 10; reasons.push("adequate rainfall"); }
      if (season === "summer" || season === "monsoon") { score += 10; reasons.push("warm season fruit"); }
    }

    // Banana recommendations
    if (crop.id === "banana") {
      if (soilType === "loamy" || soilType === "clay") { score += 20; reasons.push("rich fertile soil"); }
      if (temperature >= 15 && temperature <= 35) { score += 15; reasons.push("tropical/subtropical"); }
      if (rainfall > 100) { score += 20; reasons.push("high water requirement"); }
    }

    // Coffee recommendations
    if (crop.id === "coffee") {
      if (soilType === "loamy" || soilType === "volcanic") { score += 25; reasons.push("rich volcanic soil"); }
      if (temperature >= 15 && temperature <= 28) { score += 20; reasons.push("cool highlands"); }
      if (rainfall >= 150 && rainfall <= 250) { score += 15; reasons.push("high rainfall area"); }
    }

    // Tea recommendations
    if (crop.id === "tea") {
      if (soilType === "loamy" || soilType === "acidic") { score += 25; reasons.push("acidic well-drained soil"); }
      if (temperature >= 10 && temperature <= 30) { score += 15; reasons.push("cool to warm climate"); }
      if (rainfall >= 150 && rainfall <= 300) { score += 20; reasons.push("high rainfall region"); }
    }

    if (reasons.length > 0) {
      recommendations.push({
        crop: crop.name,
        reason: reasons.join(", "),
        score: Math.min(score, 100)
      });
    }
  });

  return recommendations.sort((a, b) => b.score - a.score).slice(0, 5);
};

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

            {/* AI Crop Recommendations */}
            {soilType && temperature && rainfall && season && (
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-green-500/30 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <Brain className="w-5 h-5" />
                    AI Crop Recommendations
                  </CardTitle>
                  <CardDescription>Based on your soil and weather conditions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getCropRecommendations(
                      soilType,
                      parseFloat(temperature || "0"),
                      parseFloat(rainfall || "0"),
                      season
                    ).map((rec, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 ${
                          index === 0
                            ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
                            : 'border-green-200 bg-white dark:bg-gray-900/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {index === 0 && <Check className="w-5 h-5 text-green-600" />}
                            <span className="font-semibold text-lg">{rec.crop}</span>
                          </div>
                          <span className="text-sm font-medium px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                            {rec.score}% Match
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{rec.reason}</p>
                        {index === 0 && (
                          <p className="text-xs mt-2 text-green-600 dark:text-green-400 font-medium">
                            ⭐ Highly Recommended for your conditions
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
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
