/**
 * Weather & Geolocation Types for Oman Live Weather Application
 */

export interface LocationCoords {
  lat: number;
  lng: number;
  accuracy?: number;
  altitude?: number | null;
  heading?: number | null;
  speed?: number | null;
}

export interface OmanRegion {
  id: string;
  name: string;
  arabicName: string;
  governorate: string;
  lat: number;
  lng: number;
  description: string;
  climateType: 'coastal' | 'desert' | 'mountain' | 'monsoon_subtropical';
  isCapital?: boolean;
}

export interface CurrentWeather {
  temperature: number; // Celsius
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  conditionText: string;
  conditionCode: string;
  iconUri?: string;
  isDaytime: boolean;
  humidity: number; // %
  windSpeed: number; // km/h
  windGust?: number;
  windDirection: number; // degrees
  windCardinal: string;
  pressure: number; // hPa / mbar
  uvIndex: number;
  visibility: number; // km
  cloudCover: number; // %
  precipitationProb: number; // %
  dewPoint: number;
  observedAt: string;
  source: 'google' | 'meteorological_station';
}

export interface HourlyForecastItem {
  time: string; // ISO or display hour
  hourLabel: string;
  temperature: number;
  feelsLike: number;
  precipitationProb: number;
  humidity: number;
  windSpeed: number;
  conditionText: string;
  conditionCode: string;
  iconUri?: string;
  isDaytime: boolean;
}

export interface DailyForecastItem {
  date: string;
  dayLabel: string;
  tempMax: number;
  tempMin: number;
  precipitationProb: number;
  conditionText: string;
  conditionCode: string;
  humidity: number;
  windSpeedMax: number;
  uvIndexMax: number;
  sunrise?: string;
  sunset?: string;
}

export interface WeatherStationPOI {
  id: string;
  name: string;
  arabicName: string;
  category: 'weather_station' | 'city' | 'landmark' | 'coastal_harbor' | 'mountain_peak';
  lat: number;
  lng: number;
  elevationMeters: number;
  typicalCondition: string;
}
