import { Shield, Lock, Globe, Users, FileText, CheckCircle, Code2, Database, Eye } from 'lucide-react';
import { motion } from 'motion/react';

const team = [
  { name: 'Mariana Zotarelli', role: 'Arquiteta de Sistemas', initials: 'MZ', color: '#10b981' },
  { name: 'Francisco Veigas', role: 'Diretor de Segurança', initials: 'FV', color: '#3b82f6' },
  { name: 'Francisco Leitão', role: 'Engenharia de Software', initials: 'FL', color: '#c8d96f' },
];

const certs = [
  { icon: Shield, title: 'ISO/IEC 27001', desc: 'Segurança da Informação' },
  { icon: Lock, title: 'RGPD Compliant', desc: 'Proteção de Dados (UE)' },
  { icon: FileText, title: 'Auditoria Anual', desc: 'Entidade certificada independente' },
  { icon: Globe, title: 'eIDAS', desc: 'Identificação eletrónica (UE)' },
];

const timeline = [
  { year: '2023', title: 'Projeto aprovado', desc: 'Assembleia da República aprova desenvolvimento de plataforma de voto eletrónico.' },
  { year: '2024', title: 'Desenvolvimento', desc: 'Equipa formada, arquitetura desenhada e primeiros protótipos testados.' },
  { year: '2025', title: 'Testes e auditoria', desc: 'Pilotos em 3 municípios. Auditoria de segurança independente aprovada.' },
  { year: '2026', title: 'Lançamento nacional', desc: 'Eleições Nacionais 2026 — primeira utilização nacional do SOVE.' },
];

const techStack = [
  { icon: Code2, title: 'Frontend', desc: 'React 18 + TypeScript com criptografia client-side. Interface acessível (WCAG 2.1 AA).' },
  { icon: Shield, title: 'Criptografia', desc: 'AES-256 para encriptação, RSA-4096 para troca de chaves, SHA-3 para integridade.' },
  { icon: Database, title: 'Infraestrutura', desc: 'Servidores distribuídos em data centers certificados PT, redundância 99.99%.' },
  { icon: Eye, title: 'Blockchain', desc: 'Ledger imutável regista cada operação. Qualquer eleitor pode verificar o seu voto.' },
];

