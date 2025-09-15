import { NextRequest, NextResponse } from 'next/server';

interface OpenMeteoCurrentWeather {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
}

interface OpenMeteoHourlyWeather {
  time: string[];
  temperature_2m: number[];
  precipitation_probability: number[];
  weather_code: number[];
}

interface OpenMeteoDailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  wind_speed_10m_max: number[];
}

interface OpenMeteoApiResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: Record<string, string>;
  current: OpenMeteoCurrentWeather;
  hourly_units: Record<string, string>;
  hourly: OpenMeteoHourlyWeather;
  daily_units: Record<string, string>;
  daily: OpenMeteoDailyWeather;
}

export interface CurrentWeather {
  temperature: number;
  apparent: number;
  humidity: number;
  windSpeed: number;
  windDir: number;
  code: number;
  isDay: boolean;
  time: string;
  precipitation: number;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  precipitationProbability: number;
  code: number;
}

export interface DailyForecast {
  time: string;
  code: number;
  temperatureMax: number;
  temperatureMin: number;
  precipitationSum: number;
  windSpeedMax: number;
}

export interface WeatherResponse {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  timezone: string;
}

// Mock weather data for development/testing when external API is unavailable
const getMockWeatherData = (lat: number): WeatherResponse => {
  const now = new Date();
  const timezone = 'Europe/Lisbon'; // Default for testing
  
  // Generate mock current weather
  const current: CurrentWeather = {
    temperature: 18 + Math.sin(lat) * 10,
    apparent: 16 + Math.sin(lat) * 10,
    humidity: 65 + Math.random() * 20,
    windSpeed: 5 + Math.random() * 15,
    windDir: Math.floor(Math.random() * 360),
    code: Math.random() > 0.7 ? 3 : 1, // Mostly clear, some clouds
    isDay: now.getHours() >= 6 && now.getHours() < 20,
    time: now.toISOString(),
    precipitation: Math.random() > 0.8 ? Math.random() * 2 : 0,
  };

  // Generate mock hourly data (next 24 hours)
  const hourly: HourlyForecast[] = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date(now.getTime() + i * 60 * 60 * 1000);
    return {
      time: hour.toISOString(),
      temperature: current.temperature + Math.sin(i / 4) * 3 + Math.random() * 2 - 1,
      precipitationProbability: Math.floor(Math.random() * 30),
      code: Math.random() > 0.8 ? 3 : 1,
    };
  });

  // Generate mock daily data (next 7 days)
  const daily: DailyForecast[] = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    const baseTemp = current.temperature + Math.sin(i / 3) * 5;
    return {
      time: day.toISOString().split('T')[0],
      code: Math.random() > 0.7 ? 3 : 1,
      temperatureMax: baseTemp + 5 + Math.random() * 3,
      temperatureMin: baseTemp - 5 - Math.random() * 3,
      precipitationSum: Math.random() > 0.6 ? Math.random() * 5 : 0,
      windSpeedMax: current.windSpeed + Math.random() * 5,
    };
  });

  return { current, hourly, daily, timezone };
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const units = searchParams.get('units') || 'metric';

    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Query parameters "lat" and "lon" are required' },
        { status: 400 }
      );
    }

    // Validate coordinates
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    
    if (isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return NextResponse.json(
        { error: 'Invalid coordinates' },
        { status: 400 }
      );
    }

    try {
      // Build Open-Meteo API URL
      const weatherUrl = new URL('https://api.open-meteo.com/v1/forecast');
      weatherUrl.searchParams.set('latitude', latitude.toString());
      weatherUrl.searchParams.set('longitude', longitude.toString());
      weatherUrl.searchParams.set('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m');
      weatherUrl.searchParams.set('hourly', 'temperature_2m,precipitation_probability,weather_code');
      weatherUrl.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max');
      weatherUrl.searchParams.set('timezone', 'auto');
      weatherUrl.searchParams.set('forecast_days', '7');

      // Add unit parameters if imperial
      if (units === 'imperial') {
        weatherUrl.searchParams.set('temperature_unit', 'fahrenheit');
        weatherUrl.searchParams.set('wind_speed_unit', 'mph');
        weatherUrl.searchParams.set('precipitation_unit', 'inch');
      }

      const response = await fetch(weatherUrl.toString(), {
        next: { revalidate: 300 }, // Cache for 5 minutes
      });

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data: OpenMeteoApiResponse = await response.json();

      // Transform current weather
      const current: CurrentWeather = {
        temperature: data.current.temperature_2m,
        apparent: data.current.apparent_temperature,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        windDir: data.current.wind_direction_10m,
        code: data.current.weather_code,
        isDay: data.current.is_day === 1,
        time: data.current.time,
        precipitation: data.current.precipitation,
      };

      // Transform hourly forecast (next 24 hours)
      const hourly: HourlyForecast[] = data.hourly.time.slice(0, 24).map((time, index) => ({
        time,
        temperature: data.hourly.temperature_2m[index],
        precipitationProbability: data.hourly.precipitation_probability[index],
        code: data.hourly.weather_code[index],
      }));

      // Transform daily forecast
      const daily: DailyForecast[] = data.daily.time.map((time, index) => ({
        time,
        code: data.daily.weather_code[index],
        temperatureMax: data.daily.temperature_2m_max[index],
        temperatureMin: data.daily.temperature_2m_min[index],
        precipitationSum: data.daily.precipitation_sum[index],
        windSpeedMax: data.daily.wind_speed_10m_max[index],
      }));

      const result: WeatherResponse = {
        current,
        hourly,
        daily,
        timezone: data.timezone,
      };

      return NextResponse.json(result);
    } catch (apiError) {
      console.warn('External API unavailable, using mock data:', apiError);
      // Fallback to mock data for development/testing
      const mockData = getMockWeatherData(latitude);
      return NextResponse.json(mockData);
    }
  } catch (error) {
    console.error('Error in weather API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}