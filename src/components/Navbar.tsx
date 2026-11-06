import React from 'react';
import { LocationCoords } from '../types/weather';
import {
  CloudSun,
  Navigation,
  RefreshCw,
  MapPin,
  Radio,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface NavbarProps {
  coords: LocationCoords;
  regionName: string;
  isGpsActive: boolean;
  isWatchingGps: boolean;
  isLoading: boolean;
  lastUpdated: Date | null;
  onRefresh: () => void;
  onToggleWatch: () => void;
  onRequestGps: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  coords,
  regionName,
  isGpsActive,
  isWatchingGps,
  isLoading,
  lastUpdated,
  onRefresh,
  onToggleWatch,
  onRequestGps,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 text-white transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Branding & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <CloudSun className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
                Oman Weather &amp; Live Location
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                سَلْطَنَة عُمَان
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Real-Time Weather &amp; Location Intelligence across Oman
            </p>
          </div>
        </div>

        {/* Status badges & Controls */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs">
          {/* Active Location Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold text-slate-200 truncate max-w-[140px] sm:max-w-none">
              {regionName}
            </span>
            <span className="text-[10px] text-slate-400 border-l border-slate-700 pl-2 font-mono">
              {coords.lat.toFixed(2)}°N, {coords.lng.toFixed(2)}°E
            </span>
          </div>

          {/* Location Mode Status */}
          <div
            onClick={onRequestGps}
            className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-medium transition-all ${
              isGpsActive
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Click to detect your current location"
          >
            {isGpsActive ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>My Location Active</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3 h-3 text-amber-400" />
                <span>Region Selected</span>
              </>
            )}
          </div>

          {/* Refresh Action Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white transition-all active:scale-95 disabled:opacity-50"
            title="Refresh live weather & location data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
