import { useState, useEffect } from 'react';
import {
  MapPin, Database, Users, TrendingUp, Shield, Activity,
  RefreshCw, BarChart2, AlertTriangle, CheckCircle,
  Server, Lock, Eye, Zap, Clock,
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, CartesianGrid, XAxis, YAxis } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { GeolocationStatus } from '../components/GeolocationStatus';

// Mock data
const districts = [
  { name: 'Lisboa', votes: 342100, active: 142, status: 'online' },
  { name: 'Porto', votes: 218500, active: 98, status: 'online' },
  { name: 'Braga', votes: 134200, active: 61, status: 'online' },
  { name: 'Setúbal', votes: 112300, active: 48, status: 'online' },
  { name: 'Aveiro', votes: 98700, active: 43, status: 'warning' },
  { name: 'Coimbra', votes: 87400, active: 38, status: 'online' },
  { name: 'Leiria', votes: 76100, active: 33, status: 'online' },
  { name: 'Faro', votes: 69800, active: 30, status: 'online' },
  { name: 'Santarém', votes: 58200, active: 25, status: 'online' },
  { name: 'Viseu', votes: 52100, active: 22, status: 'online' },
  { name: 'V. Real', votes: 34100, active: 14, status: 'offline' },
  { name: 'Beja', votes: 28900, active: 12, status: 'online' },
];

const activityLog = [
  { id: 1, type: 'vote', message: 'Voto registado — Lisboa', time: '14:23:41', icon: CheckCircle, color: 'text-green-400' },
  { id: 2, type: 'auth', message: 'Autenticação — Eleitor PT99834', time: '14:23:39', icon: Shield, color: 'text-[#c8d96f]' },
  { id: 3, type: 'vote', message: 'Voto registado — Porto', time: '14:23:37', icon: CheckCircle, color: 'text-green-400' },
  { id: 4, type: 'warn', message: 'Tentativa de acesso inválida — IP 203.x.x.x', time: '14:23:31', icon: AlertTriangle, color: 'text-amber-400' },
  { id: 5, type: 'vote', message: 'Voto registado — Coimbra', time: '14:23:28', icon: CheckCircle, color: 'text-green-400' },
  { id: 6, type: 'auth', message: 'Autenticação — Eleitor PT22011', time: '14:23:25', icon: Shield, color: 'text-[#c8d96f]' },
  { id: 7, type: 'geo', message: 'Geolocalização capturada — Porto', time: '14:23:22', icon: MapPin, color: 'text-blue-400' },
  { id: 8, type: 'vote', message: 'Voto registado — Faro', time: '14:23:19', icon: CheckCircle, color: 'text-green-400' },
];

const recentVotes = [
  { id: 1, timestamp: Date.now() - 120000, location: { latitude: 38.7223, longitude: -9.1393, accuracy: 15 }, district: 'Lisboa', voter: 'PT88***', status: 'geo' },
  { id: 2, timestamp: Date.now() - 310000, location: { latitude: 41.1579, longitude: -8.6291, accuracy: 22 }, district: 'Porto', voter: 'PT41***', status: 'geo' },
  { id: 3, timestamp: Date.now() - 520000, location: { latitude: 40.2033, longitude: -8.4103, accuracy: 18 }, district: 'Coimbra', voter: 'PT57***', status: 'geo' },
  { id: 4, timestamp: Date.now() - 720000, location: { latitude: 37.0194, longitude: -7.9304, accuracy: 25 }, district: 'Faro', voter: 'PT29***', status: 'geo' },
  { id: 5, timestamp: Date.now() - 900000, location: null, district: 'Desconhecido', voter: 'PT66***', status: 'no-geo' },
  { id: 6, timestamp: Date.now() - 1100000, location: { latitude: 41.5454, longitude: -8.4265, accuracy: 12 }, district: 'Braga', voter: 'PT13***', status: 'geo' },
];

const voteChartData = [
  { time: '08h', votos: 2100 }, { time: '09h', votos: 8400 }, { time: '10h', votos: 15200 },
  { time: '11h', votos: 21800 }, { time: '12h', votos: 18600 }, { time: '13h', votos: 14200 },
  { time: '14h', votos: 23100 }, { time: 'Agora', votos: 27500 },
];

