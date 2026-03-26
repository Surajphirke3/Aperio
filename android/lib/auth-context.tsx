import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken, clearAuthToken } from './api';

export type UserRole = "customer" | "regulator" | "partner";

export interface User {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  signup: (name: string, email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USERS: Record<UserRole, User> = {
  customer: { name: "Alex Customer", email: "alex@aperio.app", role: "customer" },
  regulator: { name: "Jordan Regulator", email: "jordan@epa.gov", role: "regulator" },
  partner: { name: "Sam Partner", email: "sam@greencycle.co", role: "partner" },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from storage on mount
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user_data');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error('Failed to load user', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = useCallback(async (email: string, password: string, role: UserRole = "customer") => {
    // Mock login logic
    const loggedInUser = MOCK_USERS[role];
    setUser(loggedInUser);
    await AsyncStorage.setItem('user_data', JSON.stringify(loggedInUser));
    // Simulate setting a real token
    await setAuthToken(`mock_token_${Date.now()}`);
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string, role: UserRole = "customer") => {
    const newUser = { name, email, role };
    setUser(newUser);
    await AsyncStorage.setItem('user_data', JSON.stringify(newUser));
    await setAuthToken(`mock_token_${Date.now()}`);
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem('user_data');
    await clearAuthToken();
  }, []);

  const switchRole = useCallback(async (role: UserRole) => {
    const switchedUser = MOCK_USERS[role];
    setUser(switchedUser);
    await AsyncStorage.setItem('user_data', JSON.stringify(switchedUser));
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}