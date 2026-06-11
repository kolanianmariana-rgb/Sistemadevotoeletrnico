import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  voterId: string | null;
  hasVoted: boolean;
  login: (id: string, pin: string) => boolean;
  logout: () => void;
  markVoted: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [voterId, setVoterId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const login = (id: string, pin: string): boolean => {
    // Simulated auth — any 6-digit id + 4-digit pin
    if (id.length >= 4 && pin.length >= 4) {
      setIsAuthenticated(true);
      setVoterId(id);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setVoterId(null);
  };

  const markVoted = () => setHasVoted(true);

  return (
    <AuthContext.Provider value={{ isAuthenticated, voterId, hasVoted, login, logout, markVoted }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