export function Sobre() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Hero */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 bg-[#c8d96f]/10 border border-[#c8d96f]/25 text-[#c8d96f] px-4 py-1.5 rounded-full text-sm mb-5">
          <Globe size={14} /> Sistema de Voto Eletrónico de Portugal
        </div>
        <h1 className="text-5xl mb-5 text-white">Sobre o SOVE</h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
          O Sistema de Voto Eletrónico (SOVE) é a plataforma oficial de voto digital de Portugal,
          desenvolvida com os mais altos padrões de segurança e transparência democrática.
        </p>
      </motion.div>

      {/* Mission & Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <motion.div
          className="bg-white/8 border border-white/10 rounded-2xl p-8"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-xl text-[#c8d96f] mb-4">A Nossa Missão</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Democratizar o acesso ao voto através da tecnologia, garantindo que cada eleitor possa
            exercer o seu direito democrático de forma simples, segura e acessível,
            independentemente da sua localização geográfica.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Fundado em 2024, o SOVE é fruto de uma parceria entre a Assembleia da República e as
            principais instituições tecnológicas nacionais.
          </p>
        </motion.div>

        <motion.div
          className="bg-white/8 border border-white/10 rounded-2xl p-8"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-xl text-[#c8d96f] mb-5">Os Nossos Valores</h2>
          <ul className="space-y-3.5">
            {[
              { label: 'Transparência', desc: 'Todos os processos são auditáveis e verificáveis publicamente.' },
              { label: 'Segurança', desc: 'Criptografia de nível militar protege cada voto individual.' },
              { label: 'Acessibilidade', desc: 'Disponível para todos, em qualquer dispositivo.' },
              { label: 'Privacidade', desc: 'Anonimato total e conformidade plena com o RGPD.' },
            ].map((v) => (
              <li key={v.label} className="flex items-start gap-3">
                <CheckCircle size={16} className="text-[#c8d96f] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-white text-sm">{v.label}</span>
                  <span className="text-gray-500 text-sm"> — {v.desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Timeline */}
      <div className="mb-16">
        <h2 className="text-3xl text-center text-white mb-10">História</h2>
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-[#c8d96f]/20 -translate-x-1/2" />
          <div className="space-y-8">
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                className={`relative flex flex-col md:flex-row gap-4 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <div className="flex-1 pl-12 md:pl-0">
                  <div className={`bg-white/8 border border-white/10 rounded-2xl p-5 ${i % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                    <span className="text-[#c8d96f] text-sm">{item.year}</span>
                    <h3 className="text-white mt-1 mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
                <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-[#c8d96f] rounded-full -translate-x-1/2 mt-5 md:mt-5 ring-4 ring-[#0d3440]" />
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="mb-16">
        <h2 className="text-3xl text-center text-white mb-8">Certificações</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {certs.map((c, i) => (
            <motion.div
              key={c.title}
              className="bg-white/8 border border-white/10 rounded-2xl p-6 text-center hover:border-[#c8d96f]/30 hover:bg-white/12 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -3 }}
            >
              <div className="w-12 h-12 bg-[#c8d96f]/15 border border-[#c8d96f]/25 rounded-xl flex items-center justify-center mx-auto mb-4">
                <c.icon className="text-[#c8d96f]" size={22} />
              </div>
              <h3 className="text-[#c8d96f] text-sm mb-1">{c.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tech */}
      <div className="mb-16">
        <h2 className="text-3xl text-center text-white mb-8">Tecnologia</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {techStack.map((t, i) => (
            <motion.div
              key={t.title}
              className="bg-white/8 border border-white/10 rounded-2xl p-6 flex items-start gap-4"
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-10 h-10 bg-[#c8d96f]/15 rounded-xl flex items-center justify-center flex-shrink-0">
                <t.icon size={20} className="text-[#c8d96f]" />
              </div>
              <div>
                <h3 className="text-white mb-1.5">{t.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{t.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="mb-16">
        <h2 className="text-3xl text-center text-white mb-8">Equipa</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-2xl mx-auto">
          {team.map((t, i) => (
            <motion.div
              key={t.name}
              className="bg-white/8 border border-white/10 rounded-2xl p-6 text-center hover:border-white/20 transition-all"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border"
                style={{ backgroundColor: t.color + '22', borderColor: t.color + '44' }}
              >
                <span className="text-lg" style={{ color: t.color }}>{t.initials}</span>
              </div>
              <p className="text-white text-sm mb-1">{t.name}</p>
              <p className="text-gray-500 text-xs">{t.role}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <motion.div
        className="bg-gradient-to-br from-[#c8d96f]/10 to-[#0d3440] border border-[#c8d96f]/20 rounded-3xl p-10 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="w-14 h-14 bg-[#c8d96f]/15 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Users className="text-[#c8d96f]" size={28} />
        </div>
        <h2 className="text-2xl text-white mb-3">Contacte-nos</h2>
        <p className="text-gray-400 mb-7 max-w-md mx-auto">
          Para questões institucionais, parcerias estratégicas ou suporte técnico especializado.
        </p>
        <div className="flex flex-wrap gap-6 justify-center text-sm text-gray-400">
          <a href="mailto:suporte@sove.gov.pt" className="flex items-center gap-2 hover:text-[#c8d96f] transition-colors">
            ✉️ suporte@sove.gov.pt
          </a>
          <span className="flex items-center gap-2">📞 +351 210 000 000</span>
          <span className="flex items-center gap-2">🏢 Lisboa, Portugal</span>
        </div>
      </motion.div>
    </div>
  );
}
