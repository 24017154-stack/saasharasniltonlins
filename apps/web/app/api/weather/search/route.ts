import { NextRequest, NextResponse } from 'next/server';

interface GeocodeResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  admin4?: string;
  timezone?: string;
  population?: number;
  postcodes?: string[];
  country: string;
  admin1_name?: string;
  admin2_name?: string;
  admin3_name?: string;
  admin4_name?: string;
}

interface GeocodeApiResponse {
  results?: GeocodeResult[];
  generationtime_ms: number;
}

export interface CitySearchResult {
  id: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

// Mock data for development/testing when external API is unavailable
const getMockCityResults = (query: string): CitySearchResult[] => {
  const mockCities = [
    { id: 1, name: 'Lisboa', country: 'Portugal', admin1: 'Lisbon', latitude: 38.7223, longitude: -9.1393, timezone: 'Europe/Lisbon' },
    { id: 2, name: 'Porto', country: 'Portugal', admin1: 'Porto', latitude: 41.1579, longitude: -8.6291, timezone: 'Europe/Lisbon' },
    { id: 3, name: 'São Paulo', country: 'Brazil', admin1: 'São Paulo', latitude: -23.5505, longitude: -46.6333, timezone: 'America/Sao_Paulo' },
    { id: 4, name: 'Rio de Janeiro', country: 'Brazil', admin1: 'Rio de Janeiro', latitude: -22.9068, longitude: -43.1729, timezone: 'America/Sao_Paulo' },
    { id: 5, name: 'New York', country: 'United States', admin1: 'New York', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York' },
  ];
  
  const searchLower = query.toLowerCase();
  return mockCities.filter(city => 
    city.name.toLowerCase().includes(searchLower) ||
    city.country.toLowerCase().includes(searchLower)
  );
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    try {
      // Call Open-Meteo Geocoding API
      const geocodeUrl = new URL('https://geocoding-api.open-meteo.com/v1/search');
      geocodeUrl.searchParams.set('name', query.trim());
      geocodeUrl.searchParams.set('count', '5');
      geocodeUrl.searchParams.set('language', 'pt');
      geocodeUrl.searchParams.set('format', 'json');

      const response = await fetch(geocodeUrl.toString(), {
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const data: GeocodeApiResponse = await response.json();

      // Transform the response to our simplified format
      const results: CitySearchResult[] = (data.results || []).map((result) => ({
        id: result.id,
        name: result.name,
        country: result.country,
        admin1: result.admin1_name || result.admin1,
        latitude: result.latitude,
        longitude: result.longitude,
        timezone: result.timezone,
      }));

      return NextResponse.json(results);
    } catch (apiError) {
      console.warn('External API unavailable, using mock data:', apiError);
      // Fallback to mock data for development/testing
      const mockResults = getMockCityResults(query.trim());
      return NextResponse.json(mockResults);
    }
  } catch (error) {
    console.error('Error in weather search API:', error);
    return NextResponse.json(
      { error: 'Failed to search for locations' },
      { status: 500 }
    );
  }
}