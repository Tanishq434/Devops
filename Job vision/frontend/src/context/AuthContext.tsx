import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '@/types';
import { authAPI } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // In a real app, you'd verify the token and fetch user data
      // For now, we'll just check if it exists
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { user, token } = await authAPI.login(email, password);
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const signup = async (email: string, password: string, name: string) => {
    const { user, token } = await authAPI.signup(email, password, name);
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
