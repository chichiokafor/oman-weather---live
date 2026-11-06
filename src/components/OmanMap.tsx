import React, { useState, useCallback, useEffect } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import { LocationCoords, WeatherStationPOI, CurrentWeather } from '../types/weather';
import { OMAN_WEATHER_STATIONS } from '../data/omanData';
import {
  Navigation,
  Layers,
  MapPin,
  Compass,
  Crosshair,
  Thermometer,
  Wind,
  Info,
  Sparkles,
} from 'lucide-react';

interface OmanMapProps {
  userCoords: LocationCoords;
  currentWeather: CurrentWeather | null;
  regionName: string;
  isGpsActive: boolean;
  apiKey: string;
  onSelectCoordinates: (lat: number, lng: number) => void;
  onRecenter: () => void;
}

// Subcomponent to smoothly pan the map when user location changes
function MapCameraController({
  target,
  recenterTrigger,
}: {
  target: LocationCoords;
  recenterTrigger: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.panTo({ lat: target.lat, lng: target.lng });
      // Keep comfortable zoom
      const currentZoom = map.getZoom() ?? 12;
      if (currentZoom < 10) {
        map.setZoom(12);
      }
    }
  }, [map, target.lat, target.lng, recenterTrigger]);

  return null;
}

export const OmanMap: React.FC<OmanMapProps> = ({
  userCoords,
  currentWeather,
  regionName,
  isGpsActive,
  apiKey,
  onSelectCoordinates,
  onRecenter,
}) => {
  const [selectedStation, setSelectedStation] = useState<WeatherStationPOI | null>(null);
  const [showStations, setShowStations] = useState<boolean>(true);
  const [mapTypeId, setMapTypeId] = useState<'roadmap' | 'satellite' | 'terrain'>('roadmap');
  const [recenterCount, setRecenterCount] = useState<number>(0);

  const handleRecenterClick = () => {
    setRecenterCount((prev) => prev + 1);
    onRecenter();
  };

  const handleMapClick = useCallback(
    (e: any) => {
      if (e.detail?.latLng) {
        const lat = e.detail.latLng.lat;
        const lng = e.detail.latLng.lng;
        onSelectCoordinates(lat, lng);
      }
    },
    [onSelectCoordinates]
  );

  return (
    <div className="relative w-full h-full min-h-[480px] rounded-2xl overflow-hidden shadow-xl border border-slate-700/60 bg-slate-900">
      <APIProvider apiKey={apiKey}>
        <Map
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          defaultCenter={{ lat: userCoords.lat, lng: userCoords.lng }}
          defaultZoom={12}
          mapTypeId={mapTypeId}
          gestureHandling="greedy"
          disableDefaultUI={false}
          onClick={handleMapClick}
          className="w-full h-full"
          style={{ width: '100%', height: '100%', minHeight: '480px' }}
        >
          <MapCameraController target={userCoords} recenterTrigger={recenterCount} />

          {/* User's live GPS AdvancedMarker with pulsing radar animation */}
          <AdvancedMarker
            position={{ lat: userCoords.lat, lng: userCoords.lng }}
            title={`Your Location: ${regionName}`}
          >
            <div className="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
              {/* Radar pulse animation */}
              <div className="absolute w-12 h-12 bg-emerald-500/25 rounded-full animate-ping pointer-events-none" />
              <div className="absolute w-8 h-8 bg-emerald-500/40 rounded-full animate-pulse pointer-events-none" />

              {/* Core Location Badge */}
              <div className="relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/95 border-2 border-emerald-400 text-white shadow-2xl backdrop-blur-md">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                <span className="text-xs font-bold tracking-wide">
                  {isGpsActive ? 'My Location' : 'Location'}
                </span>
                {currentWeather && (
                  <span className="text-xs font-semibold text-emerald-300 ml-1 border-l border-slate-700 pl-1.5">
                    {currentWeather.temperature}°C
                  </span>
                )}
              </div>
            </div>
          </AdvancedMarker>

          {/* Regional Weather Station Markers */}
          {showStations &&
            OMAN_WEATHER_STATIONS.map((station) => (
              <AdvancedMarker
                key={station.id}
                position={{ lat: station.lat, lng: station.lng }}
                onClick={() => setSelectedStation(station)}
                title={station.name}
              >
                <div className="group relative cursor-pointer transform transition-transform hover:scale-110">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 ${
                      station.category === 'mountain_peak'
                        ? 'bg-purple-900/90 border-purple-400 text-purple-200'
                        : station.category === 'weather_station'
                        ? 'bg-blue-900/90 border-cyan-400 text-cyan-200'
                        : station.category === 'coastal_harbor'
                        ? 'bg-teal-900/90 border-teal-300 text-teal-100'
                        : 'bg-amber-900/90 border-amber-400 text-amber-200'
                    }`}
                  >
                    {station.category === 'mountain_peak' ? (
                      <Compass className="w-3.5 h-3.5" />
                    ) : station.category === 'weather_station' ? (
                      <Thermometer className="w-3.5 h-3.5" />
                    ) : station.category === 'coastal_harbor' ? (
                      <Wind className="w-3.5 h-3.5" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>
              </AdvancedMarker>
            ))}

          {/* Info Window for Selected Station */}
          {selectedStation && (
            <InfoWindow
              position={{ lat: selectedStation.lat, lng: selectedStation.lng }}
              onCloseClick={() => setSelectedStation(null)}
            >
              <div className="p-2.5 max-w-xs text-slate-900">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {selectedStation.category.replace('_', ' ')}
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-tight">
                  {selectedStation.name}
                </h4>
                <p className="text-xs font-arabic text-slate-600 mb-2">
                  {selectedStation.arabicName}
                </p>
                <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-700 bg-slate-100 p-2 rounded-lg mb-2">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Elevation</span>
                    <span className="font-semibold">{selectedStation.elevationMeters}m</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Microclimate</span>
                    <span className="font-semibold">{selectedStation.typicalCondition}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onSelectCoordinates(selectedStation.lat, selectedStation.lng);
                    setSelectedStation(null);
                  }}
                  className="w-full text-xs font-semibold py-1.5 px-3 bg-gradient-to-r from-teal-700 to-emerald-700 text-white rounded-lg hover:from-teal-800 hover:to-emerald-800 transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Crosshair className="w-3 h-3" />
                  Inspect Weather Here
                </button>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>

      {/* Floating Map Overlays & Toolbars */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 max-w-[280px]">
        {/* Live GPS Status Indicator */}
        <div className="bg-slate-950/85 backdrop-blur-md border border-slate-700/80 rounded-xl p-2.5 text-white shadow-xl">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isGpsActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="text-xs font-bold tracking-wide">
                {isGpsActive ? 'Live Location' : 'Oman Map Focus'}
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {userCoords.lat.toFixed(3)}°N, {userCoords.lng.toFixed(3)}°E
            </span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1 truncate">
            Near <strong className="text-emerald-400">{regionName}</strong>
          </p>
        </div>
      </div>

      {/* Map Control Buttons: Recenter, Layers, Stations */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {/* Recenter button */}
        <button
          onClick={handleRecenterClick}
          title="Recenter on current coordinates"
          className="p-2.5 rounded-xl bg-slate-950/85 hover:bg-slate-900 border border-slate-700 text-emerald-400 hover:text-emerald-300 shadow-xl backdrop-blur-md transition-all active:scale-95"
        >
          <Navigation className="w-5 h-5" />
        </button>

        {/* Map Type Switcher */}
        <div className="flex flex-col bg-slate-950/85 backdrop-blur-md border border-slate-700 rounded-xl p-1 shadow-xl text-xs">
          <button
            onClick={() => setMapTypeId('roadmap')}
            className={`px-2.5 py-1.5 rounded-lg text-left font-medium transition-colors ${
              mapTypeId === 'roadmap'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Vector
          </button>
          <button
            onClick={() => setMapTypeId('satellite')}
            className={`px-2.5 py-1.5 rounded-lg text-left font-medium transition-colors ${
              mapTypeId === 'satellite'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setMapTypeId('terrain')}
            className={`px-2.5 py-1.5 rounded-lg text-left font-medium transition-colors ${
              mapTypeId === 'terrain'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Terrain
          </button>
        </div>

        {/* Weather Stations Overlay Toggle */}
        <button
          onClick={() => setShowStations((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border backdrop-blur-md shadow-xl text-xs font-semibold transition-all ${
            showStations
              ? 'bg-teal-600/90 border-teal-400 text-white'
              : 'bg-slate-950/85 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
          title="Toggle weather stations and points of interest"
        >
          <Layers className="w-3.5 h-3.5" />
          Stations ({OMAN_WEATHER_STATIONS.length})
        </button>
      </div>

      {/* Map Hint Footer */}
      <div className="absolute bottom-3 left-4 right-4 z-10 pointer-events-none flex justify-center">
        <div className="bg-slate-950/75 backdrop-blur-md border border-slate-800 rounded-full px-3.5 py-1 text-[11px] text-slate-300 flex items-center gap-1.5 shadow-lg">
          <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Click anywhere on Oman to inspect live weather at that exact location</span>
        </div>
      </div>
    </div>
  );
};
