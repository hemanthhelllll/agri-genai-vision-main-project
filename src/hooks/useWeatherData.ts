import { useState, useEffect } from 'react';

interface DailyForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  humidity: number;
}

interface WeatherData {
  temperature: number;
  rainfall: number;
  humidity: number;
  location: string;
  forecast: DailyForecast[];
  plantingWindow?: {
    recommended: boolean;
    reason: string;
    bestDays: string[];
  };
}

interface UseWeatherDataProps {
  latitude?: number;
  longitude?: number;
  cityName?: string;
  enabled?: boolean;
}

export const useWeatherData = ({ latitude, longitude, cityName, enabled = false }: UseWeatherDataProps = {}) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || (!cityName && (!latitude || !longitude))) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        let finalLat = latitude;
        let finalLon = longitude;
        let locationName = '';

        // If city name is provided, geocode it first
        if (cityName) {
          try {
            const geocodeResponse = await fetch(
              `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1&accept-language=en`,
              {
                headers: {
                  'User-Agent': 'Smart-Crop-Forecasting-App'
                }
              }
            );

            if (geocodeResponse.ok) {
              const geocodeData = await geocodeResponse.json();
              if (geocodeData && geocodeData.length > 0) {
                finalLat = parseFloat(geocodeData[0].lat);
                finalLon = parseFloat(geocodeData[0].lon);
                locationName = geocodeData[0].display_name?.split(',')[0] || cityName;
              } else {
                throw new Error('City not found. Please check the spelling and try again.');
              }
            } else {
              throw new Error('Unable to find city location.');
            }
          } catch (geoError) {
            setError(geoError instanceof Error ? geoError.message : 'Failed to find city location');
            setLoading(false);
            return;
          }
        }

        if (!finalLat || !finalLon) {
          throw new Error('Location coordinates not available');
        }

        // Fetch current weather and 7-day forecast data from Open-Meteo API
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${finalLat}&longitude=${finalLon}&current=temperature_2m,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_mean&timezone=auto&forecast_days=7`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();

        // Process 7-day forecast
        const forecast: DailyForecast[] = data.daily.time.map((date: string, index: number) => ({
          date,
          maxTemp: Math.round(data.daily.temperature_2m_max[index]),
          minTemp: Math.round(data.daily.temperature_2m_min[index]),
          precipitation: Math.round(data.daily.precipitation_sum[index] || 0),
          humidity: Math.round(data.daily.relative_humidity_2m_mean[index]),
        }));

        // Get location name using reverse geocoding if not already set from city name
        if (!locationName) {
          try {
            const geoResponse = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${finalLat}&lon=${finalLon}&format=json&accept-language=en`,
              {
                headers: {
                  'User-Agent': 'Smart-Crop-Forecasting-App'
                }
              }
            );
            
            if (geoResponse.ok) {
              const geoData = await geoResponse.json();
              // Try to get city, town, or village name, fallback to display_name
              locationName = geoData.address?.city || 
                            geoData.address?.town || 
                            geoData.address?.village || 
                            geoData.address?.state ||
                            geoData.display_name?.split(',')[0] || 
                            cityName || 
                            'Unknown Location';
            }
          } catch (geoError) {
            console.error('Geocoding error:', geoError);
            locationName = cityName || 'Unknown Location';
          }
        }

        // Analyze planting window based on forecast
        const plantingWindow = analyzePlantingWindow(forecast);

        setWeatherData({
          temperature: Math.round(data.current.temperature_2m),
          rainfall: Math.round(data.daily.precipitation_sum[0] || 0),
          humidity: Math.round(data.current.relative_humidity_2m),
          location: locationName,
          forecast,
          plantingWindow,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude, cityName, enabled]);

  return { weatherData, loading, error };
};

// Analyze forecast to determine optimal planting window
function analyzePlantingWindow(forecast: DailyForecast[]) {
  const bestDays: string[] = [];
  let recommended = true;
  let reason = '';

  // Check for extreme conditions
  const hasFreezingDays = forecast.some(day => day.minTemp < 0);
  const hasHeatWave = forecast.some(day => day.maxTemp > 35);
  const hasHeavyRain = forecast.some(day => day.precipitation > 50);
  const totalRainfall = forecast.reduce((sum, day) => sum + day.precipitation, 0);
  const avgTemp = forecast.reduce((sum, day) => sum + (day.maxTemp + day.minTemp) / 2, 0) / forecast.length;

  // Identify best planting days (moderate temp, low rain)
  forecast.forEach(day => {
    const avgDayTemp = (day.maxTemp + day.minTemp) / 2;
    if (avgDayTemp >= 10 && avgDayTemp <= 30 && day.precipitation < 10) {
      bestDays.push(day.date);
    }
  });

  // Determine recommendation
  if (hasFreezingDays) {
    recommended = false;
    reason = 'Freezing temperatures expected. Wait for warmer conditions to avoid frost damage.';
  } else if (hasHeatWave) {
    recommended = false;
    reason = 'Extreme heat expected. Delay planting or ensure adequate irrigation systems are ready.';
  } else if (hasHeavyRain) {
    recommended = false;
    reason = 'Heavy rainfall expected. Wait for drier conditions to prevent seed rot and soil compaction.';
  } else if (totalRainfall < 5) {
    recommended = true;
    reason = 'Dry conditions ahead. Good for planting, but prepare irrigation immediately after sowing.';
  } else if (avgTemp >= 15 && avgTemp <= 25 && totalRainfall >= 10 && totalRainfall <= 40) {
    recommended = true;
    reason = 'Excellent conditions! Moderate temperatures and adequate rainfall create ideal planting conditions.';
  } else if (bestDays.length >= 3) {
    recommended = true;
    reason = `Good planting window. ${bestDays.length} favorable days ahead with moderate conditions.`;
  } else {
    recommended = true;
    reason = 'Conditions are acceptable for planting with proper soil preparation and care.';
  }

  return {
    recommended,
    reason,
    bestDays: bestDays.slice(0, 3), // Return top 3 best days
  };
}