const systemHealth = [
  { label: 'API Gateway', status: 'online', uptime: '99.98%', latency: '12ms' },
  { label: 'Base de Dados', status: 'online', uptime: '99.99%', latency: '4ms' },
  { label: 'Encriptação', status: 'online', uptime: '100%', latency: '8ms' },
  { label: 'Geolocalização', status: 'warning', uptime: '98.2%', latency: '45ms' },
  { label: 'Backup', status: 'online', uptime: '99.97%', latency: '—' },
];

type AdminTab = 'overview' | 'votos' | 'geo' | 'sistema' | 'logs';

function StatCard({ label, value, icon: Icon, color, sub }: { label: string; value: string; icon: any; color: string; sub?: string }) {
  return (
    <motion.div
      className="bg-white/8 border border-white/10 rounded-2xl p-5 backdrop-blur-sm"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '22' }}>
          <Icon size={22} style={{ color }} />
        </div>
        <TrendingUp size={14} className="text-[#c8d96f] opacity-60" />
      </div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-2xl text-white">{value}</p>
      {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
    </motion.div>
  );
}

export function Admin() {
  const [tab, setTab] = useState<AdminTab>('overview');
  const [liveLog, setLiveLog] = useState(activityLog);
  const [totalVotes, setTotalVotes] = useState(929850);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setTotalVotes((v) => v + Math.floor(Math.random() * 12 + 3));
      setTick((x) => x + 1);

      const newEntry = {
        id: Date.now(),
        type: 'vote',
        message: `Voto registado — ${districts[Math.floor(Math.random() * districts.length)].name}`,
        time: new Date().toLocaleTimeString('pt-PT', { timeStyle: 'medium' }),
        icon: CheckCircle,
        color: 'text-green-400',
      };
      setLiveLog((prev) => [newEntry, ...prev.slice(0, 19)]);
    }, 2500);
    return () => clearInterval(t);
  }, []);

  const tabs: { key: AdminTab; label: string; icon: any }[] = [
    { key: 'overview', label: 'Painel', icon: BarChart2 },
    { key: 'votos', label: 'Votos', icon: Database },
    { key: 'geo', label: 'Geolocalização', icon: MapPin },
    { key: 'sistema', label: 'Sistema', icon: Server },
    { key: 'logs', label: 'Logs', icon: Activity },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[#c8d96f]/15 border border-[#c8d96f]/30 rounded-xl flex items-center justify-center">
            <Shield className="text-[#c8d96f]" size={22} />
          </div>
          <div>
            <h1 className="text-3xl text-white">Painel Administrativo</h1>
            <p className="text-gray-500 text-sm">SOVE — Sistema de Voto Eletrónico</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span>Sistema operacional</span>
          <RefreshCw size={11} className="ml-2 animate-spin" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 mb-8 overflow-x-auto">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all whitespace-nowrap flex-shrink-0 ${
                tab === t.key
                  ? 'bg-[#c8d96f] text-[#0d3440]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* OVERVIEW */}
        {tab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard label="Total de Votos" value={totalVotes.toLocaleString('pt-PT')} icon={Database} color="#3b82f6" sub="↑ em tempo real" />
              <StatCard label="Com Geolocalização" value="96.1%" icon={MapPin} color="#10b981" sub="dos votos capturados" />
              <StatCard label="Eleitores Ativos" value="523" icon={Users} color="#c8d96f" sub="online agora" />
              <StatCard label="Votos / Hora" value="27.5k" icon={Zap} color="#f59e0b" sub="taxa atual" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white/8 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-white">Votos por Hora</h3>
                  <span className="text-xs text-gray-500">Hoje, 7 maio 2026</span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={voteChartData}>
                    <defs>
                      <linearGradient id="voteGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#c8d96f" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#c8d96f" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ background: '#0a2a35', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', fontSize: '12px' }}
                      labelStyle={{ color: '#c8d96f' }}
                    />
                    <Area type="monotone" dataKey="votos" stroke="#c8d96f" fill="url(#voteGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white/8 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Activity size={15} className="text-[#c8d96f]" />
                  <h3 className="text-white">Feed em Tempo Real</h3>
                </div>
                <div className="space-y-3 max-h-52 overflow-y-auto">
                  <AnimatePresence>
                    {liveLog.slice(0, 8).map((entry) => {
                      const Icon = entry.icon;
                      return (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-start gap-2.5 text-xs"
                        >
                          <Icon size={13} className={`${entry.color} flex-shrink-0 mt-0.5`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-300 truncate">{entry.message}</p>
                            <p className="text-gray-600">{entry.time}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Districts grid */}
            <div className="mt-6 bg-white/8 border border-white/10 rounded-2xl p-6">
              <h3 className="text-white mb-5">Participação por Distrito</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {districts.map((d) => {
                  const maxVotes = Math.max(...districts.map((x) => x.votes));
                  const pct = (d.votes / maxVotes) * 100;
                  return (
                    <div key={d.name} className="bg-white/5 border border-white/8 rounded-xl p-3 text-center hover:border-[#c8d96f]/30 transition-colors">
                      <div
                        className={`w-2 h-2 rounded-full mx-auto mb-2 ${
                          d.status === 'online' ? 'bg-green-400' : d.status === 'warning' ? 'bg-amber-400' : 'bg-red-400'
                        }`}
                      />
                      <p className="text-xs text-white mb-1 truncate">{d.name}</p>
                      <p className="text-[#c8d96f] text-xs">{(d.votes / 1000).toFixed(0)}k</p>
                      <div className="mt-2 h-1 bg-white/8 rounded-full overflow-hidden">
                        <div className="h-full bg-[#c8d96f]/60 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* VOTOS */}
        {tab === 'votos' && (
          <motion.div key="votos" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white/8 border border-white/10 rounded-2xl p-6 overflow-x-auto">
              <div className="flex items-center gap-2 mb-6">
                <Database size={16} className="text-[#c8d96f]" />
                <h2 className="text-white">Votos Recentes</h2>
                <span className="ml-auto text-xs text-gray-500">{recentVotes.length} registos</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-gray-500">
                    <th className="text-left pb-3 pr-4">ID</th>
                    <th className="text-left pb-3 pr-4">Eleitor</th>
                    <th className="text-left pb-3 pr-4">Data/Hora</th>
                    <th className="text-left pb-3 pr-4">Distrito</th>
                    <th className="text-left pb-3 pr-4 hidden md:table-cell">Coordenadas</th>
                    <th className="text-left pb-3">Status Geo</th>
                  </tr>
                </thead>
                <tbody>
                  {recentVotes.map((v) => (
                    <tr key={v.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 pr-4 font-mono text-gray-400 text-xs">#{v.id.toString().padStart(4, '0')}</td>
                      <td className="py-4 pr-4 text-gray-300 font-mono text-xs">{v.voter}</td>
                      <td className="py-4 pr-4 text-gray-400 text-xs">
                        {new Date(v.timestamp).toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="py-4 pr-4 text-gray-300">{v.district}</td>
                      <td className="py-4 pr-4 font-mono text-xs text-gray-500 hidden md:table-cell">
                        {v.location ? `${v.location.latitude.toFixed(4)}°, ${v.location.longitude.toFixed(4)}°` : 'N/A'}
                      </td>
                      <td className="py-4">
                        {v.location ? (
                          <span className="inline-flex items-center gap-1.5 bg-green-500/15 border border-green-500/25 text-green-400 px-2.5 py-1 rounded-lg text-xs">
                            <MapPin size={11} /> Capturado (±{v.location.accuracy}m)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-gray-500/15 text-gray-500 px-2.5 py-1 rounded-lg text-xs">
                            Não capturado
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* GEO */}
        {tab === 'geo' && (
          <motion.div key="geo" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/8 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white mb-4 flex items-center gap-2">
                  <MapPin size={16} className="text-[#c8d96f]" /> Localização Atual do Administrador
                </h3>
                <GeolocationStatus showDetails={true} />
              </div>
              <div className="bg-white/8 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white mb-4 flex items-center gap-2">
                  <TrendingUp size={16} className="text-[#c8d96f]" /> Estatísticas de Geolocalização
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Votos com geolocalização', value: '96.1%', color: '#10b981' },
                    { label: 'Precisão média', value: '±18m', color: '#3b82f6' },
                    { label: 'Permissão negada', value: '3.9%', color: '#ef4444' },
                    { label: 'Timeout', value: '0.2%', color: '#f59e0b' },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-gray-400">{item.label}</span>
                        <span className="text-white">{item.value}</span>
                      </div>
                      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ backgroundColor: item.color, width: item.label.includes('geolocalização') ? '96.1%' : item.label.includes('negada') ? '3.9%' : item.label.includes('média') ? '60%' : '10%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/8 border border-white/10 rounded-2xl p-6 lg:col-span-2">
                <h3 className="text-white mb-5 flex items-center gap-2">
                  <Shield size={16} className="text-[#c8d96f]" /> Privacidade e Conformidade RGPD
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: 'Separação de dados', desc: 'A geolocalização é armazenada separadamente do voto para garantir anonimato absoluto.', ok: true },
                    { title: 'Encriptação', desc: 'Coordenadas cifradas com AES-256 antes de persistência. Chaves rotativas a cada 24h.', ok: true },
                    { title: 'Minimização de dados', desc: 'Apenas latitude, longitude e precisão são armazenados — sem altitude ou velocidade.', ok: true },
                    { title: 'Direito ao esquecimento', desc: 'Dados de geolocalização eliminados automaticamente após o período de auditoria.', ok: true },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
                      <CheckCircle size={16} className="text-[#c8d96f] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white text-sm mb-1">{item.title}</p>
                        <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* SISTEMA */}
        {tab === 'sistema' && (
          <motion.div key="sistema" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/8 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white mb-5 flex items-center gap-2">
                  <Server size={16} className="text-[#c8d96f]" /> Estado dos Serviços
                </h3>
                <div className="space-y-3">
                  {systemHealth.map((s) => (
                    <div key={s.label} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          s.status === 'online' ? 'bg-green-400 animate-pulse' :
                          s.status === 'warning' ? 'bg-amber-400 animate-pulse' : 'bg-red-400'
                        }`} />
                        <span className="text-sm text-gray-300">{s.label}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{s.uptime}</span>
                        <span className="text-gray-400">{s.latency}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          s.status === 'online' ? 'bg-green-500/15 text-green-400' :
                          s.status === 'warning' ? 'bg-amber-500/15 text-amber-400' : 'bg-red-500/15 text-red-400'
                        }`}>
                          {s.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/8 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white mb-5 flex items-center gap-2">
                  <Lock size={16} className="text-[#c8d96f]" /> Segurança
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Tentativas inválidas (24h)', value: '23', color: '#f59e0b', icon: AlertTriangle },
                    { label: 'IPs bloqueados', value: '4', color: '#ef4444', icon: Shield },
                    { label: 'Auditorias pendentes', value: '0', color: '#10b981', icon: CheckCircle },
                    { label: 'Certificado SSL', value: 'Válido (127 dias)', color: '#3b82f6', icon: Lock },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 text-sm text-gray-400">
                          <Icon size={14} style={{ color: item.color }} />
                          <span>{item.label}</span>
                        </div>
                        <span className="text-sm text-white">{item.value}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <CheckCircle size={15} />
                    <span>Nenhum incidente crítico ativo</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* LOGS */}
        {tab === 'logs' && (
          <motion.div key="logs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white/8 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-[#c8d96f]" />
                  <h2 className="text-white">Log de Atividade do Sistema</h2>
                </div>
                <div className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg">
                  <Clock size={11} />
                  <span>Em tempo real</span>
                </div>
              </div>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                <AnimatePresence>
                  {liveLog.map((entry) => {
                    const Icon = entry.icon;
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-3 bg-white/5 hover:bg-white/8 border border-white/5 rounded-xl px-4 py-3 transition-colors"
                      >
                        <Icon size={14} className={`${entry.color} flex-shrink-0 mt-0.5`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-300 text-sm">{entry.message}</p>
                        </div>
                        <span className="text-gray-600 text-xs flex-shrink-0 font-mono">{entry.time}</span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
