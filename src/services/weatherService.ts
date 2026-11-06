import { CurrentWeather, HourlyForecastItem, DailyForecastItem } from '../types/weather';

function getCardinalDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index] || 'N';
}

function getWeatherConditionText(code: number | string): { text: string; code: string } {
  if (typeof code === 'string') {
    const formatted = code.replace(/_/g, ' ').toLowerCase();
    const capitalized = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    return { text: capitalized, code };
  }

  // WMO weather interpretation codes
  switch (code) {
    case 0:
      return { text: 'Clear Sky', code: 'CLEAR' };
    case 1:
      return { text: 'Mainly Clear', code: 'MOSTLY_CLEAR' };
    case 2:
      return { text: 'Partly Cloudy', code: 'PARTLY_CLOUDY' };
    case 3:
      return { text: 'Overcast', code: 'CLOUDY' };
    case 45:
    case 48:
      return { text: 'Hazy / Foggy', code: 'FOG' };
    case 51:
    case 53:
    case 55:
      return { text: 'Light Drizzle', code: 'DRIZZLE' };
    case 61:
    case 63:
    case 65:
      return { text: 'Rain Showers', code: 'RAIN' };
    case 71:
    case 73:
    case 75:
      return { text: 'Snow Flurries', code: 'SNOW' };
    case 80:
    case 81:
    case 82:
      return { text: 'Scattered Showers', code: 'RAIN_SHOWERS' };
    case 95:
    case 96:
    case 99:
      return { text: 'Thunderstorm', code: 'THUNDERSTORM' };
    default:
      return { text: 'Fair Weather', code: 'FAIR' };
  }
}

/**
 * Fetch weather from Google Maps Platform Weather API
 */
