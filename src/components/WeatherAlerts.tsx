import React from 'react';
import { CurrentWeather } from '../types/weather';
import { ShieldAlert, Sun, Wind, CloudRain, Waves, Info } from 'lucide-react';

interface WeatherAlertsProps {
  weather: CurrentWeather;
  regionName: string;
}

export const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ weather, regionName }) => {
  const alerts: Array<{
    id: string;
    type: 'warning' | 'info' | 'success';
    title: string;
    desc: string;
    icon: React.ReactNode;
  }> = [];

  // UV Alert
  if (weather.uvIndex >= 8) {
    alerts.push({
      id: 'uv-extreme',
      type: 'warning',
      title: 'High UV Radiation Warning',
      desc: 'Peak solar intensity in Oman. Apply SPF 50+, wear protective sunglasses, and avoid prolonged midday sun exposure between 11:00 AM and 3:30 PM.',
      icon: <Sun className="w-4 h-4 text-amber-400" />,
    });
  }

  // High Heat Alert
  if (weather.temperature >= 38) {
    alerts.push({
      id: 'heat-advisory',
      type: 'warning',
      title: 'Desert Heat Advisory',
      desc: 'High ambient temperature recorded. Ensure adequate water intake, avoid strenuous outdoor activities in unshaded valleys, and keep vehicles hydrated.',
      icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
    });
  }

  // Wind / Marine Alert
  if (weather.windSpeed >= 25 || (weather.windGust && weather.windGust >= 35)) {
    alerts.push({
      id: 'wind-marine',
      type: 'warning',
      title: 'Active Coastal / Shamal Winds',
      desc: `Wind gusts up to ${weather.windGust || weather.windSpeed} km/h. Sea conditions along Gulf of Oman / Arabian Sea may experience moderate to rough swell. Small boats should exercise caution.`,
      icon: <Waves className="w-4 h-4 text-teal-400" />,
    });
  }

  // Rain / Wadi Flood Caution
  if (weather.precipitationProb > 25 || weather.conditionCode.includes('RAIN')) {
    alerts.push({
      id: 'wadi-precaution',
      type: 'warning',
      title: 'Wadi Flash Flood Precaution',
      desc: 'Rainfall or high precipitation probability detected. Never attempt to cross flowing wadis or park vehicles in low-lying riverbeds in Al Hajar and interior Oman.',
      icon: <CloudRain className="w-4 h-4 text-sky-400" />,
    });
  }

  // Default favorable weather info
  if (alerts.length === 0) {
    alerts.push({
      id: 'favorable-weather',
      type: 'success',
      title: 'Favorable Outdoor Conditions',
      desc: `Current meteorological telemetry in ${regionName} indicates clear skies with mild to moderate conditions ideal for sightseeing, coastal strolls, and desert travel.`,
      icon: <Info className="w-4 h-4 text-emerald-400" />,
    });
  }

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 md:p-5 text-white shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold tracking-wide uppercase text-slate-200 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          Oman Meteorological &amp; Safety Advisories
        </h3>
        <span className="text-[11px] text-slate-400">Civil Aviation / Met Authority Standards</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
              alert.type === 'warning'
                ? 'bg-amber-950/20 border-amber-500/40 text-amber-100'
                : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-100'
            }`}
          >
            <div className="p-2 rounded-lg bg-slate-800/80 shrink-0 mt-0.5">
              {alert.icon}
            </div>
            <div>
              <h4 className="text-xs font-bold text-white mb-0.5">{alert.title}</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">{alert.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
