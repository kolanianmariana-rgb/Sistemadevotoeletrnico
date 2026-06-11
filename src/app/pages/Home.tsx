import { Link } from 'react-router';
import { Shield, Lock, BarChart2, Users, ChevronRight, Vote, CheckCircle, Zap, Globe, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';
import { motion } from 'motion/react';
import { useState, useEffect, useRef } from 'react';

const features = [
  {
    icon: Shield,
    title: 'Segurança Máxima',
    desc: 'Criptografia AES-256 de ponta a ponta garante que o seu voto é completamente inviolável.',
    color: '#3b82f6',
  },
  {
    icon: Lock,
    title: 'Anonimato Total',
    desc: 'Identidade nunca associada ao voto. Privacidade garantida por lei e tecnologia.',
    color: '#c8d96f',
  },
  {
    icon: BarChart2,
    title: 'Transparência',
    desc: 'Resultados em tempo real com auditoria independente e verificação pública.',
    color: '#10b981',
  },
  {
    icon: Zap,
    title: 'Rapidez',
    desc: 'Processo de votação completo em menos de 2 minutos, a partir de qualquer dispositivo.',
    color: '#f59e0b',
  },
  {
    icon: Globe,
    title: 'Acessível',
    desc: 'Vote de qualquer lugar do mundo. Sem filas, sem deslocação, sem burocracia.',
    color: '#8b5cf6',
  },
  {
    icon: CheckCircle,
    title: 'Verificável',
    desc: 'Cada voto gera um recibo digital único que pode ser verificado de forma anónima.',
    color: '#ef4444',
  },
];

const steps = [
  { num: '01', title: 'Autentique-se', desc: 'Introduza o seu Número de Eleitor e PIN pessoal de forma segura.' },
  { num: '02', title: 'Escolha', desc: 'Selecione o candidato ou lista da sua preferência com total clareza.' },
  { num: '03', title: 'Confirme', desc: 'Reveja a sua escolha e confirme o voto de forma irrevogável.' },
  { num: '04', title: 'Recibo', desc: 'Receba o código de verificação do registo do seu voto.' },
];

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const duration = 1500;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
          start = Math.min(start + step, target);
          setCount(Math.floor(start));
          if (start >= target) clearInterval(timer);
        }, 16);
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString('pt-PT')}
      {suffix}
    </span>
  );
}

const stats = [
  { value: 1200000, suffix: '+', label: 'Eleitores Registados' },
  { value: 99.9, suffix: '%', label: 'Disponibilidade' },
  { value: 256, suffix: '-bit', label: 'Criptografia AES' },
  { value: 0, suffix: '', label: 'Falhas de Segurança' },
];

export function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Logo className="h-40 w-auto md:h-52" tolerance={45} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#c8d96f]/15 border border-[#c8d96f]/30 text-[#c8d96f] px-4 py-2 rounded-full text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-[#c8d96f] animate-pulse" />
              <Vote size={14} />
              <span>Eleições Nacionais 2026 — Votação em Curso</span>
            </div>

            <h1 className="text-5xl md:text-7xl mb-6 text-white leading-tight">
              Vote com{' '}
              <span className="text-[#c8d96f] relative">
                Segurança
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#c8d96f]/40 rounded" />
              </span>{' '}
              e{' '}
              <span className="text-[#c8d96f]">Confiança</span>
            </h1>

            <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              O SOVE é a plataforma oficial de voto eletrónico de Portugal. Participe na democracia
              de forma simples, segura e a partir de qualquer dispositivo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/votar"
                  className="bg-[#c8d96f] text-[#0d3440] px-8 py-4 rounded-xl inline-flex items-center justify-center gap-2 hover:bg-[#d4e07f] transition-all hover:scale-105 shadow-lg shadow-[#c8d96f]/20"
                >
                  <Vote size={20} /> Ir para Votação <ChevronRight size={18} />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="bg-[#c8d96f] text-[#0d3440] px-8 py-4 rounded-xl inline-flex items-center justify-center gap-2 hover:bg-[#d4e07f] transition-all hover:scale-105 shadow-lg shadow-[#c8d96f]/20"
                >
                  Entrar para Votar <ArrowRight size={18} />
                </Link>
              )}
              <Link
                to="/resultados"
                className="border border-[#c8d96f]/40 text-[#c8d96f] px-8 py-4 rounded-xl inline-flex items-center justify-center gap-2 hover:bg-[#c8d96f]/10 transition-all"
              >
                <BarChart2 size={18} /> Ver Resultados ao Vivo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#0d3440]/60 backdrop-blur-sm py-14 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <p className="text-3xl md:text-4xl text-[#c8d96f] mb-2">
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </p>
                <p className="text-gray-400 text-sm">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl mb-3">Porquê o SOVE?</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Desenvolvido com os mais altos padrões de segurança e usabilidade para garantir
            eleições transparentes e acessíveis.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-7 hover:border-white/20 hover:bg-white/10 transition-all cursor-default group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ y: -4 }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: f.color + '22' }}
              >
                <f.icon size={24} style={{ color: f.color }} />
              </div>
              <h3 className="text-lg mb-2 text-white">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#0d3440]/60 py-20 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl mb-3">Como Funciona?</h2>
            <p className="text-gray-400">Votar nunca foi tão simples. Apenas 4 passos.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
              >
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-[#c8d96f]/30 to-transparent z-0" />
                )}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative z-10 hover:bg-white/10 transition-colors">
                  <div className="text-[#c8d96f] text-2xl mb-3">{step.num}</div>
                  <h3 className="text-base mb-2 text-white">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          className="bg-gradient-to-br from-[#c8d96f]/10 to-[#0d3440]/80 border border-[#c8d96f]/20 backdrop-blur-md rounded-3xl p-14 max-w-2xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-[#c8d96f]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users className="text-[#c8d96f]" size={32} />
          </div>
          <h2 className="text-3xl md:text-4xl mb-4">Faça parte da democracia digital</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Junte-se a mais de 1,2 milhões de eleitores que já confiam no SOVE.
          </p>
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="bg-[#c8d96f] text-[#0d3440] px-10 py-4 rounded-xl inline-flex items-center gap-2 hover:bg-[#d4e07f] transition-all hover:scale-105 shadow-xl shadow-[#c8d96f]/20"
            >
              Autenticar e Votar <ArrowRight size={20} />
            </Link>
          ) : (
            <Link
              to="/votar"
              className="bg-[#c8d96f] text-[#0d3440] px-10 py-4 rounded-xl inline-flex items-center gap-2 hover:bg-[#d4e07f] transition-all hover:scale-105 shadow-xl shadow-[#c8d96f]/20"
            >
              <Vote size={20} /> Votar Agora
            </Link>
          )}
        </motion.div>
      </section>
    </div>
  );
}
