'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Thermometer, Droplets, Wind, Gauge } from 'lucide-react';
import type { CitySearchResult } from './api/weather/search/route';
import type { WeatherResponse } from './api/weather/route';
import { 
  getWeatherInfo, 
  formatTemperature, 
  formatWindSpeed, 
  formatPrecipitation, 
  getWindDirection,
  formatTime,
  formatDate
} from '../lib/weather-utils';

interface UserPreferences {
  units: 'metric' | 'imperial';
  lastLocation?: { lat: number; lon: number; name: string };
}

export default function WeatherDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CitySearchResult[]>([]);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lon: number; name: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({ units: 'metric' });

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('weather-preferences');
        if (saved) {
          const prefs = JSON.parse(saved);
          setPreferences(prefs);
          if (prefs.lastLocation) {
            setSelectedLocation(prefs.lastLocation);
          }
        }
      } catch (error) {
        console.warn('Failed to load preferences:', error);
      }
    }
  }, []);

  // Save preferences to localStorage
  const savePreferences = (newPrefs: UserPreferences) => {
    setPreferences(newPrefs);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('weather-preferences', JSON.stringify(newPrefs));
      } catch (error) {
        console.warn('Failed to save preferences:', error);
      }
    }
  };

  // Search for cities
  const searchCities = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/weather/search?q=${encodeURIComponent(query.trim())}`);
      if (!response.ok) throw new Error('Search failed');
      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchCities(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch weather data
  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}&units=${preferences.units}`);
      if (!response.ok) throw new Error('Failed to fetch weather');
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error('Weather fetch error:', error);
      setError('Failed to load weather data');
    } finally {
      setLoading(false);
    }
  }, [preferences.units]);

  // Handle location selection
  const selectLocation = (location: CitySearchResult) => {
    const newLocation = { 
      lat: location.latitude, 
      lon: location.longitude, 
      name: `${location.name}, ${location.country}` 
    };
    setSelectedLocation(newLocation);
    setSearchQuery('');
    setSearchResults([]);
    
    // Save to preferences
    savePreferences({
      ...preferences,
      lastLocation: newLocation,
    });
    
    fetchWeather(location.latitude, location.longitude);
  };

  // Use geolocation
  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { lat: latitude, lon: longitude, name: 'Current Location' };
        setSelectedLocation(newLocation);
        savePreferences({
          ...preferences,
          lastLocation: newLocation,
        });
        fetchWeather(latitude, longitude);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError('Failed to get current location');
        setLoading(false);
      }
    );
  };

  // Toggle units
  const toggleUnits = () => {
    const newUnits = preferences.units === 'metric' ? 'imperial' : 'metric';
    savePreferences({ ...preferences, units: newUnits });
    
    // Refetch weather if we have a location
    if (selectedLocation) {
      fetchWeather(selectedLocation.lat, selectedLocation.lon);
    }
  };

  // Load weather for saved location on mount
  useEffect(() => {
    if (selectedLocation && !weather) {
      fetchWeather(selectedLocation.lat, selectedLocation.lon);
    }
  }, [selectedLocation, weather, fetchWeather]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Weather Dashboard</h1>
          <p className="text-blue-100">Get current weather and forecasts for any city</p>
        </div>

        {/* Search and Controls */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Box */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for a city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10 max-h-60 overflow-y-auto">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => selectLocation(result)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium">{result.name}</div>
                      <div className="text-sm text-gray-500">
                        {result.admin1 && `${result.admin1}, `}{result.country}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Location and Units Controls */}
            <div className="flex gap-2">
              <button
                onClick={useCurrentLocation}
                className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                disabled={loading}
              >
                <MapPin className="w-5 h-5" />
                Current Location
              </button>
              
              <button
                onClick={toggleUnits}
                className="px-4 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                {preferences.units === 'metric' ? '°C' : '°F'}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center text-white mb-6">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
            <div>Loading weather data...</div>
          </div>
        )}

        {/* Weather Display */}
        {weather && selectedLocation && !loading && (
          <div className="space-y-6">
            {/* Current Weather */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedLocation.name}</h2>
                  <p className="text-blue-100">{formatTime(weather.current.time, weather.timezone)}</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl">{getWeatherInfo(weather.current.code, weather.current.isDay).icon}</div>
                  <div className="text-sm text-blue-100">{getWeatherInfo(weather.current.code).description}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <Thermometer className="w-6 h-6 text-blue-200 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{formatTemperature(weather.current.temperature, preferences.units)}</div>
                  <div className="text-sm text-blue-200">Feels like {formatTemperature(weather.current.apparent, preferences.units)}</div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <Droplets className="w-6 h-6 text-blue-200 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{Math.round(weather.current.humidity)}%</div>
                  <div className="text-sm text-blue-200">Humidity</div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <Wind className="w-6 h-6 text-blue-200 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{formatWindSpeed(weather.current.windSpeed, preferences.units)}</div>
                  <div className="text-sm text-blue-200">{getWindDirection(weather.current.windDir)}</div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <Gauge className="w-6 h-6 text-blue-200 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{formatPrecipitation(weather.current.precipitation, preferences.units)}</div>
                  <div className="text-sm text-blue-200">Precipitation</div>
                </div>
              </div>
            </div>

            {/* Hourly Forecast */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">24-Hour Forecast</h3>
              <div className="overflow-x-auto">
                <div className="flex gap-4 pb-2" style={{ minWidth: 'max-content' }}>
                  {weather.hourly.slice(0, 24).map((hour, index) => (
                    <div key={index} className="bg-white/10 rounded-lg p-3 text-center min-w-[80px]">
                      <div className="text-sm text-blue-200 mb-1">{formatTime(hour.time, weather.timezone)}</div>
                      <div className="text-2xl mb-1">{getWeatherInfo(hour.code).icon}</div>
                      <div className="text-white font-medium">{formatTemperature(hour.temperature, preferences.units)}</div>
                      <div className="text-xs text-blue-200">{hour.precipitationProbability}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Daily Forecast */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">7-Day Forecast</h3>
              <div className="space-y-3">
                {weather.daily.map((day, index) => (
                  <div key={index} className="bg-white/10 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{getWeatherInfo(day.code).icon}</div>
                      <div>
                        <div className="text-white font-medium">{formatDate(day.time, weather.timezone)}</div>
                        <div className="text-sm text-blue-200">{getWeatherInfo(day.code).description}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-white font-medium">
                        {formatTemperature(day.temperatureMax, preferences.units)} / {formatTemperature(day.temperatureMin, preferences.units)}
                      </div>
                      <div className="text-sm text-blue-200">
                        {formatPrecipitation(day.precipitationSum, preferences.units)} • {formatWindSpeed(day.windSpeedMax, preferences.units)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Initial State */}
        {!weather && !loading && !error && (
          <div className="text-center text-white">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold mb-2">Search for a city or use your current location</h2>
            <p className="text-blue-200">Get detailed weather forecasts and current conditions</p>
          </div>
        )}
      </div>
    </div>
  );
}
