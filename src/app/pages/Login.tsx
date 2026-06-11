import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Shield, Eye, EyeOff, AlertCircle, CheckCircle, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Logo } from '../components/Logo';

export function Login() {
  const [voterId, setVoterId] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (voterId.length < 4) {
      setError('O Número de Eleitor deve ter pelo menos 4 caracteres.');
      return;
    }
    if (pin.length < 4) {
      setError('O PIN deve ter pelo menos 4 dígitos.');
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));

    const ok = login(voterId, pin);
    setLoading(false);

    if (ok) {
      toast.success('Autenticação bem-sucedida!', {
        description: `Bem-vindo, eleitor ${voterId}`,
        icon: '✓',
      });
      navigate('/votar');
    } else {
      setError('Credenciais inválidas. Por favor tente novamente.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[85vh]">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Logo small */}
          <div className="flex justify-center mb-6">
            <Logo className="h-20 w-auto" tolerance={45} />
          </div>

          {/* Card */}
          <div className="bg-white/8 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-[#c8d96f]/15 border border-[#c8d96f]/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="text-[#c8d96f]" size={28} />
              </div>
              <h1 className="text-2xl text-white">Autenticação do Eleitor</h1>
              <p className="text-gray-400 text-sm mt-1">
                Introduza as suas credenciais para aceder à votação
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Voter ID */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Número de Eleitor</label>
                <div className="relative">
                  <input
                    type="text"
                    value={voterId}
                    onChange={(e) => setVoterId(e.target.value.toUpperCase())}
                    placeholder="Ex: PT12345678"
                    className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#c8d96f]/60 focus:bg-white/10 transition-all pr-10"
                    maxLength={12}
                    autoComplete="username"
                  />
                  {voterId.length >= 4 && (
                    <CheckCircle size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c8d96f]" />
                  )}
                </div>
              </div>

              {/* PIN */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">PIN Pessoal</label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••"
                    className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#c8d96f]/60 focus:bg-white/10 transition-all pr-12"
                    maxLength={6}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPin ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* PIN dots indicator */}
              {pin.length > 0 && (
                <div className="flex gap-2 justify-center">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                        i < pin.length ? 'bg-[#c8d96f] scale-110' : 'bg-white/15'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 bg-red-500/15 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm"
                  >
                    <AlertCircle size={15} className="flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#c8d96f] text-[#0d3440] py-3.5 rounded-xl hover:bg-[#d4e07f] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#c8d96f]/20 hover:shadow-[#c8d96f]/30 hover:scale-[1.02]"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    A verificar identidade...
                  </>
                ) : (
                  <>
                    Entrar <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Demo hint */}
            <div className="mt-6 bg-[#c8d96f]/8 border border-[#c8d96f]/20 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <CheckCircle size={15} className="text-[#c8d96f] flex-shrink-0 mt-0.5" />
                <div className="text-xs text-gray-400">
                  <p className="text-[#c8d96f] mb-1">Modo de demonstração</p>
                  <p>Qualquer Nº de Eleitor (≥ 4 caracteres) + PIN (≥ 4 dígitos).</p>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-gray-500 mt-5">
              Ainda não está inscrito?{' '}
              <Link to="/inscricao" className="text-[#c8d96f] hover:underline">
                Inscrever-se agora
              </Link>
            </p>
            <p className="text-center text-sm text-gray-600 mt-2">
              Precisa de ajuda?{' '}
              <Link to="/assistencia" className="text-gray-500 hover:text-[#c8d96f] hover:underline transition-colors">
                Falar com assistente virtual
              </Link>
            </p>
          </div>

          {/* Security note */}
          <div className="flex items-center justify-center gap-3 mt-5 text-gray-600 text-xs">
            <Lock size={11} />
            <span>Ligação protegida por SSL/TLS 256-bit</span>
            <span>·</span>
            <Shield size={11} />
            <span>ISO/IEC 27001</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