async function fetchGoogleWeather(lat: number, lng: number, apiKey: string): Promise<{
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
}> {
  // Current conditions lookup
  const currentUrl = new URL('https://weather.googleapis.com/v1/currentConditions:lookup');
  currentUrl.searchParams.append('key', apiKey);
  currentUrl.searchParams.append('location.latitude', lat.toFixed(4));
  currentUrl.searchParams.append('location.longitude', lng.toFixed(4));
  currentUrl.searchParams.append('unitsSystem', 'METRIC');

  const currentRes = await fetch(currentUrl.toString(), {
    method: 'GET',
    headers: {
      'X-Goog-Maps-Solution-ID': 'gmp_mcp_codeassist_v1_aistudio',
    },
  });

  if (currentRes.status === 429) {
    window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
    throw new Error('Google Maps Platform quota reached (429)');
  }

  if (!currentRes.ok) {
    throw new Error(`Google Weather API error: ${currentRes.status} ${currentRes.statusText}`);
  }

  const currentData = await currentRes.json();

  if (currentData.error?.status === 'RESOURCE_EXHAUSTED') {
    window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
    throw new Error('Google Maps Platform resource quota exhausted');
  }

  const cond = currentData.weatherCondition;
  const temp = currentData.temperature?.degrees ?? 28;
  const feelsLike = currentData.feelsLikeTemperature?.degrees ?? temp;
  const tempMin = currentData.currentConditionsHistory?.minTemperature?.degrees ?? temp - 3;
  const tempMax = currentData.currentConditionsHistory?.maxTemperature?.degrees ?? temp + 4;
  const windSpeed = currentData.wind?.speed?.value ?? 12;
  const windDeg = currentData.wind?.direction?.degrees ?? 90;

  const current: CurrentWeather = {
    temperature: Math.round(temp * 10) / 10,
    feelsLike: Math.round(feelsLike * 10) / 10,
    tempMin: Math.round(tempMin),
    tempMax: Math.round(tempMax),
    conditionText: cond?.description?.text || getWeatherConditionText(cond?.type || 'CLEAR').text,
    conditionCode: cond?.type || 'CLEAR',
    iconUri: cond?.iconBaseUri,
    isDaytime: currentData.isDaytime ?? true,
    humidity: currentData.relativeHumidity ?? 45,
    windSpeed: Math.round(windSpeed),
    windGust: currentData.wind?.gust?.value ? Math.round(currentData.wind.gust.value) : undefined,
    windDirection: windDeg,
    windCardinal: currentData.wind?.direction?.cardinal || getCardinalDirection(windDeg),
    pressure: Math.round(currentData.airPressure?.meanSeaLevelMillibars ?? 1013),
    uvIndex: currentData.uvIndex ?? 6,
    visibility: Math.round(currentData.visibility?.distance ?? 10),
    cloudCover: currentData.cloudCover ?? 10,
    precipitationProb: currentData.precipitation?.probability?.percent ?? 0,
    dewPoint: Math.round(currentData.dewPoint?.degrees ?? 16),
    observedAt: currentData.currentTime || new Date().toISOString(),
    source: 'google',
  };

  // Hourly forecast lookup
  let hourly: HourlyForecastItem[] = [];
  try {
    const hourlyUrl = new URL('https://weather.googleapis.com/v1/forecast/hours:lookup');
    hourlyUrl.searchParams.append('key', apiKey);
    hourlyUrl.searchParams.append('location.latitude', lat.toFixed(4));
    hourlyUrl.searchParams.append('location.longitude', lng.toFixed(4));
    hourlyUrl.searchParams.append('hours', '24');

    const hourlyRes = await fetch(hourlyUrl.toString(), {
      method: 'GET',
      headers: {
        'X-Goog-Maps-Solution-ID': 'gmp_mcp_codeassist_v1_aistudio',
      },
    });

    if (hourlyRes.ok) {
      const hourlyData = await hourlyRes.json();
      if (Array.isArray(hourlyData.forecastHours)) {
        hourly = hourlyData.forecastHours.slice(0, 24).map((h: any) => {
          const hTemp = h.temperature?.degrees ?? 28;
          const hFeels = h.feelsLikeTemperature?.degrees ?? hTemp;
          const dateStr = h.interval?.startTime || new Date().toISOString();
          const hourNum = new Date(dateStr).getHours();
          return {
            time: dateStr,
            hourLabel: `${hourNum % 12 || 12} ${hourNum >= 12 ? 'PM' : 'AM'}`,
            temperature: Math.round(hTemp),
            feelsLike: Math.round(hFeels),
            precipitationProb: h.precipitation?.probability?.percent ?? 0,
            humidity: h.relativeHumidity ?? 40,
            windSpeed: Math.round(h.wind?.speed?.value ?? 10),
            conditionText: h.weatherCondition?.description?.text || 'Clear',
            conditionCode: h.weatherCondition?.type || 'CLEAR',
            iconUri: h.weatherCondition?.iconBaseUri,
            isDaytime: h.isDaytime ?? true,
          };
        });
      }
    }
  } catch (e) {
    console.warn('Hourly forecast fetch skipped or failed:', e);
  }

  return { current, hourly };
}

/**
 * Resilient Meteorological Fallback (Open-Meteo API)
 * High-accuracy ECMWF/GFS weather modeling for Oman/Middle East
 */
