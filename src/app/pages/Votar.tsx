import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  Vote, CheckCircle, Shield, ChevronRight, ChevronLeft,
  User, AlertTriangle, Copy, ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGeolocation } from '../context/GeolocationContext';
import { GeolocationStatus } from '../components/GeolocationStatus';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

const candidates = [
  { id: 1, name: 'Ana Ferreira', party: 'Partido da Renovação', number: '10', color: '#3b82f6', symbol: '🔵', votes: 312450 },
  { id: 2, name: 'Carlos Mendes', party: 'Aliança Democrática', number: '20', color: '#10b981', symbol: '🟢', votes: 278900 },
  { id: 3, name: 'Sofia Rodrigues', party: 'Movimento Cidadão', number: '30', color: '#f59e0b', symbol: '🟡', votes: 195300 },
  { id: 4, name: 'Tiago Santos', party: 'Frente Popular', number: '40', color: '#ef4444', symbol: '🔴', votes: 143200 },
];

type Step = 'confirm-identity' | 'select' | 'review' | 'success';

const STEP_LABELS = ['Identidade', 'Candidato', 'Revisão'];
const STEP_KEYS: Step[] = ['confirm-identity', 'select', 'review', 'success'];

function ProgressBar({ step }: { step: Step }) {
  const stepIndex = STEP_KEYS.indexOf(step);
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEP_LABELS.map((label, i) => {
        const isActive = i === stepIndex;
        const isDone = stepIndex > i;
        return (
          <div key={label} className={`flex items-center ${i < STEP_LABELS.length - 1 ? 'flex-1' : ''}`}>
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <motion.div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all border-2 ${
                  isDone
                    ? 'bg-green-500 border-green-500 text-white'
                    : isActive
                    ? 'bg-[#c8d96f] border-[#c8d96f] text-[#0d3440]'
                    : 'bg-white/5 border-white/15 text-gray-500'
                }`}
                animate={{ scale: isActive ? [1, 1.15, 1] : 1 }}
                transition={{ duration: 0.4 }}
              >
                {isDone ? <CheckCircle size={16} /> : i + 1}
              </motion.div>
              <span className={`text-xs hidden sm:block ${isActive ? 'text-[#c8d96f]' : isDone ? 'text-green-400' : 'text-gray-600'}`}>
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className="flex-1 h-px mx-3 relative overflow-hidden bg-white/10 rounded">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-green-500 rounded"
                  animate={{ width: isDone ? '100%' : '0%' }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Votar() {
  const { isAuthenticated, voterId, hasVoted, markVoted } = useAuth();
  const { requestLocation, coordinates, error: geoError } = useGeolocation();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('confirm-identity');
  const [selected, setSelected] = useState<number | null>(null);
  const [locationRequested, setLocationRequested] = useState(false);
  const [receiptCode] = useState(() => Math.random().toString(36).substring(2, 18).toUpperCase());
  const confettiRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated && !hasVoted && !locationRequested) {
      requestLocation();
      setLocationRequested(true);
    }
  }, [isAuthenticated, hasVoted, locationRequested, requestLocation]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[70vh]">
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 bg-red-500/15 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-red-400" size={28} />
          </div>
          <h2 className="text-2xl mb-3">Acesso Restrito</h2>
          <p className="text-gray-400 mb-6">Precisa de se autenticar para aceder à área de votação.</p>
          <Link
            to="/login"
            className="bg-[#c8d96f] text-[#0d3440] px-6 py-3 rounded-xl inline-flex items-center gap-2 hover:bg-[#d4e07f] transition-colors"
          >
            Ir para Autenticação <ChevronRight size={18} />
          </Link>
        </motion.div>
      </div>
    );
  }

  if (hasVoted && step !== 'success') {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[70vh]">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-400" size={48} />
          </div>
          <h2 className="text-3xl mb-3">Voto Já Registado</h2>
          <p className="text-gray-400 mb-2">O seu voto já foi registado anteriormente.</p>
          <p className="text-gray-500 text-sm mb-8">Obrigado por participar no processo democrático.</p>
          <Link
            to="/resultados"
            className="bg-[#c8d96f] text-[#0d3440] px-6 py-3 rounded-xl inline-flex items-center gap-2 hover:bg-[#d4e07f] transition-colors"
          >
            Ver Resultados <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  const selectedCandidate = candidates.find((c) => c.id === selected);

  const handleConfirmVote = () => {
    markVoted();
    setStep('success');

    // Confetti celebration
    if (!confettiRef.current) {
      confettiRef.current = true;
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#c8d96f', '#0d3440', '#ffffff', '#10b981'] });
      setTimeout(() => {
        confetti({ particleCount: 60, spread: 50, origin: { y: 0.4, x: 0.2 }, colors: ['#c8d96f', '#3b82f6'] });
        confetti({ particleCount: 60, spread: 50, origin: { y: 0.4, x: 0.8 }, colors: ['#c8d96f', '#f59e0b'] });
      }, 400);
    }

    toast.success('Voto registado com sucesso!', {
      description: `Código: ${receiptCode}`,
      duration: 6000,
    });
  };

  const copyReceipt = () => {
    navigator.clipboard.writeText(receiptCode);
    toast.success('Código copiado!');
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      {step !== 'success' && <ProgressBar step={step} />}

      <AnimatePresence mode="wait">
        {/* Step 1: Confirm identity */}
        {step === 'confirm-identity' && (
          <motion.div
            key="identity"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="bg-white/8 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#c8d96f]/15 rounded-xl flex items-center justify-center">
                <User className="text-[#c8d96f]" size={22} />
              </div>
              <h2 className="text-2xl text-white">Confirmar Identidade</h2>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
              <p className="text-gray-400 text-sm mb-1">Eleitor autenticado</p>
              <p className="text-3xl text-[#c8d96f]">{voterId}</p>
            </div>

            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Confirme que é o eleitor acima identificado antes de prosseguir. O seu voto é
              completamente secreto e anónimo — a sua identidade nunca está associada ao voto.
            </p>

            <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 bg-white/5 rounded-xl px-4 py-3">
              <Shield size={14} className="text-[#c8d96f] flex-shrink-0" />
              <span>Voto encriptado com AES-256 — anonimato garantido por lei</span>
            </div>

            <GeolocationStatus showDetails={false} />

            {geoError && (
              <div className="mt-4 flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-sm">
                <AlertTriangle size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-amber-300">
                  Geolocalização indisponível. Pode continuar a votação — a localização será
                  registada como não capturada.
                </p>
              </div>
            )}

            <button
              onClick={() => setStep('select')}
              className="w-full bg-[#c8d96f] text-[#0d3440] py-3.5 rounded-xl hover:bg-[#d4e07f] transition-all flex items-center justify-center gap-2 mt-6 hover:scale-[1.02]"
            >
              Confirmar e Prosseguir <ChevronRight size={18} />
            </button>
          </motion.div>
        )}

        {/* Step 2: Select candidate */}
        {step === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="bg-white/8 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#c8d96f]/15 rounded-xl flex items-center justify-center">
                <Vote className="text-[#c8d96f]" size={22} />
              </div>
              <h2 className="text-2xl text-white">Selecione o Candidato</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {candidates.map((c) => (
                <motion.button
                  key={c.id}
                  onClick={() => setSelected(c.id)}
                  className={`p-5 rounded-2xl text-left transition-all border-2 ${
                    selected === c.id
                      ? 'border-[#c8d96f] bg-[#c8d96f]/10 shadow-lg shadow-[#c8d96f]/10'
                      : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/8'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl border"
                      style={{
                        backgroundColor: c.color + '22',
                        borderColor: c.color + '44',
                        color: c.color,
                      }}
                    >
                      <span className="text-lg">{c.number}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white truncate">{c.name}</p>
                      <p className="text-gray-400 text-sm truncate">{c.party}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        selected === c.id ? 'border-[#c8d96f] bg-[#c8d96f]' : 'border-white/20'
                      }`}
                    >
                      {selected === c.id && <div className="w-2 h-2 rounded-full bg-[#0d3440]" />}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('confirm-identity')}
                className="flex items-center gap-2 border border-white/15 px-5 py-3 rounded-xl text-gray-300 hover:bg-white/5 transition-colors"
              >
                <ChevronLeft size={17} /> Voltar
              </button>
              <button
                onClick={() => setStep('review')}
                disabled={selected === null}
                className="flex-1 bg-[#c8d96f] text-[#0d3440] py-3 rounded-xl hover:bg-[#d4e07f] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                Rever Escolha <ChevronRight size={17} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Review */}
        {step === 'review' && selectedCandidate && (
          <motion.div
            key="review"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="bg-white/8 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#c8d96f]/15 rounded-xl flex items-center justify-center">
                <CheckCircle className="text-[#c8d96f]" size={22} />
              </div>
              <h2 className="text-2xl text-white">Rever e Confirmar</h2>
            </div>

            <p className="text-gray-400 mb-6">
              Verifique cuidadosamente a sua escolha antes de confirmar. Esta ação é irreversível.
            </p>

            <div
              className="border-2 rounded-2xl p-6 mb-6"
              style={{ borderColor: selectedCandidate.color + '66', backgroundColor: selectedCandidate.color + '11' }}
            >
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-4">A sua escolha</p>
              <div className="flex items-center gap-5">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 border"
                  style={{
                    backgroundColor: selectedCandidate.color + '22',
                    borderColor: selectedCandidate.color + '44',
                    color: selectedCandidate.color,
                  }}
                >
                  <span className="text-3xl">{selectedCandidate.number}</span>
                </div>
                <div>
                  <p className="text-2xl text-white">{selectedCandidate.name}</p>
                  <p className="text-gray-300">{selectedCandidate.party}</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/25 rounded-xl p-4 mb-6">
              <AlertTriangle size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-amber-300 text-sm">
                Ao confirmar, o seu voto será registado de forma permanente e cifrada. Não será
                possível alterar ou retirar o voto após a confirmação.
              </p>
            </div>

            <GeolocationStatus showDetails={true} />

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep('select')}
                className="flex items-center gap-2 border border-white/15 px-5 py-3 rounded-xl text-gray-300 hover:bg-white/5 transition-colors"
              >
                <ChevronLeft size={17} /> Alterar
              </button>
              <motion.button
                onClick={handleConfirmVote}
                className="flex-1 bg-[#c8d96f] text-[#0d3440] py-3 rounded-xl hover:bg-[#d4e07f] transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <CheckCircle size={18} /> Confirmar Voto
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Success */}
        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, type: 'spring' }}
            className="bg-white/8 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl text-center"
          >
            <motion.div
              className="w-24 h-24 bg-green-500/20 border-2 border-green-500/40 rounded-full flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <CheckCircle className="text-green-400" size={52} />
            </motion.div>

            <h2 className="text-4xl text-white mb-3">Voto Registado!</h2>
            <p className="text-gray-300 mb-2 text-lg">O seu voto foi registado com sucesso.</p>
            <p className="text-gray-500 text-sm mb-8">
              Obrigado por participar no processo democrático de Portugal.
            </p>

            {/* Receipt */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={16} className="text-[#c8d96f]" />
                <span className="text-sm text-gray-400">Recibo de votação</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 text-xs mb-1">Eleitor</p>
                  <p className="text-white font-mono">{voterId}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Data/Hora</p>
                  <p className="text-white text-xs">
                    {new Date().toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500 text-xs mb-1">Código de verificação</p>
                  <div className="flex items-center gap-3">
                    <p className="text-[#c8d96f] font-mono text-lg tracking-widest">{receiptCode}</p>
                    <button
                      onClick={copyReceipt}
                      className="text-gray-500 hover:text-[#c8d96f] transition-colors"
                      title="Copiar código"
                    >
                      <Copy size={15} />
                    </button>
                  </div>
                </div>
                {coordinates && (
                  <div className="col-span-2">
                    <p className="text-gray-500 text-xs mb-1">Localização registada</p>
                    <p className="text-gray-300 text-xs font-mono">
                      {coordinates.latitude.toFixed(4)}°, {coordinates.longitude.toFixed(4)}° (±{Math.round(coordinates.accuracy)}m)
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/resultados"
                className="bg-[#c8d96f] text-[#0d3440] px-8 py-3 rounded-xl inline-flex items-center justify-center gap-2 hover:bg-[#d4e07f] transition-all hover:scale-105"
              >
                Ver Resultados <ExternalLink size={16} />
              </Link>
              <Link
                to="/"
                className="border border-white/15 text-gray-300 px-8 py-3 rounded-xl inline-flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
              >
                Voltar ao Início
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
