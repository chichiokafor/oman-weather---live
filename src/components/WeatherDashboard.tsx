import React from 'react';
import { CurrentWeather, LocationCoords } from '../types/weather';
import {
  Thermometer,
  Wind,
  Droplets,
  Sun,
  Eye,
  Gauge,
  Compass,
  ArrowUp,
  ArrowDown,
  CloudRain,
  ShieldAlert,
  Clock,
  Sparkles,
} from 'lucide-react';

interface WeatherDashboardProps {
  weather: CurrentWeather;
  coords: LocationCoords;
  regionName: string;
  arabicName: string;
  isGpsActive: boolean;
  distanceKm: number;
}

export const WeatherDashboard: React.FC<WeatherDashboardProps> = ({
  weather,
  coords,
  regionName,
  arabicName,
  isGpsActive,
  distanceKm,
}) => {
  // Determine UV risk level
  const getUvRisk = (uv: number) => {
    if (uv <= 2) return { label: 'Low', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
    if (uv <= 5) return { label: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
    if (uv <= 7) return { label: 'High', color: 'text-amber-400', bg: 'bg-amber-500/10' };
    if (uv <= 10) return { label: 'Very High', color: 'text-orange-400', bg: 'bg-orange-500/10' };
    return { label: 'Extreme', color: 'text-rose-400', bg: 'bg-rose-500/10' };
  };

  const uvRisk = getUvRisk(weather.uvIndex);

  // Determine heat comfort based on temperature & humidity
  const getComfortStatus = () => {
    if (weather.temperature > 40) return 'Severe Interior Heat — Avoid midday direct sun';
    if (weather.temperature > 35 && weather.humidity > 60) return 'High Coastal Humidity & Heat';
    if (weather.temperature > 30) return 'Warm & Sunny Arabian Climate';
    if (weather.temperature > 22) return 'Pleasant & Moderate Weather';
    return 'Cool Mountain / Winter Breezes';
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Hero Weather Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 border border-slate-700/70 p-6 md:p-8 text-white shadow-2xl">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Location & Title */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {isGpsActive ? 'Your Live Location' : 'Oman Selected Region'}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Live Telemetry
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              {regionName}
              <span className="text-2xl md:text-3xl font-medium text-amber-300 font-arabic">
                {arabicName}
              </span>
            </h1>

            <p className="text-xs md:text-sm text-slate-300 mt-1 flex items-center gap-2">
              <span>Coordinates: {coords.lat.toFixed(4)}° N, {coords.lng.toFixed(4)}° E</span>
              {distanceKm > 0 && (
                <span className="text-emerald-400 font-medium">({distanceKm} km from center)</span>
              )}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{getComfortStatus()}</span>
            </div>
          </div>

          {/* Temperature & Condition Highlight */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-5xl md:text-6xl font-black tracking-tight text-white flex items-start justify-end">
                <span>{weather.temperature}</span>
                <span className="text-2xl md:text-3xl font-medium text-emerald-400 mt-1">°C</span>
              </div>
              <p className="text-sm font-semibold text-emerald-300 mt-1">
                {weather.conditionText}
              </p>
              <div className="flex items-center justify-end gap-3 text-xs text-slate-300 mt-1 font-medium">
                <span className="flex items-center gap-0.5 text-rose-300">
                  <ArrowUp className="w-3 h-3" />
                  High: {weather.tempMax}°C
                </span>
                <span className="flex items-center gap-0.5 text-cyan-300">
                  <ArrowDown className="w-3 h-3" />
                  Low: {weather.tempMin}°C
                </span>
              </div>
            </div>

            {/* Weather Icon/Graphic */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-amber-400/20 to-emerald-500/20 border border-slate-700/80 flex items-center justify-center p-3 shadow-inner">
              {weather.iconUri ? (
                <img
                  src={weather.iconUri}
                  alt={weather.conditionText}
                  className="w-full h-full object-contain filter drop-shadow-md"
                />
              ) : (
                <Sun className="w-12 h-12 text-amber-400 animate-[spin_12s_linear_infinite]" />
              )}
            </div>
          </div>
        </div>

        {/* Quick summary strip */}
        <div className="relative z-10 mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block">Feels Like</span>
            <span className="text-sm font-bold text-white">{weather.feelsLike}°C</span>
          </div>
          <div>
            <span className="text-slate-400 block">Relative Humidity</span>
            <span className="text-sm font-bold text-white">{weather.humidity}%</span>
          </div>
          <div>
            <span className="text-slate-400 block">Wind Velocity</span>
            <span className="text-sm font-bold text-white">
              {weather.windSpeed} km/h ({weather.windCardinal})
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">UV Radiation Index</span>
            <span className={`text-sm font-bold ${uvRisk.color}`}>
              {weather.uvIndex} — {uvRisk.label}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Key Weather Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Wind & Direction */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-white shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Wind</span>
            <Wind className="w-4 h-4 text-teal-400" />
          </div>
          <div>
            <div className="text-xl font-bold">{weather.windSpeed} <span className="text-xs font-normal text-slate-400">km/h</span></div>
            <p className="text-xs text-slate-400 mt-0.5">
              Direction: <span className="text-teal-300 font-medium">{weather.windCardinal} ({weather.windDirection}°)</span>
            </p>
            {weather.windGust && (
              <p className="text-[11px] text-amber-400 mt-1">Gusts: {weather.windGust} km/h</p>
            )}
          </div>
        </div>

        {/* Humidity */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-white shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Humidity</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-xl font-bold">{weather.humidity}%</div>
            <p className="text-xs text-slate-400 mt-0.5">
              Dew Point: <span className="text-cyan-300 font-medium">{weather.dewPoint}°C</span>
            </p>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-cyan-400 h-full rounded-full"
                style={{ width: `${Math.min(100, weather.humidity)}%` }}
              />
            </div>
          </div>
        </div>

        {/* UV Index */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-white shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">UV Index</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className={`text-xl font-bold ${uvRisk.color}`}>{weather.uvIndex}</div>
            <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full mt-1 ${uvRisk.bg} ${uvRisk.color}`}>
              {uvRisk.label}
            </span>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full"
                style={{ width: `${Math.min(100, (weather.uvIndex / 12) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Pressure */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-white shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Air Pressure</span>
            <Gauge className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-xl font-bold">{weather.pressure} <span className="text-xs font-normal text-slate-400">hPa</span></div>
            <p className="text-xs text-slate-400 mt-0.5">
              {weather.pressure > 1013 ? 'High pressure system' : 'Standard atmospheric'}
            </p>
          </div>
        </div>

        {/* Visibility */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-white shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Visibility</span>
            <Eye className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="text-xl font-bold">{weather.visibility} <span className="text-xs font-normal text-slate-400">km</span></div>
            <p className="text-xs text-slate-400 mt-0.5">
              {weather.visibility >= 10 ? 'Clear horizon' : 'Moderate haze / dust'}
            </p>
          </div>
        </div>

        {/* Precipitation Probability */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-white shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Precipitation</span>
            <CloudRain className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <div className="text-xl font-bold">{weather.precipitationProb}%</div>
            <p className="text-xs text-slate-400 mt-0.5">
              Cloud Cover: {weather.cloudCover}%
            </p>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-sky-400 h-full rounded-full"
                style={{ width: `${Math.min(100, weather.precipitationProb)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
