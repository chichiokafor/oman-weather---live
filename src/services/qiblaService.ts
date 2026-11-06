/**
 * Qibla & Prayer Times Astronomical Service for Oman
 * Coordinates for Kaaba in Mecca: 21.4225° N, 39.8262° E
 */

const MECCA_LAT = 21.422487;
const MECCA_LNG = 39.826206;

/**
 * Calculates the forward azimuth (initial bearing) from any point to Mecca
 * Result is in degrees (0 - 360) clockwise from True North
 */
export function calculateQiblaBearing(lat: number, lng: number): number {
  const phi1 = (lat * Math.PI) / 180;
  const phi2 = (MECCA_LAT * Math.PI) / 180;
  const deltaLambda = ((MECCA_LNG - lng) * Math.PI) / 180;

  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);

  let qibla = (Math.atan2(y, x) * 180) / Math.PI;
  qibla = (qibla + 360) % 360;

  return Math.round(qibla * 10) / 10;
}

/**
 * Calculates great-circle distance to Mecca in kilometers
 */
export function calculateDistanceToMecca(lat: number, lng: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((MECCA_LAT - lat) * Math.PI) / 180;
  const dLon = ((MECCA_LNG - lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat * Math.PI) / 180) *
      Math.cos((MECCA_LAT * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export interface PrayerTime {
  name: string;
  arabicName: string;
  time: string; // HH:MM
  timestamp: Date;
  isNext: boolean;
  isPast: boolean;
}

/**
 * Solar calculation algorithm for Prayer Times in Oman (Gulf Standard Time UTC+4)
 * Uses standard Muslim World League / Umm al-Qura solar elevation parameters
 */
export function calculateOmanPrayerTimes(lat: number, lng: number, date: Date = new Date()): {
  prayers: PrayerTime[];
  nextPrayer: PrayerTime | null;
  timeUntilNext: string;
} {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();

  // Julian Day
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jd =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  const dDays = jd - 2451545.0;

  // Mean anomaly of the Sun
  const g = (357.529 + 0.98560028 * dDays) % 360;
  const gRad = (g * Math.PI) / 180;

  // Mean longitude of the Sun
  const q = (280.459 + 0.98564736 * dDays) % 360;

  // Geocentric apparent ecliptic longitude
  const L = (q + 1.915 * Math.sin(gRad) + 0.02 * Math.sin(2 * gRad)) % 360;
  const lRad = (L * Math.PI) / 180;

  // Mean obliquity of the ecliptic
  const e = 23.439 - 0.00000036 * dDays;
  const eRad = (e * Math.PI) / 180;

  // Sun's declination
  const sinDelta = Math.sin(eRad) * Math.sin(lRad);
  const delta = Math.asin(sinDelta);

  // Equation of time in minutes
  const yEot = Math.tan(eRad / 2) * Math.tan(eRad / 2);
  const eotRad =
    yEot * Math.sin(2 * (q * Math.PI) / 180) -
    2 * 0.0167 * Math.sin(gRad) +
    4 * 0.0167 * yEot * Math.sin(gRad) * Math.cos(2 * (q * Math.PI) / 180);
  const equationOfTime = (eotRad * 180) / Math.PI * 4; // minutes

  // Oman timezone is Gulf Standard Time (UTC+4)
  const timezoneOffset = 4;
  const solarNoonUTC = 12 - equationOfTime / 60 - lng / 15;
  const solarNoonLocal = (solarNoonUTC + timezoneOffset + 24) % 24;

  const latRad = (lat * Math.PI) / 180;

  // Hour angle helper
  const hourAngle = (elevationAngle: number): number => {
    const angleRad = (elevationAngle * Math.PI) / 180;
    const cosH = (Math.sin(angleRad) - Math.sin(latRad) * Math.sin(delta)) / (Math.cos(latRad) * Math.cos(delta));
    if (cosH > 1 || cosH < -1) return 0;
    return (Math.acos(cosH) * 180) / Math.PI / 15;
  };

  // Sun elevation angles
  const fajrAngle = -18; // 18 degrees below horizon
  const sunriseAngle = -0.833; // standard refraction + radius
  const asrRatio = 1; // Shafi/standard shadow factor
  const asrAltitude =
    (Math.atan(1 / (asrRatio + Math.tan(Math.abs(latRad - delta)))) * 180) / Math.PI;
  const maghribAngle = -0.833;
  const ishaAngle = -18;

  const fajrHA = hourAngle(fajrAngle);
  const sunriseHA = hourAngle(sunriseAngle);
  const asrHA = hourAngle(asrAltitude);
  const maghribHA = hourAngle(maghribAngle);
  const ishaHA = hourAngle(ishaAngle);

  const fajrHour = solarNoonLocal - fajrHA;
  const sunriseHour = solarNoonLocal - sunriseHA;
  const dhuhrHour = solarNoonLocal + 4 / 60; // slight offset after zenith
  const asrHour = solarNoonLocal + asrHA;
  const maghribHour = solarNoonLocal + maghribHA;
  const ishaHour = solarNoonLocal + ishaHA;

  const formatTime = (decimalHours: number): { str: string; date: Date } => {
    const h = Math.floor(decimalHours);
    const m = Math.floor((decimalHours - h) * 60);
    const prayerDate = new Date(date);
    prayerDate.setHours(h, m, 0, 0);

    const padH = String(h % 12 || 12).padStart(2, '0');
    const padM = String(m).padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    return { str: `${padH}:${padM} ${ampm}`, date: prayerDate };
  };

  const rawList = [
    { name: 'Fajr', arabicName: 'الفَجْر', ...formatTime(fajrHour) },
    { name: 'Sunrise', arabicName: 'الشُّرُوق', ...formatTime(sunriseHour) },
    { name: 'Dhuhr', arabicName: 'الظُّهْر', ...formatTime(dhuhrHour) },
    { name: 'Asr', arabicName: 'العَصْر', ...formatTime(asrHour) },
    { name: 'Maghrib', arabicName: 'المَغْرِب', ...formatTime(maghribHour) },
    { name: 'Isha', arabicName: 'العِشَاء', ...formatTime(ishaHour) },
  ];

  const now = new Date();
  let nextFound = false;

  const prayers: PrayerTime[] = rawList.map((item) => {
    const isPast = now > item.date;
    let isNext = false;
    if (!isPast && !nextFound && item.name !== 'Sunrise') {
      isNext = true;
      nextFound = true;
    }
    return {
      name: item.name,
      arabicName: item.arabicName,
      time: item.str,
      timestamp: item.date,
      isNext,
      isPast,
    };
  });

  // If all are past today, tomorrow's Fajr is next
  let nextPrayer = prayers.find((p) => p.isNext) || null;
  if (!nextPrayer) {
    const tomorrowFajr = new Date(prayers[0].timestamp);
    tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
    nextPrayer = {
      ...prayers[0],
      timestamp: tomorrowFajr,
      isNext: true,
      isPast: false,
    };
  }

  // Calculate time remaining until next prayer
  const diffMs = nextPrayer.timestamp.getTime() - now.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const timeUntilNext = `${diffHrs > 0 ? `${diffHrs}h ` : ''}${diffMins}m`;

  return { prayers, nextPrayer, timeUntilNext };
}
