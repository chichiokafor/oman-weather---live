import React, { useState, useEffect, useMemo } from 'react';
import { LocationCoords } from '../types/weather';
import {
  calculateQiblaBearing,
  calculateDistanceToMecca,
  calculateOmanPrayerTimes,
  PrayerTime,
} from '../services/qiblaService';
import {
  Compass,
  MapPin,
  Clock,
  Sparkles,
  RotateCw,
  CheckCircle2,
  Volume2,
  Calendar,
} from 'lucide-react';

interface QiblaCompassProps {
  coords: LocationCoords;
  regionName: string;
}

export const QiblaCompass: React.FC<QiblaCompassProps> = ({ coords, regionName }) => {
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [isSensorActive, setIsSensorActive] = useState<boolean>(false);
  const [manualHeading, setManualHeading] = useState<number>(0);

  // Qibla calculation
  const qiblaBearing = useMemo(() => calculateQiblaBearing(coords.lat, coords.lng), [coords.lat, coords.lng]);
  const distanceMecca = useMemo(() => calculateDistanceToMecca(coords.lat, coords.lng), [coords.lat, coords.lng]);

  // Prayer times
  const { prayers, nextPrayer, timeUntilNext } = useMemo(
    () => calculateOmanPrayerTimes(coords.lat, coords.lng),
    [coords.lat, coords.lng]
  );

  // Attempt device orientation for live compass
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      let heading = null;
      if ('webkitCompassHeading' in e) {
        // iOS Safari
        heading = (e as any).webkitCompassHeading;
      } else if (e.alpha !== null) {
        // Standard Android / Chrome
        heading = 360 - e.alpha;
      }

      if (heading !== null && !isNaN(heading)) {
        setDeviceHeading(Math.round(heading));
        setIsSensorActive(true);
      }
    };

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, []);

  // Request motion/orientation permission on modern iOS Safari
  const requestCompassPermission = () => {
    if (
      typeof window !== 'undefined' &&
      typeof (DeviceOrientationEvent as any)?.requestPermission === 'function'
    ) {
      (DeviceOrientationEvent as any)
        .requestPermission()
        .then((response: string) => {
          if (response === 'granted') {
            setIsSensorActive(true);
          }
        })
        .catch(console.error);
    }
  };

  const effectiveHeading = isSensorActive ? deviceHeading : manualHeading;
  // Rotation needed so Qibla aligns to top when pointing toward it
  const dialRotation = (360 - effectiveHeading) % 360;

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 md:p-7 text-white shadow-2xl flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Compass className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Sultanate Qibla &amp; Prayer Times
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-3">
            قبلة الصلاة وأوقات الأذان
            <span className="text-sm font-semibold text-slate-300 font-sans">
              ({regionName}, Oman)
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Exact astronomical Qibla azimuth ({qiblaBearing}°) and localized solar prayer times for your coordinates in Oman
          </p>
        </div>

        {/* Next prayer countdown badge */}
        {nextPrayer && (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <span className="text-[10px] text-emerald-400 block uppercase font-bold tracking-wider">
                Next: {nextPrayer.name} ({nextPrayer.arabicName})
              </span>
              <span className="text-sm font-black text-white">
                in {timeUntilNext} <span className="text-xs font-normal text-emerald-300">({nextPrayer.time})</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Compass Dial + Prayer Times */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Interactive Qibla Compass Dial */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            {/* Outer ambient glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500/10 via-teal-500/20 to-amber-500/10 blur-xl pointer-events-none" />

            {/* Fixed Outer Degree Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-slate-700/80 bg-slate-950/80 shadow-2xl flex items-center justify-center">
              {/* Cardinal labels */}
              <span className="absolute top-2 text-xs font-black text-rose-400">N (0°)</span>
              <span className="absolute right-3 text-xs font-black text-slate-400">E (90°)</span>
              <span className="absolute bottom-2 text-xs font-black text-slate-400">S (180°)</span>
              <span className="absolute left-3 text-xs font-black text-slate-400">W (270°)</span>

              {/* Tick marks */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full h-full pointer-events-none flex justify-center"
                  style={{ transform: `rotate(${i * 30}deg)` }}
                >
                  <div className="w-0.5 h-2 bg-slate-700 mt-1" />
                </div>
              ))}
            </div>

            {/* Rotating Dial Container */}
            <div
              className="relative w-48 h-48 sm:w-52 sm:h-52 rounded-full border border-emerald-500/40 bg-slate-900/90 flex items-center justify-center shadow-inner transition-transform duration-300 ease-out"
              style={{ transform: `rotate(${dialRotation}deg)` }}
            >
              {/* Qibla Direction Indicator Pointer (Angle = qiblaBearing) */}
              <div
                className="absolute w-full h-full pointer-events-none flex justify-center items-start"
                style={{ transform: `rotate(${qiblaBearing}deg)` }}
              >
                <div className="relative flex flex-col items-center -top-4">
                  {/* Kaaba Marker Pin */}
                  <div className="px-2 py-1 rounded-md bg-amber-400 text-slate-950 font-black text-[10px] shadow-lg flex items-center gap-1 border border-amber-300 animate-pulse">
                    <span>🕋 Qibla</span>
                  </div>
                  <div className="w-0 h-0 border-x-4 border-x-transparent border-t-6 border-t-amber-400" />
                </div>
              </div>

              {/* True North Pointer on rotating dial */}
              <div className="absolute w-full h-full pointer-events-none flex justify-center items-start">
                <div className="w-1 h-5 bg-rose-500 rounded-full mt-2" />
              </div>

              {/* Center Hub */}
              <div className="w-20 h-20 rounded-full bg-slate-950 border-2 border-emerald-400 flex flex-col items-center justify-center text-center shadow-2xl z-10">
                <span className="text-[10px] font-bold text-emerald-400">Qibla</span>
                <span className="text-base font-black text-white">{qiblaBearing}°</span>
                <span className="text-[9px] text-slate-400">WSW</span>
              </div>
            </div>
          </div>

          {/* Compass Status & Calibration info */}
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-300">
              <span className="font-semibold text-emerald-300">
                Bearing: {qiblaBearing}° from North
              </span>
              <span className="text-slate-600">•</span>
              <span>{distanceMecca.toLocaleString()} km to Holy Kaaba</span>
            </div>

            {/* Mobile sensor permission or manual rotate slider */}
            <div className="mt-2 flex flex-col items-center gap-2">
              {isSensorActive ? (
                <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" /> Live Gyroscope Compass Active ({deviceHeading}°)
                </span>
              ) : (
                <div className="flex flex-col items-center gap-1 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={requestCompassPermission}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
                    >
                      Enable Phone Gyroscope
                    </button>
                    <span>or align North manually:</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px]">Heading: {manualHeading}°</span>
                    <input
                      type="range"
                      min="0"
                      max="359"
                      value={manualHeading}
                      onChange={(e) => setManualHeading(Number(e.target.value))}
                      className="w-32 accent-emerald-400"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Oman Prayer Times Schedule */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              Today's Prayer Schedule in {regionName}
            </h3>
            <span className="text-xs text-slate-400">Gulf Standard Time (GST / UTC+4)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {prayers.map((prayer) => (
              <div
                key={prayer.name}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                  prayer.isNext
                    ? 'bg-gradient-to-br from-emerald-950/80 to-slate-900 border-emerald-400 shadow-xl ring-2 ring-emerald-500/30'
                    : prayer.isPast
                    ? 'bg-slate-950/50 border-slate-800/80 text-slate-400 opacity-80'
                    : 'bg-slate-950/80 border-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {prayer.name}
                  </span>
                  <span className="text-xs font-arabic text-amber-300">
                    {prayer.arabicName}
                  </span>
                </div>

                <div className="mt-2">
                  <div className="text-lg font-black text-white">{prayer.time}</div>
                  <div className="text-[10px] mt-0.5">
                    {prayer.isNext ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Upcoming ({timeUntilNext})
                      </span>
                    ) : prayer.isPast ? (
                      <span className="text-slate-500">Passed</span>
                    ) : (
                      <span className="text-slate-400">Scheduled</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Omani Heritage Wisdom regarding Prayer & Astronomy */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-3 mt-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Traditional Falaj Sundial &amp; Solar Precision</p>
              <p className="text-slate-400 mt-0.5 text-[11px] leading-relaxed">
                In historical Oman (such as the UNESCO-listed Falaj water systems of Nizwa and Rustaq), sundials and star observations determined both prayer times and fair agricultural water distribution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
