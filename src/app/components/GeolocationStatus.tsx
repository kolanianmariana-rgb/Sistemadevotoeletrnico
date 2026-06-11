import { MapPin, Loader2, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useGeolocation } from '../context/GeolocationContext';

interface GeolocationStatusProps {
  showDetails?: boolean;
  compact?: boolean;
}

export function GeolocationStatus({ showDetails = true, compact = false }: GeolocationStatusProps) {
  const { coordinates, isLoading, error, permissionStatus } = useGeolocation();

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        {isLoading && (
          <>
            <Loader2 size={14} className="text-[#c8d96f] animate-spin" />
            <span className="text-gray-400">A obter localização...</span>
          </>
        )}
        {error && (
          <>
            <XCircle size={14} className="text-red-400" />
            <span className="text-red-400">{error}</span>
          </>
        )}
        {coordinates && (
          <>
            <CheckCircle size={14} className="text-green-400" />
            <span className="text-green-400">Localização confirmada</span>
          </>
        )}
        {!isLoading && !error && !coordinates && permissionStatus === 'prompt' && (
          <>
            <MapPin size={14} className="text-gray-400" />
            <span className="text-gray-400">Aguardando permissão</span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <MapPin size={18} className="text-[#c8d96f]" />
        <h3 className="font-medium">Geolocalização</h3>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Loader2 size={16} className="animate-spin" />
          <span>A obter localização do dispositivo...</span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-red-400 font-medium mb-1">Erro de Geolocalização</p>
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      )}

      {coordinates && showDetails && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-3">
            <CheckCircle size={16} className="text-green-400" />
            <span className="text-sm text-green-400">Localização capturada com sucesso</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">Latitude</p>
              <p className="text-white font-mono">{coordinates.latitude.toFixed(6)}°</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">Longitude</p>
              <p className="text-white font-mono">{coordinates.longitude.toFixed(6)}°</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">Precisão</p>
              <p className="text-white">{Math.round(coordinates.accuracy)}m</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">Data/Hora</p>
              <p className="text-white text-xs">
                {new Date(coordinates.timestamp).toLocaleString('pt-PT', {
                  dateStyle: 'short',
                  timeStyle: 'short'
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      {coordinates && !showDetails && (
        <div className="flex items-center gap-2 text-sm text-green-400">
          <CheckCircle size={16} />
          <span>Localização capturada</span>
        </div>
      )}

      {!isLoading && !error && !coordinates && permissionStatus === 'denied' && (
        <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
          <AlertCircle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-amber-400 font-medium mb-1">Permissão Negada</p>
            <p className="text-amber-300">
              Por favor, ative a permissão de localização nas configurações do navegador.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
