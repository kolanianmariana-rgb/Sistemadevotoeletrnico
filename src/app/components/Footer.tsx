import { Link } from 'react-router';
import { Shield, Lock, FileText, Heart } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="bg-[#0a2a35] border-t border-white/8 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Logo className="h-20 w-auto mb-4" tolerance={45} />
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Sistema de Voto Eletrónico oficial de Portugal — seguro, transparente e acessível
              a todos os eleitores desde 2026.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[
                { icon: Shield, label: 'ISO 27001' },
                { icon: Lock, label: 'RGPD' },
                { icon: FileText, label: 'eIDAS' },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-lg text-xs text-gray-500"
                >
                  <Icon size={11} className="text-[#c8d96f]" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div>
            <h4 className="text-[#c8d96f] text-sm mb-4">Segurança</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { icon: Shield, text: 'Criptografia AES-256' },
                { icon: Lock, text: 'Anonimato garantido' },
                { icon: FileText, text: 'Auditoria independente' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2">
                  <Icon size={13} className="text-[#c8d96f] flex-shrink-0" />
                  <span className="text-gray-500">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav */}
          <div>
            <h4 className="text-[#c8d96f] text-sm mb-4">Plataforma</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: '/', label: 'Início' },
                { to: '/votar', label: 'Votar' },
                { to: '/resultados', label: 'Resultados ao Vivo' },
                { to: '/assistencia', label: 'Assistência' },
                { to: '/sobre', label: 'Sobre o SOVE' },
                { to: '/admin', label: 'Painel Admin' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-gray-500 hover:text-[#c8d96f] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>© 2026 SOVE — Todos os direitos reservados.</p>
          <p className="flex items-center gap-1.5">
            Desenvolvido com <Heart size={11} className="text-[#c8d96f]" /> para a democracia portuguesa
          </p>
        </div>
      </div>
    </footer>
  );
}
