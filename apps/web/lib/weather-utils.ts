// Weather code mappings based on WMO standard used by Open-Meteo
export const weatherCodeMap: Record<number, { description: string; icon: string; iconDay?: string; iconNight?: string }> = {
  0: { description: 'Clear sky', icon: '☀️', iconDay: '☀️', iconNight: '🌙' },
  1: { description: 'Mainly clear', icon: '🌤️', iconDay: '🌤️', iconNight: '🌙' },
  2: { description: 'Partly cloudy', icon: '⛅', iconDay: '⛅', iconNight: '☁️' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Fog', icon: '🌫️' },
  48: { description: 'Depositing rime fog', icon: '🌫️' },
  51: { description: 'Light drizzle', icon: '🌦️' },
  53: { description: 'Moderate drizzle', icon: '🌦️' },
  55: { description: 'Dense drizzle', icon: '🌧️' },
  56: { description: 'Light freezing drizzle', icon: '🌦️' },
  57: { description: 'Dense freezing drizzle', icon: '🌧️' },
  61: { description: 'Slight rain', icon: '🌦️' },
  63: { description: 'Moderate rain', icon: '🌧️' },
  65: { description: 'Heavy rain', icon: '🌧️' },
  66: { description: 'Light freezing rain', icon: '🌧️' },
  67: { description: 'Heavy freezing rain', icon: '🌧️' },
  71: { description: 'Slight snow', icon: '🌨️' },
  73: { description: 'Moderate snow', icon: '❄️' },
  75: { description: 'Heavy snow', icon: '❄️' },
  77: { description: 'Snow grains', icon: '❄️' },
  80: { description: 'Slight rain showers', icon: '🌦️' },
  81: { description: 'Moderate rain showers', icon: '🌧️' },
  82: { description: 'Violent rain showers', icon: '⛈️' },
  85: { description: 'Slight snow showers', icon: '🌨️' },
  86: { description: 'Heavy snow showers', icon: '❄️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
  96: { description: 'Thunderstorm with slight hail', icon: '⛈️' },
  99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' },
};

export function getWeatherInfo(code: number, isDay?: boolean) {
  const weather = weatherCodeMap[code] || { description: 'Unknown', icon: '❓' };
  
  let icon = weather.icon;
  if (isDay !== undefined && weather.iconDay && weather.iconNight) {
    icon = isDay ? weather.iconDay : weather.iconNight;
  }
  
  return { ...weather, icon };
}

export function formatTemperature(temp: number, units: 'metric' | 'imperial' = 'metric'): string {
  const rounded = Math.round(temp);
  const unit = units === 'imperial' ? '°F' : '°C';
  return `${rounded}${unit}`;
}

export function formatWindSpeed(speed: number, units: 'metric' | 'imperial' = 'metric'): string {
  const rounded = Math.round(speed);
  const unit = units === 'imperial' ? 'mph' : 'km/h';
  return `${rounded} ${unit}`;
}

export function formatPrecipitation(precip: number, units: 'metric' | 'imperial' = 'metric'): string {
  const formatted = precip.toFixed(1);
  const unit = units === 'imperial' ? 'in' : 'mm';
  return `${formatted} ${unit}`;
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

export function formatTime(timeString: string, timezone?: string): string {
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    timeZone: timezone,
  });
}

export function formatDate(timeString: string, timezone?: string): string {
  const date = new Date(timeString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    timeZone: timezone,
  });
}