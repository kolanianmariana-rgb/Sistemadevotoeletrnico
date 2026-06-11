import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import { BarChart2, RefreshCw, TrendingUp, Trophy, Clock } from 'lucide-react';
import { motion } from 'motion/react';

const initialResults = [
  { id: 1, name: 'Ana Ferreira', party: 'Partido da Renovação', number: '10', votes: 312450, color: '#3b82f6' },
  { id: 2, name: 'Carlos Mendes', party: 'Aliança Democrática', number: '20', votes: 278900, color: '#10b981' },
  { id: 3, name: 'Sofia Rodrigues', party: 'Movimento Cidadão', number: '30', votes: 195300, color: '#f59e0b' },
  { id: 4, name: 'Tiago Santos', party: 'Frente Popular', number: '40', votes: 143200, color: '#ef4444' },
];

const historyBase = [
  { time: '08h', ana: 12000, carlos: 9000, sofia: 7000, tiago: 5000 },
  { time: '09h', ana: 45000, carlos: 38000, sofia: 28000, tiago: 19000 },
  { time: '10h', ana: 98000, carlos: 82000, sofia: 59000, tiago: 42000 },
  { time: '11h', ana: 165000, carlos: 138000, sofia: 98000, tiago: 72000 },
  { time: '12h', ana: 218000, carlos: 183000, sofia: 128000, tiago: 95000 },
  { time: '13h', ana: 265000, carlos: 221000, sofia: 155000, tiago: 112000 },
  { time: 'Agora', ana: 312450, carlos: 278900, sofia: 195300, tiago: 143200 },
];

function formatVotes(n: number) {
  if (n >= 1000000) return (n / 1000000).toFixed(2) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toString();
}

function LiveDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
    </span>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a2a35] border border-white/20 rounded-xl p-3 text-sm shadow-xl">
        <p className="text-gray-400 mb-2 text-xs">{label}</p>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-gray-300">{formatVotes(p.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function Resultados() {
  const [results, setResults] = useState(initialResults);
  const [apuramento, setApuramento] = useState(67);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'overview' | 'historico' | 'tabela'>('overview');
  const [tick, setTick] = useState(0);

  // Live simulation: add small random votes every 3s
  useEffect(() => {
    const timer = setInterval(() => {
      setResults((prev) =>
        prev.map((r) => ({
          ...r,
          votes: r.votes + Math.floor(Math.random() * 80 + 10),
        }))
      );
      setApuramento((p) => Math.min(100, p + Math.random() * 0.3));
      setLastUpdate(new Date());
      setTick((t) => t + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const sorted = [...results].sort((a, b) => b.votes - a.votes);
  const total = results.reduce((s, r) => s + r.votes, 0);
  const pct = (v: number) => ((v / total) * 100).toFixed(1);

  const barData = results.map((r) => ({ name: r.number, fullName: r.name, votos: r.votes, fill: r.color }));
  const pieData = results.map((r) => ({ name: r.name, value: r.votes, color: r.color }));

  const tabs = [
    { key: 'overview', label: 'Visão Geral' },
    { key: 'historico', label: 'Histórico' },
    { key: 'tabela', label: 'Tabela Detalhada' },
  ] as const;

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#c8d96f]/15 rounded-xl flex items-center justify-center">
            <BarChart2 className="text-[#c8d96f]" size={22} />
          </div>
          <div>
            <h1 className="text-3xl text-white">Resultados em Tempo Real</h1>
            <p className="text-gray-400 text-sm">Eleições Nacionais 2026</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/8 border border-white/10 px-3 py-2 rounded-xl text-sm text-gray-400">
            <LiveDot />
            <span className="text-green-400 text-xs">AO VIVO</span>
          </div>
          <div className="flex items-center gap-2 bg-white/8 border border-white/10 px-3 py-2 rounded-xl text-sm text-gray-400">
            <RefreshCw size={13} className="text-[#c8d96f]" />
            <span className="text-xs">{lastUpdate.toLocaleTimeString('pt-PT', { timeStyle: 'short' })}</span>
          </div>
        </div>
      </div>

      {/* Apuramento */}
      <div className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-[#c8d96f]" size={16} />
            <span className="text-sm text-gray-300">Apuramento</span>
          </div>
          <motion.span
            key={tick}
            className="text-[#c8d96f] text-sm"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
          >
            {apuramento.toFixed(1)}%
          </motion.span>
        </div>
        <div className="h-2.5 bg-white/8 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#c8d96f] to-[#a8c040] rounded-full"
            animate={{ width: `${apuramento}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
        <p className="text-gray-500 text-xs mt-2">
          {formatVotes(total)} votos apurados · {formatVotes(Math.round(total / (apuramento / 100)))} estimados no total
        </p>
      </div>

      {/* Top candidates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {sorted.map((r, i) => (
          <motion.div
            key={r.id}
            className={`bg-white/8 backdrop-blur-sm border rounded-2xl p-5 ${
              i === 0 ? 'border-[#c8d96f]/40' : 'border-white/10'
            }`}
            layout
            transition={{ duration: 0.4 }}
          >
            {i === 0 && (
              <div className="flex items-center gap-1.5 text-[#c8d96f] text-xs mb-2">
                <Trophy size={12} />
                <span>A liderar</span>
              </div>
            )}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-sm border"
              style={{ backgroundColor: r.color + '22', borderColor: r.color + '44', color: r.color }}
            >
              {r.number}
            </div>
            <p className="text-sm text-white mb-0.5 truncate">{r.name}</p>
            <p className="text-xs text-gray-500 mb-3 truncate">{r.party}</p>
            <motion.p
              key={r.votes}
              className="text-2xl text-white"
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
            >
              {pct(r.votes)}%
            </motion.p>
            <p className="text-xs text-gray-500 mt-0.5">{formatVotes(r.votes)} votos</p>
            <div className="mt-3 h-1.5 bg-white/8 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: r.color }}
                animate={{ width: `${pct(r.votes)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 mb-6 w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === t.key
                ? 'bg-[#c8d96f] text-[#0d3440]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-base text-white mb-5">Votos por Candidato</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => formatVotes(v)}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="votos" radius={[8, 8, 0, 0]}>
                  {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-base text-white mb-4">Distribuição</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [formatVotes(value), 'Votos']}
                  contentStyle={{ background: '#0a2a35', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px' }}
                  labelStyle={{ color: '#c8d96f' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-3">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center gap-2.5 text-xs text-gray-400">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="truncate flex-1">{d.name}</span>
                  <span className="text-white ml-auto">{pct(d.value)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'historico' && (
        <div className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock size={16} className="text-[#c8d96f]" />
            <h3 className="text-base text-white">Evolução ao Longo do Dia</h3>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={historyBase} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                {results.map((r) => (
                  <linearGradient key={r.id} id={`grad-${r.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={r.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={r.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatVotes} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="ana" stroke="#3b82f6" fill="url(#grad-1)" strokeWidth={2} />
              <Area type="monotone" dataKey="carlos" stroke="#10b981" fill="url(#grad-2)" strokeWidth={2} />
              <Area type="monotone" dataKey="sofia" stroke="#f59e0b" fill="url(#grad-3)" strokeWidth={2} />
              <Area type="monotone" dataKey="tiago" stroke="#ef4444" fill="url(#grad-4)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-4 mt-4">
            {results.map((r) => (
              <div key={r.id} className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-3 h-0.5 rounded" style={{ backgroundColor: r.color }} />
                <span>{r.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'tabela' && (
        <div className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-white/10">
                <th className="text-left pb-3 pr-4">Pos.</th>
                <th className="text-left pb-3 pr-4">Nº</th>
                <th className="text-left pb-3 pr-4">Candidato</th>
                <th className="text-left pb-3 pr-4 hidden sm:table-cell">Partido</th>
                <th className="text-right pb-3 pr-4">Votos</th>
                <th className="text-right pb-3">%</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r, i) => (
                <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 pr-4 text-gray-500">{i + 1}º</td>
                  <td className="py-4 pr-4">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs border"
                      style={{ backgroundColor: r.color + '22', borderColor: r.color + '44', color: r.color }}
                    >
                      {r.number}
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-white">{r.name}</td>
                  <td className="py-4 pr-4 text-gray-400 hidden sm:table-cell">{r.party}</td>
                  <td className="py-4 pr-4 text-right text-white font-mono">{r.votes.toLocaleString('pt-PT')}</td>
                  <td className="py-4 text-right">
                    <span className="text-[#c8d96f]">{pct(r.votes)}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-white/20 text-gray-400">
                <td colSpan={4} className="pt-3 text-xs">Total apurado</td>
                <td className="pt-3 text-right text-white font-mono text-xs">{total.toLocaleString('pt-PT')}</td>
                <td className="pt-3 text-right text-[#c8d96f] text-xs">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
