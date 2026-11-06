import { useState, useEffect, useCallback, useRef } from 'react';
import { LocationCoords, OmanRegion } from '../types/weather';
import { OMAN_REGIONS } from '../data/omanData';

// Oman approximate bounding box
const OMAN_BOUNDS = {
  minLat: 16.3,
  maxLat: 26.6,
  minLng: 51.8,
  maxLng: 60.1,
};

// Calculate Haversine distance in kilometers
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function findClosestOmanRegion(lat: number, lng: number): {
  region: OmanRegion;
  distanceKm: number;
} {
  let closest = OMAN_REGIONS[0];
  let minDistance = calculateDistanceKm(lat, lng, closest.lat, closest.lng);

  for (const region of OMAN_REGIONS) {
    const d = calculateDistanceKm(lat, lng, region.lat, region.lng);
    if (d < minDistance) {
      minDistance = d;
      closest = region;
    }
  }

  return { region: closest, distanceKm: Math.round(minDistance) };
}

export function checkIsInsideOman(lat: number, lng: number): boolean {
  return (
    lat >= OMAN_BOUNDS.minLat &&
    lat <= OMAN_BOUNDS.maxLat &&
    lng >= OMAN_BOUNDS.minLng &&
    lng <= OMAN_BOUNDS.maxLng
  );
}

export interface LocationState {
  coords: LocationCoords;
  closestRegion: OmanRegion;
  distanceToRegionKm: number;
  isInsideOman: boolean;
  isLoading: boolean;
  error: string | null;
  gpsActive: boolean;
  isWatching: boolean;
  lastUpdated: Date | null;
  customRegionSelected: boolean;
}

export function useUserLocation() {
  const defaultRegion = OMAN_REGIONS[0]; // Muscat

  const [state, setState] = useState<LocationState>({
    coords: {
      lat: defaultRegion.lat,
      lng: defaultRegion.lng,
      accuracy: 50,
    },
    closestRegion: defaultRegion,
    distanceToRegionKm: 0,
    isInsideOman: true,
    isLoading: true,
    error: null,
    gpsActive: false,
    isWatching: false,
    lastUpdated: null,
    customRegionSelected: false,
  });

  const watchIdRef = useRef<number | null>(null);

  const applyCoordinates = useCallback((
    coords: LocationCoords,
    fromGps = false,
    forcedRegion?: OmanRegion
  ) => {
    const inside = checkIsInsideOman(coords.lat, coords.lng);
    const { region, distanceKm } = forcedRegion
      ? { region: forcedRegion, distanceKm: 0 }
      : findClosestOmanRegion(coords.lat, coords.lng);

    setState((prev) => ({
      ...prev,
      coords,
      closestRegion: region,
      distanceToRegionKm: distanceKm,
      isInsideOman: inside,
      isLoading: false,
      error: null,
      gpsActive: fromGps,
      lastUpdated: new Date(),
      customRegionSelected: Boolean(forcedRegion),
    }));
  }, []);

  const requestGpsLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Geolocation is not supported by your browser.',
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy, altitude, heading, speed } = position.coords;
        const newCoords: LocationCoords = {
          lat: latitude,
          lng: longitude,
          accuracy: accuracy || undefined,
          altitude,
          heading,
          speed,
        };

        const inside = checkIsInsideOman(latitude, longitude);
        if (!inside) {
          // User is outside Oman (e.g. testing elsewhere), but we still record real GPS and locate in Muscat with notice
          applyCoordinates(newCoords, true);
        } else {
          applyCoordinates(newCoords, true);
        }
      },
      (err) => {
        let msg = 'Failed to acquire current location.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Defaulting to Muscat, Oman.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'Location request timed out.';
        }

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: msg,
          gpsActive: false,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 10000,
      }
    );
  }, [applyCoordinates]);

  // Toggle Continuous GPS Tracking Watch Mode
  const toggleWatchMode = useCallback(() => {
    if (state.isWatching) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setState((prev) => ({ ...prev, isWatching: false }));
    } else {
      if (!('geolocation' in navigator)) return;

      const id = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy, altitude, heading, speed } = position.coords;
          applyCoordinates(
            {
              lat: latitude,
              lng: longitude,
              accuracy: accuracy || undefined,
              altitude,
              heading,
              speed,
            },
            true
          );
        },
        (err) => {
          console.warn('GPS Watch error:', err);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
        }
      );

      watchIdRef.current = id;
      setState((prev) => ({ ...prev, isWatching: true }));
    }
  }, [state.isWatching, applyCoordinates]);

  // Select a preset Oman region manually
  const selectOmanRegion = useCallback((region: OmanRegion) => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    applyCoordinates(
      {
        lat: region.lat,
        lng: region.lng,
        accuracy: 10,
      },
      false,
      region
    );
  }, [applyCoordinates]);

  // Set coordinates directly (e.g. from clicking on map)
  const setCustomLocation = useCallback((lat: number, lng: number) => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    applyCoordinates(
      {
        lat,
        lng,
        accuracy: 25,
      },
      false
    );
  }, [applyCoordinates]);

  // Automated initial GPS probe on mount
  useEffect(() => {
    requestGpsLocation();

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [requestGpsLocation]);

  return {
    ...state,
    requestGpsLocation,
    toggleWatchMode,
    selectOmanRegion,
    setCustomLocation,
  };
}
