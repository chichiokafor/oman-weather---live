import React, { useState, useEffect, useCallback } from 'react';
import { useUserLocation } from './hooks/useUserLocation';
import { getLiveWeatherData } from './services/weatherService';
import { CurrentWeather, HourlyForecastItem, DailyForecastItem } from './types/weather';
import { Navbar } from './components/Navbar';
import { OmanMap } from './components/OmanMap';
import { WeatherDashboard } from './components/WeatherDashboard';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { OmanPresetSelector } from './components/OmanPresetSelector';
import { WeatherAlerts } from './components/WeatherAlerts';
import { SmartActivityAdvisor } from './components/SmartActivityAdvisor';
import { QiblaCompass } from './components/QiblaCompass';
import { AstrologyCelestial } from './components/AstrologyCelestial';
import {
  Loader2,
  AlertTriangle,
  Compass,
  MapPin,
  Sparkles,
  CloudSun,
  Telescope,
  Footprints,
} from 'lucide-react';

type AppTab = 'weather_map' | 'smart_activities' | 'qibla_prayer' | 'astrology';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('weather_map');
  const [quotaExceeded, setQuotaExceeded] = useState<boolean>(false);
  const [weatherData, setWeatherData] = useState<{
    current: CurrentWeather | null;
    hourly: HourlyForecastItem[];
    daily: DailyForecastItem[];
  }>({
    current: null,
    hourly: [],
    daily: [],
  });
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  // Quota defense event listener (Tier 1 & Tier 2)
  useEffect(() => {
    const handleQuotaExceeded = () => {
      setQuotaExceeded(true);
    };
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    };
  }, []);

  // Automated location hook
  const {
    coords,
    closestRegion,
    distanceToRegionKm,
    isInsideOman,
    isLoading: isLoadingLocation,
    error: locationError,
    gpsActive,
    isWatching,
    lastUpdated,
    requestGpsLocation,
    toggleWatchMode,
    selectOmanRegion,
    setCustomLocation,
  } = useUserLocation();

  // Maps API Key resolution
  const apiKey =
    (typeof import.meta !== 'undefined' &&
      (import.meta.env?.VITE_GOOGLE_MAPS_API_KEY || import.meta.env?.GOOGLE_MAPS_API_KEY)) ||
    (typeof process !== 'undefined' && process.env?.GOOGLE_MAPS_API_KEY) ||
    '';

  // Load weather when coordinates change
  const fetchWeather = useCallback(async (lat: number, lng: number) => {
    setIsLoadingWeather(true);
    setWeatherError(null);
    try {
      const data = await getLiveWeatherData(lat, lng, apiKey);
      setWeatherData(data);
    } catch (err: any) {
      console.error('Failed to load weather:', err);
      setWeatherError(err?.message || 'Unable to retrieve real-time weather data.');
    } finally {
      setIsLoadingWeather(false);
    }
  }, [apiKey]);

  useEffect(() => {
    fetchWeather(coords.lat, coords.lng);
  }, [coords.lat, coords.lng, fetchWeather]);

  const handleManualRefresh = () => {
    if (gpsActive) {
      requestGpsLocation();
    }
    fetchWeather(coords.lat, coords.lng);
  };

  const handleActivitySelectLocation = (lat: number, lng: number) => {
    setCustomLocation(lat, lng);
    setActiveTab('weather_map');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Tier 2 Quota Defense Notice Banner */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        coords={coords}
        regionName={closestRegion.name}
        isGpsActive={gpsActive}
        isWatchingGps={isWatching}
        isLoading={isLoadingLocation || isLoadingWeather}
        lastUpdated={lastUpdated}
        onRefresh={handleManualRefresh}
        onToggleWatch={toggleWatchMode}
        onRequestGps={requestGpsLocation}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8 flex flex-col gap-6">
        {/* Location Notice / Error Bar if any */}
        {locationError && (
          <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{locationError}</span>
            </div>
            <button
              onClick={requestGpsLocation}
              className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded-lg font-semibold transition-colors shrink-0"
            >
              Retry Location
            </button>
          </div>
        )}

        {/* Region & Governorate Quick Selector */}
        <OmanPresetSelector
          currentRegionId={closestRegion.id}
          isGpsActive={gpsActive}
          isWatchingGps={isWatching}
          isLoadingLocation={isLoadingLocation}
          isInsideOman={isInsideOman}
          onSelectRegion={selectOmanRegion}
          onRequestGps={requestGpsLocation}
          onToggleWatchGps={toggleWatchMode}
        />

        {/* Feature Navigation Tabs */}
        <div className="flex gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 overflow-x-auto shadow-lg">
          <button
            onClick={() => setActiveTab('weather_map')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'weather_map'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <CloudSun className="w-4 h-4" />
            <span>Map &amp; Live Weather</span>
          </button>

          <button
            onClick={() => setActiveTab('smart_activities')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'smart_activities'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Footprints className="w-4 h-4" />
            <span>Smart Activity Advisor</span>
          </button>

          <button
            onClick={() => setActiveTab('qibla_prayer')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'qibla_prayer'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Qibla Compass &amp; Prayer Times</span>
          </button>

          <button
            onClick={() => setActiveTab('astrology')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'astrology'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Astrology &amp; Sky Predictions</span>
          </button>
        </div>

        {/* TAB 1: Core Map & Weather View */}
        {activeTab === 'weather_map' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Interactive Google Map with live GPS */}
              <div className="lg:col-span-7 flex flex-col min-h-[500px] h-[520px] lg:h-[620px]">
                <OmanMap
                  userCoords={coords}
                  currentWeather={weatherData.current}
                  regionName={closestRegion.name}
                  isGpsActive={gpsActive}
                  apiKey={apiKey}
                  onSelectCoordinates={setCustomLocation}
                  onRecenter={requestGpsLocation}
                />
              </div>

              {/* Current Live Weather Dashboard Card */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                {isLoadingWeather && !weatherData.current ? (
                  <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-slate-400">
                    <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
                    <p className="text-sm font-semibold text-slate-300">
                      Acquiring Real-Time Weather in Oman...
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Connecting to Google Maps Platform &amp; Meteorological telemetry
                    </p>
                  </div>
                ) : weatherData.current ? (
                  <WeatherDashboard
                    weather={weatherData.current}
                    coords={coords}
                    regionName={closestRegion.name}
                    arabicName={closestRegion.arabicName}
                    isGpsActive={gpsActive}
                    distanceKm={distanceToRegionKm}
                  />
                ) : (
                  <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center">
                    <p className="text-sm text-slate-400">
                      {weatherError || 'Weather data unavailable. Please click refresh.'}
                    </p>
                    <button
                      onClick={handleManualRefresh}
                      className="mt-3 px-4 py-2 bg-emerald-600 rounded-xl text-xs font-semibold text-white hover:bg-emerald-500 transition-colors"
                    >
                      Retry Loading Weather
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 24-Hour Hourly Forecast */}
            <HourlyForecast hourly={weatherData.hourly} />

            {/* 7-Day Extended Outlook */}
            <DailyForecast daily={weatherData.daily} />

            {/* Meteorological & Environmental Safety Advisories for Oman */}
            {weatherData.current && (
              <WeatherAlerts weather={weatherData.current} regionName={closestRegion.name} />
            )}
          </div>
        )}

        {/* TAB 2: Smart Activity Advisor */}
        {activeTab === 'smart_activities' && (
          <SmartActivityAdvisor
            weather={weatherData.current}
            userCoords={coords}
            onSelectActivityLocation={handleActivitySelectLocation}
          />
        )}

        {/* TAB 3: Qibla Compass & Prayer Times */}
        {activeTab === 'qibla_prayer' && (
          <QiblaCompass coords={coords} regionName={closestRegion.name} />
        )}

        {/* TAB 4: Astrology & Sky Predictions */}
        {activeTab === 'astrology' && (
          <AstrologyCelestial
            weather={weatherData.current}
            coords={coords}
            regionName={closestRegion.name}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Sultanate of Oman Weather &amp; Climate Network</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
            <span>Powered by Google Maps Platform &amp; Astronomical Algorithms</span>
            <a
              href="https://cloud.google.com/maps-platform/terms?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 underline"
            >
              Maps Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
