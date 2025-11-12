import { useState, useEffect } from 'react';

interface WeatherData {
  temperature: number;
  rainfall: number;
  humidity: number;
  location: string;
}

interface UseWeatherDataProps {
  latitude?: number;
  longitude?: number;
  enabled?: boolean;
}

export const useWeatherData = ({ latitude, longitude, enabled = false }: UseWeatherDataProps = {}) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !latitude || !longitude) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch current weather and forecast data from Open-Meteo API
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m&daily=precipitation_sum&timezone=auto`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();

        // Get location name using reverse geocoding from OpenStreetMap Nominatim
        let locationName = 'Unknown Location';
        try {
          const geoResponse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`,
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
                          'Unknown Location';
          }
        } catch (geoError) {
          console.error('Geocoding error:', geoError);
          // Keep default 'Unknown Location'
        }

        setWeatherData({
          temperature: Math.round(data.current.temperature_2m),
          rainfall: Math.round(data.daily.precipitation_sum[0] || 0),
          humidity: Math.round(data.current.relative_humidity_2m),
          location: locationName,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude, enabled]);

  return { weatherData, loading, error };
};
