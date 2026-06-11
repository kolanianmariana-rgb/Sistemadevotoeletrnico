import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface GeolocationContextType {
  coordinates: Coordinates | null;
  isLoading: boolean;
  error: string | null;
  permissionStatus: 'granted' | 'denied' | 'prompt' | 'unknown';
  requestLocation: () => Promise<void>;
  clearLocation: () => void;
}

const GeolocationContext = createContext<GeolocationContextType | null>(null);

export function GeolocationProvider({ children }: { children: ReactNode }) {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');

  useEffect(() => {
    // Check permission status on mount
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setPermissionStatus(result.state as 'granted' | 'denied' | 'prompt');

        // Listen for permission changes
        result.addEventListener('change', () => {
          setPermissionStatus(result.state as 'granted' | 'denied' | 'prompt');
        });
      }).catch(() => {
        setPermissionStatus('unknown');
      });
    }
  }, []);

  const requestLocation = useCallback(async () => {
    if (!('geolocation' in navigator)) {
      setError('Geolocalização não é suportada neste navegador');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      });

      const coords: Coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      };

      setCoordinates(coords);
      setPermissionStatus('granted');
    } catch (err) {
      const errorMessage = err instanceof GeolocationPositionError
        ? getGeolocationErrorMessage(err.code)
        : 'Erro ao obter localização';

      setError(errorMessage);

      if (err instanceof GeolocationPositionError && err.code === 1) {
        setPermissionStatus('denied');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearLocation = useCallback(() => {
    setCoordinates(null);
    setError(null);
  }, []);

  return (
    <GeolocationContext.Provider
      value={{
        coordinates,
        isLoading,
        error,
        permissionStatus,
        requestLocation,
        clearLocation
      }}
    >
      {children}
    </GeolocationContext.Provider>
  );
}

export function useGeolocation() {
  const ctx = useContext(GeolocationContext);
  if (!ctx) throw new Error('useGeolocation must be used within GeolocationProvider');
  return ctx;
}

function getGeolocationErrorMessage(code: number): string {
  switch (code) {
    case 1:
      return 'Permissão de localização negada';
    case 2:
      return 'Localização indisponível';
    case 3:
      return 'Tempo esgotado ao obter localização';
    default:
      return 'Erro desconhecido ao obter localização';
  }
}
