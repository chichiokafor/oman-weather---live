import React from 'react';
import { HourlyForecastItem } from '../types/weather';
import { Sun, Cloud, CloudRain, Droplets, Wind, Clock } from 'lucide-react';

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly }) => {
  if (!hourly || hourly.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 text-white shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold tracking-wide uppercase text-slate-200">
            24-Hour Forecast
          </h3>
        </div>
        <span className="text-xs text-slate-400">Scroll to view upcoming hours</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {hourly.map((item, idx) => (
          <div
            key={idx}
            className={`shrink-0 flex flex-col items-center justify-between p-3.5 rounded-xl border min-w-[90px] transition-all hover:border-emerald-500/50 ${
              idx === 0
                ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg'
                : 'bg-slate-800/60 border-slate-700/60'
            }`}
          >
            <span className="text-xs font-semibold text-slate-300">
              {idx === 0 ? 'Now' : item.hourLabel}
            </span>

            <div className="my-2 flex flex-col items-center">
              {item.iconUri ? (
                <img
                  src={item.iconUri}
                  alt={item.conditionText}
                  className="w-8 h-8 object-contain"
                />
              ) : item.precipitationProb > 30 ? (
                <CloudRain className="w-7 h-7 text-sky-400" />
              ) : item.isDaytime ? (
                <Sun className="w-7 h-7 text-amber-400" />
              ) : (
                <Cloud className="w-7 h-7 text-slate-400" />
              )}
            </div>

            <span className="text-base font-extrabold text-white">
              {item.temperature}°
            </span>

            <span className="text-[11px] text-slate-400 text-center line-clamp-1 mt-0.5">
              {item.conditionText}
            </span>

            {/* Precipitation indicator */}
            <div className="flex items-center gap-1 mt-2 text-[10px] text-sky-300 font-medium">
              <Droplets className="w-2.5 h-2.5" />
              <span>{item.precipitationProb}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
