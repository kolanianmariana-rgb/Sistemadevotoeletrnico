import { NavLink, useNavigate } from 'react-router';
import { Menu, X, LogOut, User, Radio, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/', label: 'Início', end: true },
  { to: '/resultados', label: 'Resultados', end: false },
  { to: '/assistencia', label: 'Assistência', end: false },
  { to: '/sobre', label: 'Sobre', end: false },
];

function ElectionBadge() {
  const [pulse, setPulse] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setPulse((p) => !p), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="hidden lg:flex items-center gap-2 bg-[#c8d96f]/10 border border-[#c8d96f]/30 px-3 py-1 rounded-full">
      <span
        className={`w-2 h-2 rounded-full bg-[#c8d96f] transition-opacity duration-500 ${pulse ? 'opacity-100' : 'opacity-30'}`}
      />
      <span className="text-[#c8d96f] text-xs">Votação em Curso</span>
    </div>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, voterId, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-all px-3 py-1.5 rounded-lg text-sm ${
      isActive
        ? 'text-[#c8d96f] bg-white/10'
        : 'text-gray-300 hover:text-[#c8d96f] hover:bg-white/5'
    }`;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0d3440]/95 backdrop-blur-md shadow-2xl'
          : 'bg-[#0d3440]'
      }`}
    >
      <div className="container mx-auto px-4 py-1">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <NavLink to="/" className="flex items-center flex-shrink-0">
            <Logo className="h-24 w-auto md:h-28" tolerance={45} />
          </NavLink>

          <ElectionBadge />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Auth Area */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/votar"
                  className="bg-[#c8d96f]/10 border border-[#c8d96f]/30 text-[#c8d96f] px-3 py-2 rounded-lg text-sm hover:bg-[#c8d96f]/20 transition-colors flex items-center gap-2"
                >
                  <User size={15} />
                  <span>{voterId}</span>
                </NavLink>
                <NavLink
                  to="/votar"
                  className="bg-[#c8d96f] text-[#0d3440] px-4 py-2 rounded-lg text-sm hover:bg-[#d4e07f] transition-colors flex items-center gap-1.5"
                >
                  <Radio size={14} />
                  Votar
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-white/5"
                  title="Terminar sessão"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/admin"
                  className="text-gray-400 hover:text-[#c8d96f] transition-colors p-2 rounded-lg hover:bg-white/5"
                  title="Administração"
                >
                  <LayoutDashboard size={16} />
                </NavLink>
                <NavLink
                  to="/login"
                  className="bg-[#c8d96f] text-[#0d3440] px-5 py-2 rounded-lg text-sm hover:bg-[#d4e07f] transition-colors"
                >
                  Entrar para Votar
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 hover:bg-[#1a5968] rounded-lg transition-colors"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="md:hidden mt-1 pb-4 flex flex-col gap-1 border-t border-white/10 pt-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-2 pt-2 border-t border-white/10 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/votar"
                    onClick={() => setMenuOpen(false)}
                    className="bg-[#c8d96f] text-[#0d3440] px-4 py-2 rounded-lg text-sm text-center flex items-center justify-center gap-2"
                  >
                    <Radio size={14} /> Votar Agora
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="text-red-400 text-sm flex items-center justify-center gap-2 py-2"
                  >
                    <LogOut size={14} /> Terminar Sessão
                  </button>
                </>
              ) : (
                <NavLink
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="bg-[#c8d96f] text-[#0d3440] px-4 py-2 rounded-lg text-sm text-center"
                >
                  Entrar para Votar
                </NavLink>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
