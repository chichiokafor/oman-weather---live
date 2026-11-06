import React from 'react';
import { OmanRegion } from '../types/weather';
import { OMAN_REGIONS } from '../data/omanData';
import { MapPin, Navigation, Radio, Sparkles } from 'lucide-react';

interface OmanPresetSelectorProps {
  currentRegionId: string;
  isGpsActive: boolean;
  isWatchingGps: boolean;
  isLoadingLocation: boolean;
  isInsideOman: boolean;
  onSelectRegion: (region: OmanRegion) => void;
  onRequestGps: () => void;
  onToggleWatchGps: () => void;
}

export const OmanPresetSelector: React.FC<OmanPresetSelectorProps> = ({
  currentRegionId,
  isGpsActive,
  isWatchingGps,
  isLoadingLocation,
  isInsideOman,
  onSelectRegion,
  onRequestGps,
  onToggleWatchGps,
}) => {
  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 md:p-5 text-white shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold tracking-wide uppercase text-slate-200 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            Explore Oman Regions &amp; Governorates
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Switch instant weather view across the Sultanate or view your current location
          </p>
        </div>

        {/* Location Control Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onRequestGps}
            disabled={isLoadingLocation}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isGpsActive
                ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-200'
            }`}
          >
            <Navigation className={`w-3.5 h-3.5 ${isLoadingLocation ? 'animate-spin' : ''}`} />
            <span>{isLoadingLocation ? 'Locating...' : 'Use My Location'}</span>
          </button>

          <button
            onClick={onToggleWatchGps}
            title="Toggle continuous live tracking"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isWatchingGps
                ? 'bg-teal-600 border-teal-400 text-white animate-pulse'
                : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{isWatchingGps ? 'Tracking Active' : 'Live Watch'}</span>
          </button>
        </div>
      </div>

      {!isInsideOman && isGpsActive && (
        <div className="mb-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>
              Your current position is outside the Sultanate of Oman. Showing nearest Oman climate stations.
            </span>
          </div>
          <button
            onClick={() => onSelectRegion(OMAN_REGIONS[0])}
            className="text-[11px] font-bold text-amber-300 underline hover:text-white shrink-0"
          >
            Focus Muscat
          </button>
        </div>
      )}

      {/* Region Buttons Carousel/Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
        {OMAN_REGIONS.map((region) => {
          const isSelected = !isGpsActive && currentRegionId === region.id;

          return (
            <button
              key={region.id}
              onClick={() => onSelectRegion(region)}
              className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between group ${
                isSelected
                  ? 'bg-gradient-to-b from-emerald-900/60 to-slate-900 border-emerald-400 shadow-md'
                  : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700/60 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-emerald-400">
                  {region.climateType}
                </span>
                {region.isCapital && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Capital" />
                )}
              </div>
              <div className="mt-1">
                <div className="text-xs font-bold text-white group-hover:text-emerald-300">
                  {region.name}
                </div>
                <div className="text-[11px] font-arabic text-slate-400">
                  {region.arabicName}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
