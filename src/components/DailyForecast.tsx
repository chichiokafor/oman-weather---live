import React from 'react';
import { DailyForecastItem } from '../types/weather';
import { Calendar, Sun, Cloud, CloudRain, Sunrise, Sunset, Wind } from 'lucide-react';

interface DailyForecastProps {
  daily: DailyForecastItem[];
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ daily }) => {
  if (!daily || daily.length === 0) {
    return null;
  }

  // Calculate min and max across all days for proportional range bars
  const overallMin = Math.min(...daily.map((d) => d.tempMin));
  const overallMax = Math.max(...daily.map((d) => d.tempMax));
  const rangeSpan = Math.max(1, overallMax - overallMin);

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 text-white shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold tracking-wide uppercase text-slate-200">
            7-Day Extended Outlook
          </h3>
        </div>
        <span className="text-xs text-slate-400">Sultanate Climate Forecast</span>
      </div>

      <div className="flex flex-col divide-y divide-slate-800/80">
        {daily.map((day, idx) => {
          // Calculate bar offsets
          const leftPercent = ((day.tempMin - overallMin) / rangeSpan) * 100;
          const widthPercent = ((day.tempMax - day.tempMin) / rangeSpan) * 100;

          return (
            <div
              key={idx}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs group hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
            >
              {/* Day & Condition */}
              <div className="flex items-center gap-3 w-40 shrink-0">
                <div className="w-6 flex justify-center">
                  {day.precipitationProb > 30 ? (
                    <CloudRain className="w-5 h-5 text-sky-400" />
                  ) : day.conditionCode.includes('CLEAR') || day.conditionCode.includes('SUN') ? (
                    <Sun className="w-5 h-5 text-amber-400" />
                  ) : (
                    <Cloud className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div>
                  <span className="font-bold text-slate-200 block text-sm">
                    {day.dayLabel}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {day.conditionText}
                  </span>
                </div>
              </div>

              {/* Rain chance */}
              <div className="w-16 shrink-0 text-slate-400 text-[11px] flex items-center gap-1">
                {day.precipitationProb > 0 ? (
                  <span className="text-sky-300 font-semibold">{day.precipitationProb}% rain</span>
                ) : (
                  <span className="text-slate-500">0% rain</span>
                )}
              </div>

              {/* Temperature Bar */}
              <div className="flex-1 flex items-center gap-3">
                <span className="w-8 text-right font-medium text-slate-400">
                  {day.tempMin}°
                </span>

                <div className="flex-1 h-2 bg-slate-800 rounded-full relative overflow-hidden">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400"
                    style={{
                      left: `${Math.max(0, leftPercent)}%`,
                      width: `${Math.max(10, widthPercent)}%`,
                    }}
                  />
                </div>

                <span className="w-8 font-bold text-white">
                  {day.tempMax}°
                </span>
              </div>

              {/* Sunrise / Sunset if available */}
              {day.sunrise && day.sunset && (
                <div className="hidden md:flex items-center gap-3 text-[11px] text-slate-400 shrink-0 pl-2">
                  <span className="flex items-center gap-1">
                    <Sunrise className="w-3.5 h-3.5 text-amber-300" />
                    {new Date(day.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Sunset className="w-3.5 h-3.5 text-orange-400" />
                    {new Date(day.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