async function fetchFallbackWeather(lat: number, lng: number): Promise<{
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
}> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,pressure_msl,wind_speed_10m,uv_index,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,wind_speed_10m_max,uv_index_max&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Open-Meteo HTTP error: ${res.status}`);
  }

  const data = await res.json();
  const c = data.current;
  const cond = getWeatherConditionText(c.weather_code);

  const todayMin = data.daily?.temperature_2m_min?.[0] ?? Math.round(c.temperature_2m - 4);
  const todayMax = data.daily?.temperature_2m_max?.[0] ?? Math.round(c.temperature_2m + 5);

  const current: CurrentWeather = {
    temperature: Math.round(c.temperature_2m * 10) / 10,
    feelsLike: Math.round(c.apparent_temperature * 10) / 10,
    tempMin: Math.round(todayMin),
    tempMax: Math.round(todayMax),
    conditionText: cond.text,
    conditionCode: cond.code,
    isDaytime: Boolean(c.is_day),
    humidity: Math.round(c.relative_humidity_2m),
    windSpeed: Math.round(c.wind_speed_10m),
    windGust: c.wind_gusts_10m ? Math.round(c.wind_gusts_10m) : undefined,
    windDirection: c.wind_direction_10m,
    windCardinal: getCardinalDirection(c.wind_direction_10m),
    pressure: Math.round(c.pressure_msl || c.surface_pressure || 1012),
    uvIndex: Math.round(data.daily?.uv_index_max?.[0] ?? 7),
    visibility: 15, // km default clear desert/coastal
    cloudCover: Math.round(c.cloud_cover ?? 10),
    precipitationProb: Math.round(data.daily?.precipitation_probability_max?.[0] ?? 0),
    dewPoint: Math.round(c.temperature_2m - (100 - c.relative_humidity_2m) / 5),
    observedAt: c.time || new Date().toISOString(),
    source: 'meteorological_station',
  };

  // Extract next 24 hourly steps
  const hourly: HourlyForecastItem[] = [];
  if (data.hourly?.time) {
    const nowIdx = data.hourly.time.findIndex((t: string) => new Date(t) >= new Date());
    const start = Math.max(0, nowIdx !== -1 ? nowIdx : 0);
    const sliceEnd = Math.min(start + 24, data.hourly.time.length);

    for (let i = start; i < sliceEnd; i++) {
      const t = data.hourly.time[i];
      const d = new Date(t);
      const hourNum = d.getHours();
      const hCond = getWeatherConditionText(data.hourly.weather_code[i]);
      hourly.push({
        time: t,
        hourLabel: `${hourNum % 12 || 12} ${hourNum >= 12 ? 'PM' : 'AM'}`,
        temperature: Math.round(data.hourly.temperature_2m[i]),
        feelsLike: Math.round(data.hourly.apparent_temperature[i]),
        precipitationProb: Math.round(data.hourly.precipitation_probability[i] ?? 0),
        humidity: Math.round(data.hourly.relative_humidity_2m[i]),
        windSpeed: Math.round(data.hourly.wind_speed_10m[i]),
        conditionText: hCond.text,
        conditionCode: hCond.code,
        isDaytime: Boolean(data.hourly.is_day?.[i] ?? (hourNum >= 6 && hourNum < 18)),
      });
    }
  }

  // Extract 7 daily forecast items
  const daily: DailyForecastItem[] = [];
  if (data.daily?.time) {
    for (let i = 0; i < Math.min(7, data.daily.time.length); i++) {
      const d = new Date(data.daily.time[i]);
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayLabel = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : days[d.getDay()];
      const dCond = getWeatherConditionText(data.daily.weather_code[i]);

      daily.push({
        date: data.daily.time[i],
        dayLabel,
        tempMax: Math.round(data.daily.temperature_2m_max[i]),
        tempMin: Math.round(data.daily.temperature_2m_min[i]),
        precipitationProb: Math.round(data.daily.precipitation_probability_max?.[i] ?? 0),
        conditionText: dCond.text,
        conditionCode: dCond.code,
        humidity: 45,
        windSpeedMax: Math.round(data.daily.wind_speed_10m_max?.[i] ?? 14),
        uvIndexMax: Math.round(data.daily.uv_index_max?.[i] ?? 8),
        sunrise: data.daily.sunrise?.[i],
        sunset: data.daily.sunset?.[i],
      });
    }
  }

  return { current, hourly, daily };
}

/**
 * Unified Weather Retrieval Function
 * Prioritizes Google Maps Platform Weather API, seamlessly complements with high-precision fallback
 */
export async function getLiveWeatherData(
  lat: number,
  lng: number,
  apiKey?: string
): Promise<{
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
}> {
  // If API key is available, attempt Google Weather API
  if (apiKey && apiKey.length > 5) {
    try {
      const googleResult = await fetchGoogleWeather(lat, lng, apiKey);
      // Fetch 7-day forecast from fallback to complete the forecast package
      const fallbackForDaily = await fetchFallbackWeather(lat, lng).catch(() => null);
      return {
        current: googleResult.current,
        hourly: googleResult.hourly.length > 0 ? googleResult.hourly : (fallbackForDaily?.hourly || []),
        daily: fallbackForDaily?.daily || [],
      };
    } catch (err) {
      console.warn('Google Maps Weather API fetch failed, switching to meteorological fallback:', err);
    }
  }

  // Resilient fallback
  return await fetchFallbackWeather(lat, lng);
}
