import React, { useState, useMemo } from 'react';
import { CurrentWeather, LocationCoords } from '../types/weather';
import {
  calculateMoonPhase,
  calculateStargazingQuality,
  getCurrentPlanetaryPlacements,
  getDailyCosmicAspects,
  getRetrogradePlanets,
  getAstrologicalHouses,
  OMAN_VISIBLE_PLANETS,
  SUHAIL_STAR_LORE,
  ZODIAC_SIGNS,
  ZodiacPrediction,
  AstrologicalHouse,
  PlanetaryPlacement,
} from '../services/astrologyService';
import {
  Moon,
  Sparkles,
  Telescope,
  Globe,
  Star,
  Activity,
  Compass,
  RotateCcw,
  Building,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  ChevronRight,
  Sun,
  ShieldAlert,
} from 'lucide-react';

interface AstrologyCelestialProps {
  weather: CurrentWeather | null;
  coords: LocationCoords;
  regionName: string;
}

type AstroSubTab = 'placements' | 'daily_aspects' | 'retrogrades' | 'houses' | 'horoscopes' | 'moon_stargazing';

export const AstrologyCelestial: React.FC<AstrologyCelestialProps> = ({
  weather,
  coords,
  regionName,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<AstroSubTab>('placements');
  const [selectedZodiac, setSelectedZodiac] = useState<ZodiacPrediction>(ZODIAC_SIGNS[0]);
  const [selectedHouseNumber, setSelectedHouseNumber] = useState<number>(1);

  // Retrieve comprehensive astrology data
  const placements = useMemo(() => getCurrentPlanetaryPlacements(), []);
  const dailyAspects = useMemo(() => getDailyCosmicAspects(), []);
  const retrogrades = useMemo(() => getRetrogradePlanets(), []);
  const houses = useMemo(() => getAstrologicalHouses(), []);
  const moonPhase = useMemo(() => calculateMoonPhase(), []);

  const stargazing = useMemo(() => {
    const cloudCover = weather?.cloudCover ?? 10;
    const visibility = weather?.visibility ?? 15;
    const humidity = weather?.humidity ?? 45;
    return calculateStargazingQuality(cloudCover, visibility, humidity, moonPhase.illumination);
  }, [weather, moonPhase.illumination]);

  const selectedHouse = useMemo(
    () => houses.find((h) => h.number === selectedHouseNumber) || houses[0],
    [houses, selectedHouseNumber]
  );

  const activeRetrogradesCount = useMemo(
    () => retrogrades.filter((r) => r.isRetrograde).length,
    [retrogrades]
  );

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 md:p-7 text-white shadow-2xl flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Comprehensive Arabian Astrology &amp; Celestial Ephemeris
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-3">
            علم الفلك ومواقع الكواكب في عمان
            <span className="text-sm font-semibold text-slate-300 font-sans">
              (Celestial Sky: {regionName})
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time planetary placements, active retrogrades, 12-house transits, and daily cosmic aspects
          </p>
        </div>

        {/* Quick telemetry badge */}
        <div className="flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 text-xs">
          <div className="flex flex-col">
            <span className="text-[10px] text-indigo-300 font-bold uppercase">Sun &amp; Moon Axis</span>
            <span className="font-black text-white">☉ 14° Scorpio • ☽ 22° Libra</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex flex-col">
            <span className="text-[10px] text-amber-400 font-bold uppercase">Retrogrades</span>
            <span className="font-black text-amber-300">{activeRetrogradesCount} Active</span>
          </div>
        </div>
      </div>

      {/* Internal Sub-Navigation Tabs */}
      <div className="flex gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto shadow-inner text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('placements')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
            activeSubTab === 'placements'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Planetary Placements</span>
        </button>

        <button
          onClick={() => setActiveSubTab('daily_aspects')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
            activeSubTab === 'daily_aspects'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>What's Happening Today (Transits)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('retrogrades')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
            activeSubTab === 'retrogrades'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span>Retrograde Radar ({activeRetrogradesCount})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('houses')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
            activeSubTab === 'houses'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Building className="w-3.5 h-3.5 text-teal-400" />
          <span>The 12 Houses (Life Spheres)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('horoscopes')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
            activeSubTab === 'horoscopes'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Star className="w-3.5 h-3.5 text-amber-400" />
          <span>Zodiac Horoscopes</span>
        </button>

        <button
          onClick={() => setActiveSubTab('moon_stargazing')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
            activeSubTab === 'moon_stargazing'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Moon className="w-3.5 h-3.5 text-cyan-300" />
          <span>Moon &amp; Stargazing</span>
        </button>
      </div>

      {/* SUB-TAB 1: PLANETARY PLACEMENTS */}
      {activeSubTab === 'placements' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400" />
              Live Geocentric Planetary Coordinates Today
            </h3>
            <span className="text-xs text-slate-400">Precise degrees, signs &amp; ruling houses</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {placements.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-amber-300 border border-slate-800">
                        {p.symbol}
                      </span>
                      <div>
                        <span className="text-sm font-bold text-white leading-tight block">
                          {p.name}
                        </span>
                        <span className="text-[11px] font-arabic text-amber-200">
                          {p.arabicName}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        p.motion === 'Retrograde'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : p.motion === 'Stationary'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {p.motion}
                    </span>
                  </div>

                  <div className="my-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Zodiac Sign</span>
                      <span className="font-bold text-emerald-400">{p.sign} ({p.arabicSign})</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px]">Position</span>
                      <span className="font-mono font-bold text-white">{p.degree}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px]">House</span>
                      <span className="font-bold text-cyan-300">House {p.house}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {p.interpretation}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Element: <strong className="text-slate-200">{p.element}</strong></span>
                  <span>Modality: <strong className="text-slate-200">{p.modality}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: WHAT IS HAPPENING TODAY (DAILY TRANSITS) */}
      {activeSubTab === 'daily_aspects' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              What is Happening Today: Cosmic Transits &amp; Aspects
            </h3>
            <span className="text-xs text-slate-400">Gulf Celestial Energy Timeline</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dailyAspects.map((aspect) => (
              <div
                key={aspect.id}
                className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        aspect.energyLevel === 'Harmonious' || aspect.energyLevel === 'Empowering'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {aspect.energyLevel}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      {aspect.timeWindow}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 my-2">
                    <span className="text-lg font-black text-amber-400 w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                      {aspect.symbol}
                    </span>
                    <div>
                      <h4 className="text-base font-bold text-white">
                        {aspect.planets[0]} {aspect.aspectType} {aspect.planets[1]}
                      </h4>
                      <span className="text-xs text-slate-400 font-mono">
                        Orb: {aspect.angleDegrees}° ({aspect.aspectType})
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed my-2">
                    {aspect.description}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-emerald-300 mt-2 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white block text-[11px]">Daily Guidance:</strong>
                    {aspect.practicalAdvice}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: RETROGRADE RADAR */}
      {activeSubTab === 'retrogrades' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-400" />
                Active Planetary Retrogrades &amp; Shadow Phases
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Monitor retrogrades affecting travel, technology, and communication in Oman
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {activeRetrogradesCount} In Retrograde Motion
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {retrogrades.map((ret) => (
              <div
                key={ret.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  ret.isRetrograde
                    ? 'bg-amber-950/20 border-amber-500/40 shadow-xl'
                    : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-amber-300 border border-slate-800">
                        {ret.symbol}
                      </span>
                      <div>
                        <span className="text-sm font-bold text-white block">{ret.name}</span>
                        <span className="text-[11px] font-arabic text-amber-200">{ret.arabicName}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        ret.isRetrograde
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {ret.status}
                    </span>
                  </div>

                  <div className="my-2 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                    <div className="text-[11px] text-slate-400">Cycle Range</div>
                    <div className="font-semibold text-white">{ret.dateRange}</div>
                    <div className="text-[10px] text-amber-300 mt-0.5 font-mono">
                      {ret.daysRemainingOrNext}
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1 my-2">
                    <div>
                      <span className="text-slate-400 text-[11px]">Impact Area:</span>{' '}
                      <strong className="text-white">{ret.impactArea}</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 leading-relaxed">
                  <strong className="text-amber-300 block text-[10px] uppercase font-bold">
                    Oman Travel Guidance:
                  </strong>
                  {ret.guidance}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: THE 12 HOUSES (WHAT IS HAPPENING IN EACH HOUSE) */}
      {activeSubTab === 'houses' && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Building className="w-4 h-4 text-teal-400" />
                What is Happening in the 12 Astrological Houses Today
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Select any of the twelve sectors of life to inspect active planetary transits and themes
              </p>
            </div>
            <span className="text-xs text-slate-400">Whole Sign &amp; Placidus System</span>
          </div>

          {/* 12 House Selector Buttons */}
          <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-1.5">
            {houses.map((h) => {
              const isSelected = selectedHouseNumber === h.number;
              const hasActivePlanets = h.currentTransitingPlanets.length > 0;

              return (
                <button
                  key={h.number}
                  onClick={() => setSelectedHouseNumber(h.number)}
                  className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-between ${
                    isSelected
                      ? 'bg-gradient-to-b from-teal-600 to-emerald-700 border-teal-400 text-white shadow-lg'
                      : 'bg-slate-950/70 hover:bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <span className="text-xs font-black">H{h.number}</span>
                  <span className="text-[10px] truncate max-w-full">
                    {h.traditionalName.split('/')[0]}
                  </span>
                  {hasActivePlanets && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Detailed Selected House Card */}
          {selectedHouse && (
            <div className="p-5 md:p-7 rounded-3xl bg-slate-950/80 border border-teal-500/40 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
                      House {selectedHouse.number}
                    </span>
                    <span className="text-xs text-slate-400">({selectedHouse.traditionalName})</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mt-1">
                    {selectedHouse.title}
                  </h3>
                  <p className="text-sm font-arabic text-amber-300 mt-0.5">
                    {selectedHouse.arabicTitle}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Natural Ruler</span>
                  <span className="text-sm font-bold text-emerald-400">{selectedHouse.signRuler}</span>
                </div>
              </div>

              {/* Transiting Planets in this House */}
              <div className="my-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Active Transiting Planets in this House Today:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedHouse.currentTransitingPlanets.map((tp, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      {tp}
                    </span>
                  ))}
                </div>
              </div>

              {/* What is happening today */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 my-3">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  What is Happening Today:
                </span>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {selectedHouse.whatIsHappeningToday}
                </p>
              </div>

              {/* Life Sphere Actionable Guidance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block text-[11px] mb-1 font-semibold">
                    Core Life Themes:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedHouse.governingThemes.map((theme, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px]"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-emerald-400 block text-[11px] mb-1 font-semibold">
                    Practical Recommendation:
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {selectedHouse.focusAdvice}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 5: ZODIAC DAILY HOROSCOPES */}
      {activeSubTab === 'horoscopes' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              Daily Horoscope &amp; House Activations for Your Sign
            </h3>
            <span className="text-xs text-slate-400">12 Zodiac Signs</span>
          </div>

          {/* Signs Carousel */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
            {ZODIAC_SIGNS.map((z) => {
              const isSelected = selectedZodiac.sign === z.sign;
              return (
                <button
                  key={z.sign}
                  onClick={() => setSelectedZodiac(z)}
                  className={`p-3 rounded-2xl border text-center min-w-[90px] shrink-0 transition-all flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-gradient-to-b from-indigo-900/80 to-slate-900 border-indigo-400 shadow-xl ring-2 ring-indigo-500/30'
                      : 'bg-slate-950/60 hover:bg-slate-800 border-slate-800 text-slate-300'
                  }`}
                >
                  <span className="text-xl mb-1">{z.symbol}</span>
                  <span className="text-xs font-bold text-white">{z.sign}</span>
                  <span className="text-[10px] font-arabic text-amber-300">{z.arabicSign}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Sign Detailed Card */}
          {selectedZodiac && (
            <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-br from-indigo-950/30 via-slate-950 to-slate-900 border border-indigo-500/40 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2.5 rounded-2xl bg-indigo-500/20 border border-indigo-500/30">
                    {selectedZodiac.symbol}
                  </span>
                  <div>
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      {selectedZodiac.sign}
                      <span className="text-amber-300 font-arabic text-base">
                        {selectedZodiac.arabicSign}
                      </span>
                    </h4>
                    <span className="text-xs text-slate-400">
                      {selectedZodiac.dates} • Element: {selectedZodiac.element} • Active in House {selectedZodiac.activeHouseToday}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                    Mood: {selectedZodiac.cosmicMood}
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed mb-4">
                {selectedZodiac.dailyPrediction}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px]">Lucky Color</span>
                  <span className="font-bold text-amber-300">{selectedZodiac.luckyColor}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Lucky Number</span>
                  <span className="font-bold text-white">{selectedZodiac.luckyNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Active House Today</span>
                  <span className="font-bold text-cyan-300">House {selectedZodiac.activeHouseToday}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Desert Energy</span>
                  <span className="font-bold text-emerald-400">Harmonious Flow</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 6: MOON PHASE & DESERT STARGAZING */}
      {activeSubTab === 'moon_stargazing' && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Moon Phase Card */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-amber-300" />
                  Lunar Phase &amp; Hijri Moon
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 font-mono">
                  Day ~{moonPhase.hijriDayApprox}
                </span>
              </div>

              <div className="flex items-center gap-4 my-2">
                <div className="relative w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden shadow-[0_0_15px_rgba(251,191,36,0.2)] flex items-center justify-center shrink-0">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-amber-200 to-amber-100 rounded-full"
                    style={{
                      clipPath: moonPhase.isWaxing
                        ? `polygon(0 0, ${moonPhase.illumination}% 0, ${moonPhase.illumination}% 100%, 0 100%)`
                        : `polygon(${100 - moonPhase.illumination}% 0, 100% 0, 100% 100%, ${100 - moonPhase.illumination}% 100%)`,
                    }}
                  />
                  <span className="relative z-10 text-[10px] font-black text-slate-900 mix-blend-difference">
                    {moonPhase.illumination}%
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white">{moonPhase.phaseName}</h4>
                  <p className="text-xs font-arabic text-amber-300">{moonPhase.arabicName}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Illumination: <strong className="text-white">{moonPhase.illumination}%</strong>
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-3 border-t border-slate-800/80 pt-2 leading-relaxed">
                {moonPhase.stargazingImpact}
              </p>
            </div>

            {/* 2. Stargazing Index */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Telescope className="w-4 h-4 text-indigo-400" />
                  Desert Stargazing Index
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">
                  Bortle 1–2
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{stargazing.ratingScore}</span>
                  <span className="text-sm font-semibold text-emerald-400">/ 100</span>
                  <span className="text-xs text-slate-400">({stargazing.qualityLabel})</span>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-teal-400 via-indigo-400 to-emerald-400 h-full rounded-full"
                    style={{ width: `${stargazing.ratingScore}%` }}
                  />
                </div>

                <div className="mt-3 text-xs text-slate-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Prime Viewing:</span>
                    <span className="font-semibold text-white">{stargazing.bestViewingWindow}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Atmosphere:</span>
                    <span className="text-emerald-300 font-medium">
                      {stargazing.cloudCoverPercent}% clouds, {stargazing.visibilityKm}km view
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-3 border-t border-slate-800/80 pt-2 leading-relaxed line-clamp-2">
                Top spot: <strong className="text-indigo-300">{stargazing.topOmanDarkSkySpot.name}</strong>
              </p>
            </div>

            {/* 3. Traditional Canopus (Suhail) Star Lore */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-950 border border-slate-800 flex flex-col justify-between shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400" />
                  Suhail (Canopus) Star Tracker
                </span>
                <span className="text-[10px] text-slate-400">نَجْم سُهَيْل</span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">{SUHAIL_STAR_LORE.name}</h4>
                <p className="text-xs text-amber-200/90 font-arabic mt-1 leading-relaxed italic">
                  "{SUHAIL_STAR_LORE.wisdomQuote}"
                </p>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {SUHAIL_STAR_LORE.culturalSignificance}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Constellation: Carina</span>
                <span className="text-amber-300 font-medium">{SUHAIL_STAR_LORE.peakElevationInOman}</span>
              </div>
            </div>
          </div>

          {/* Visible Planets in Night Sky */}
          <div className="p-4 md:p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-teal-400" />
              Planetary Alignments Visible Tonight Across Oman
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {OMAN_VISIBLE_PLANETS.map((planet, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-white block">{planet.name}</span>
                    <span className="text-[11px] text-teal-300 font-arabic">{planet.arabicName}</span>
                    <span className="text-[11px] text-amber-300 block mt-1 font-mono">{planet.magnitude}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 space-y-0.5">
                    <div>Time: <strong className="text-slate-200">{planet.viewingTime}</strong></div>
                    <div>Direction: <strong className="text-slate-200">{planet.azimuthDirection}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
