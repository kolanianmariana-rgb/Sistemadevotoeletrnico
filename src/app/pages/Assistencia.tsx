import { useState } from 'react';
import { MessageCircle, ChevronDown, Phone, Mail, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const faqs = [
  {
    q: 'Como posso votar pelo SOVE?',
    a: 'Para votar, clique em "Entrar para Votar" no topo da página, introduza o seu Número de Eleitor e PIN pessoal, e siga os 4 passos do processo de votação. O voto é encriptado e anónimo.',
  },
  {
    q: 'Esqueci o meu PIN. O que fazer?',
    a: 'Contacte a linha de apoio ao eleitor através do +351 210 000 000 (disponível das 8h às 22h) ou aceda aos balcões de atendimento das Juntas de Freguesia com o seu Cartão de Cidadão.',
  },
  {
    q: 'O meu voto é realmente anónimo?',
    a: 'Sim. O sistema utiliza criptografia de ponta a ponta e separação total entre identidade e voto. Nem mesmo os administradores do sistema conseguem associar um voto a um eleitor específico.',
  },
  {
    q: 'Posso votar a partir do estrangeiro?',
    a: 'Sim. O SOVE foi desenvolvido para permitir a participação de eleitores registados em qualquer parte do mundo, desde que possuam acesso à internet.',
  },
  {
    q: 'O que acontece se a minha ligação cair durante o voto?',
    a: 'O sistema garante que apenas votos completamente confirmados são registados. Se a ligação cair antes da confirmação final, o voto não é submetido e pode tentar novamente.',
  },
  {
    q: 'Posso verificar se o meu voto foi registado?',
    a: 'Sim. Após votar, receberá um código de verificação único. Este código pode ser utilizado para confirmar o registo do voto sem revelar o conteúdo da sua escolha.',
  },
  {
    q: 'A geolocalização é obrigatória?',
    a: 'Não. A geolocalização é utilizada para fins de auditoria e deteção de fraude, mas pode recusar a permissão e ainda assim votar normalmente. O voto nunca é bloqueado por ausência de localização.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/5 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="text-gray-200 text-sm">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="text-[#c8d96f] flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 text-gray-400 text-sm leading-relaxed border-t border-white/8 pt-3">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Assistencia() {
  const [activeSection, setActiveSection] = useState<'chat' | 'faq'>('faq');

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 bg-[#c8d96f]/15 rounded-xl flex items-center justify-center">
          <MessageCircle className="text-[#c8d96f]" size={22} />
        </div>
        <div>
          <h1 className="text-3xl text-white">Assistência</h1>
          <p className="text-gray-400 text-sm">Disponível 24/7 para responder às suas dúvidas</p>
        </div>
      </div>

      {/* Quick contacts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Phone, label: 'Linha de Apoio', value: '+351 210 000 000', sub: 'Seg–Dom, 8h–22h', color: '#10b981' },
          { icon: Mail, label: 'Email', value: 'suporte@sove.gov.pt', sub: 'Resposta em < 2h', color: '#3b82f6' },
          { icon: Clock, label: 'Chat em Direto', value: 'Disponível agora', sub: 'Tempo médio: 2 min', color: '#c8d96f' },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-white/8 border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:border-white/20 transition-colors">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: c.color + '22' }}>
                <Icon size={20} style={{ color: c.color }} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">{c.label}</p>
                <p className="text-sm text-white">{c.value}</p>
                <p className="text-xs text-gray-500">{c.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 mb-6 w-fit">
        <button
          onClick={() => setActiveSection('faq')}
          className={`px-5 py-2 rounded-lg text-sm transition-all ${activeSection === 'faq' ? 'bg-[#c8d96f] text-[#0d3440]' : 'text-gray-400 hover:text-white'}`}
        >
          Perguntas Frequentes
        </button>
        <button
          onClick={() => setActiveSection('chat')}
          className={`px-5 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${activeSection === 'chat' ? 'bg-[#c8d96f] text-[#0d3440]' : 'text-gray-400 hover:text-white'}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Chat Virtual
        </button>
      </div>

      {activeSection === 'faq' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="space-y-2">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
          <div className="mt-6 bg-[#c8d96f]/8 border border-[#c8d96f]/20 rounded-2xl p-5 flex items-start gap-3">
            <CheckCircle size={16} className="text-[#c8d96f] flex-shrink-0 mt-0.5" />
            <p className="text-gray-400 text-sm">
              Não encontrou a resposta que procurava? Use o <button onClick={() => setActiveSection('chat')} className="text-[#c8d96f] hover:underline">Chat Virtual</button> para falar com o assistente ou contacte-nos diretamente.
            </p>
          </div>
        </motion.div>
      )}

      {activeSection === 'chat' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-white/5">
              <div className="relative">
                <div className="w-9 h-9 bg-[#c8d96f]/20 rounded-full flex items-center justify-center">
                  <MessageCircle size={16} className="text-[#c8d96f]" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0d3440]" />
              </div>
              <div>
                <p className="text-sm text-white">SOVE Assistente Virtual</p>
                <p className="text-xs text-green-400">Online agora</p>
              </div>
            </div>
            <div style={{ height: '540px' }}>
              <iframe
                src="https://landbot.online/v3/H-3385931-GT68F8WY40D3RHQ5/index.html"
                title="SOVE Assistente Virtual"
                width="100%"
                height="100%"
                style={{ border: 'none', display: 'block' }}
                allow="microphone; camera"
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
