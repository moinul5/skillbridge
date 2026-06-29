import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { auth as firebaseAuth } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export interface AuthUser {
  uid: string;
  email: string;
  name: string;
  role: 'user' | 'manager' | 'admin';
  avatarUrl?: string;
  phoneNumber?: string;
  preferences?: {
    interests?: string[];
    budget?: 'budget' | 'moderate' | 'luxury';
    travelStyle?: string;
  };
  createdAt?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  loginWithGoogle: () => Promise<AuthUser>;
  register: (email: string, password: string, name: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Setup Axios default authorization header on token change
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('tm_token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('tm_token');
    }
  }, [token]);

  // Synchronize authentication state
  useEffect(() => {
    // 1. Check for stored mock user session
    const storedToken = localStorage.getItem('tm_token');
    const storedUser = localStorage.getItem('tm_user');

    const restoreMockSession = () => {
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    if (firebaseAuth) {
      // Firebase listener
      const unsubscribe = onAuthStateChanged(firebaseAuth, async (fbUser) => {
        if (fbUser) {
          try {
            const idToken = await fbUser.getIdToken();
            setToken(idToken);
            
            // Get user profile details from Express API
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/me`, {
              headers: { Authorization: `Bearer ${idToken}` }
            });
            
            setUser(response.data.data);
            localStorage.setItem('tm_user', JSON.stringify(response.data.data));
          } catch (error) {
            console.error('Error fetching Firebase user profile from backend:', error);
            restoreMockSession();
          }
        } else {
          setUser(null);
          setToken(null);
          localStorage.removeItem('tm_user');
          setLoading(false);
        }
      });
      return () => unsubscribe();
    } else {
      // Fallback: Local Session Restore
      restoreMockSession();
    }
  }, []);

  const login = async (email: string, password: string): Promise<AuthUser> => {
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    try {
      if (firebaseAuth) {
        // Firebase Login
        const credentials = await signInWithEmailAndPassword(firebaseAuth, email, password);
        const idToken = await credentials.user.getIdToken();
        setToken(idToken);
        const res = await axios.get(`${apiUrl}/users/me`, {
          headers: { Authorization: `Bearer ${idToken}` }
        });
        const profile = res.data.data;
        setUser(profile);
        localStorage.setItem('tm_user', JSON.stringify(profile));
        setLoading(false);
        return profile;
      } else {
        // Mock Login Flow
        let mockToken = 'mock_user';
        if (email === 'admin@travelmate.ai' && password === 'DemoAdmin123!') {
          mockToken = 'mock_admin';
        } else if (email === 'manager@travelmate.ai' && password === 'DemoManager123!') {
          mockToken = 'mock_manager';
        } else if (email === 'user@travelmate.ai' && password === 'DemoUser123!') {
          mockToken = 'mock_user';
        } else {
          mockToken = `mock_${email.split('@')[0]}`;
        }

        setToken(mockToken);
        const res = await axios.get(`${apiUrl}/users/me`, {
          headers: { Authorization: `Bearer ${mockToken}` }
        });
        const profile = res.data.data;
        setUser(profile);
        localStorage.setItem('tm_user', JSON.stringify(profile));
        setLoading(false);
        return profile;
      }
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const loginWithGoogle = async (): Promise<AuthUser> => {
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    try {
      if (firebaseAuth) {
        // Firebase Google Sign-In
        const provider = new GoogleAuthProvider();
        const credentials = await signInWithPopup(firebaseAuth, provider);
        const idToken = await credentials.user.getIdToken();
        setToken(idToken);
        
        const res = await axios.get(`${apiUrl}/users/me`, {
          headers: { Authorization: `Bearer ${idToken}` }
        });
        const profile = res.data.data;
        setUser(profile);
        localStorage.setItem('tm_user', JSON.stringify(profile));
        setLoading(false);
        return profile;
      } else {
        // Fallback Mock Google Sign-In
        const mockToken = 'mock_google_user';
        setToken(mockToken);
        const res = await axios.get(`${apiUrl}/users/me`, {
          headers: { Authorization: `Bearer ${mockToken}` }
        });
        const profile = res.data.data;
        setUser(profile);
        localStorage.setItem('tm_user', JSON.stringify(profile));
        setLoading(false);
        return profile;
      }
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<AuthUser> => {
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    try {
      if (firebaseAuth) {
        // Firebase Registration
        const credentials = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        const idToken = await credentials.user.getIdToken();
        setToken(idToken);
        
        // Wait briefly for server account generation
        const res = await axios.get(`${apiUrl}/users/me`, {
          headers: { Authorization: `Bearer ${idToken}` }
        });
        const profile = await updateProfileAPI(idToken, { name }, apiUrl);
        setUser(profile);
        localStorage.setItem('tm_user', JSON.stringify(profile));
        setLoading(false);
        return profile;
      } else {
        // Mock Registration
        const mockToken = `mock_${email.split('@')[0]}`;
        setToken(mockToken);
        
        // Pull/Initialize profile on server
        await axios.get(`${apiUrl}/users/me`, {
          headers: { Authorization: `Bearer ${mockToken}` }
        });
        
        const profile = await updateProfileAPI(mockToken, { name }, apiUrl);
        setUser(profile);
        localStorage.setItem('tm_user', JSON.stringify(profile));
        setLoading(false);
        return profile;
      }
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const updateProfileAPI = async (activeToken: string, data: Partial<AuthUser>, apiUrl: string) => {
    const res = await axios.patch(`${apiUrl}/users/me`, data, {
      headers: { Authorization: `Bearer ${activeToken}` }
    });
    return res.data.data;
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (firebaseAuth) {
        await signOut(firebaseAuth);
      }
    } catch (err) {
      console.error('Error signing out of Firebase:', err);
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('tm_token');
    localStorage.removeItem('tm_user');
    setLoading(false);
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    if (!token) return;
    try {
      const updated = await updateProfileAPI(token, data, apiUrl);
      setUser(updated);
      localStorage.setItem('tm_user', JSON.stringify(updated));
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, loginWithGoogle, register, logout, updateProfile }}>
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
