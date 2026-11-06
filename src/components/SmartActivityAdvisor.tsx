import React, { useState, useMemo } from 'react';
import { CurrentWeather, LocationCoords } from '../types/weather';
import { OMAN_ACTIVITIES, OmanActivity } from '../data/omanActivities';
import { calculateDistanceKm } from '../hooks/useUserLocation';
import {
  Compass,
  MapPin,
  Sparkles,
  Sun,
  CloudRain,
  Clock,
  ShieldCheck,
  Navigation2,
  CheckCircle2,
  Filter,
} from 'lucide-react';

interface SmartActivityAdvisorProps {
  weather: CurrentWeather | null;
  userCoords: LocationCoords;
  onSelectActivityLocation: (lat: number, lng: number) => void;
}

export const SmartActivityAdvisor: React.FC<SmartActivityAdvisorProps> = ({
  weather,
  userCoords,
  onSelectActivityLocation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortByDistance, setSortByDistance] = useState<boolean>(true);

  const categories = [
    { id: 'all', label: 'All Experiences' },
    { id: 'wadis_nature', label: 'Wadis & Nature' },
    { id: 'heritage_forts', label: 'Historic Forts' },
    { id: 'indoor_culture', label: 'Indoor & Museums' },
    { id: 'mountain_trek', label: 'Mountain Treks' },
    { id: 'coastal_marine', label: 'Coastal & Sea' },
    { id: 'desert_dunes', label: 'Desert Dunes' },
  ];

  // Evaluate suitability score for each activity based on real-time weather
  const scoredActivities = useMemo(() => {
    const temp = weather?.temperature ?? 28;
    const isRaining = (weather?.precipitationProb ?? 0) > 30 || weather?.conditionCode.includes('RAIN');

    return OMAN_ACTIVITIES.map((act) => {
      const distanceKm = Math.round(calculateDistanceKm(userCoords.lat, userCoords.lng, act.lat, act.lng));

      let score = 85;
      let reason = 'Great conditions for visiting.';
      let statusType: 'optimal' | 'good' | 'caution' = 'good';

      // Check rain constraint
      if (isRaining && act.avoidInRain) {
        score -= 50;
        reason = 'Heavy rain / flash flood caution in wadis and riverbeds.';
        statusType = 'caution';
      }
      // Check high heat constraint for outdoor treks
      else if (temp > 35 && (act.category === 'mountain_trek' || act.category === 'wadis_nature')) {
        score -= 20;
        reason = 'Peak daytime heat. Explore early morning or late afternoon with hydration.';
        statusType = 'caution';
      }
      // High heat is prime time for indoor culture
      else if (temp > 33 && act.category === 'indoor_culture') {
        score += 15;
        reason = 'Ideal escape from midday heat inside air-conditioned heritage galleries.';
        statusType = 'optimal';
      }
      // Pleasant weather is optimal for outdoor forts & wadis
      else if (temp <= 30 && temp >= 20 && (act.category === 'wadis_nature' || act.category === 'heritage_forts')) {
        score += 12;
        reason = 'Crisp, pleasant climate ideal for strolling and photography.';
        statusType = 'optimal';
      }

      return {
        ...act,
        distanceKm,
        score,
        reason,
        statusType,
      };
    });
  }, [weather, userCoords]);

  // Filter and sort activities
  const filteredActivities = useMemo(() => {
    let list = scoredActivities;
    if (selectedCategory !== 'all') {
      list = list.filter((a) => a.category === selectedCategory);
    }
    if (sortByDistance) {
      list = [...list].sort((a, b) => a.distanceKm - b.distanceKm);
    } else {
      list = [...list].sort((a, b) => b.score - a.score);
    }
    return list;
  }, [scoredActivities, selectedCategory, sortByDistance]);

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 md:p-7 text-white shadow-2xl flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Smart Weather Advisor
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            What to Experience Around You in Oman
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Intelligent recommendations scored in real-time based on your location and current weather conditions
            {weather ? ` (${weather.temperature}°C, ${weather.conditionText})` : ''}
          </p>
        </div>

        {/* Sorting Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs">
          <button
            onClick={() => setSortByDistance(true)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              sortByDistance ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Closest to Me
          </button>
          <button
            onClick={() => setSortByDistance(false)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              !sortByDistance ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Best for Weather
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-400 text-white shadow-md'
                : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 text-slate-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Activity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredActivities.map((act) => (
          <div
            key={act.id}
            className="flex flex-col justify-between p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 hover:border-emerald-500/50 transition-all hover:shadow-xl group"
          >
            <div>
              {/* Badge strip */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    act.statusType === 'optimal'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : act.statusType === 'caution'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                  }`}
                >
                  {act.statusType === 'optimal'
                    ? '★ Optimal Right Now'
                    : act.statusType === 'caution'
                    ? '⚠ Weather Caution'
                    : '✓ Recommended'}
                </span>

                <span className="text-[11px] font-mono font-semibold text-emerald-400 flex items-center gap-1">
                  <Navigation2 className="w-3 h-3 rotate-45" />
                  {act.distanceKm} km away
                </span>
              </div>

              {/* Title & Arabic */}
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                {act.title}
              </h3>
              <p className="text-xs text-amber-300 font-arabic mb-2">{act.arabicTitle}</p>

              <p className="text-xs text-slate-300 leading-relaxed mb-3 line-clamp-2">
                {act.description}
              </p>

              {/* Weather reason banner */}
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 mb-3 flex items-start gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-tight">{act.reason}</span>
              </div>

              {/* Highlights */}
              <div className="flex flex-wrap gap-1 mb-4">
                {act.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                <Clock className="w-3 h-3 text-slate-500" />
                {act.bestTimeOfDay}
              </span>

              <button
                onClick={() => onSelectActivityLocation(act.lat, act.lng)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white font-semibold transition-colors flex items-center gap-1 shadow-sm active:scale-95"
              >
                <MapPin className="w-3 h-3" />
                View on Map
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
