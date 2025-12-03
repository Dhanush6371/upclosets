// import { createContext, useContext, useState, ReactNode } from 'react';
// import { User, Department } from '../types';
// import { demoUsers } from '../data/demoData';

// interface AuthContextType {
//   user: User | null;
//   login: (email: string, password: string, department: Department) => boolean;
//   register: (email: string, password: string, department: Department) => boolean;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Key for storing registered users in localStorage
// const REGISTERED_USERS_KEY = 'registeredUsers';

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);

//   // Get registered users from localStorage
//   const getRegisteredUsers = (): Record<string, { password: string; department: Department }> => {
//     if (typeof window === 'undefined') return {};
//     try {
//       return JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '{}');
//     } catch {
//       return {};
//     }
//   };

//   // Save registered users to localStorage
//   const saveRegisteredUsers = (users: Record<string, { password: string; department: Department }>) => {
//     if (typeof window !== 'undefined') {
//       localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
//     }
//   };

//   const login = (email: string, password: string, department: Department): boolean => {
//     // Check demo users first
//     const userCredentials = demoUsers[email as keyof typeof demoUsers];
//     if (userCredentials && userCredentials.password === password && userCredentials.department === department) {
//       setUser({ email, department });
//       return true;
//     }

//     // Check registered users
//     const registeredUsers = getRegisteredUsers();
//     const registeredUser = registeredUsers[email];
    
//     if (registeredUser && registeredUser.password === password && registeredUser.department === department) {
//       setUser({ email, department });
//       return true;
//     }

//     return false;
//   };

//   const register = (email: string, password: string, department: Department): boolean => {
//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return false;
//     }

//     // Validate password length
//     if (password.length < 6) {
//       return false;
//     }

//     // Check if user already exists in demo users
//     if (demoUsers[email as keyof typeof demoUsers]) {
//       return false;
//     }

//     // Check if user already exists in registered users
//     const registeredUsers = getRegisteredUsers();
//     if (registeredUsers[email]) {
//       return false;
//     }

//     // Register new user
//     registeredUsers[email] = {
//       password, // In a real app, you should hash the password
//       department
//     };

//     saveRegisteredUsers(registeredUsers);
//     return true;
//   };

//   const logout = () => {
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }








import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Department } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, department: Department) => Promise<boolean>;
  register: (email: string, password: string, department: Department) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  authInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Change this if backend runs elsewhere
const API_BASE_URL = 'http://localhost:5000/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false); // NEW

  // --- Token helpers (use sessionStorage for per-tab sessions) ---
  const getToken = (): string | null => sessionStorage.getItem('token');
  const setToken = (token: string) => sessionStorage.setItem('token', token);
  const removeToken = () => sessionStorage.removeItem('token');

  // --- Login ---
  const login = async (email: string, password: string, department: Department): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, department }),
      });

      const data = await response.json();

      if (data.status === 'success' && data.token) {
        setToken(data.token);
        setUser(data.data.user);

        // Immediately verify and refresh user data
        await checkAuth();
        return true;
      } else {
        removeToken();
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      removeToken();
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --- Register ---
  const register = async (email: string, password: string, department: Department): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, department }),
      });

      const data = await response.json();
      return data.status === 'success';
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --- Logout ---
  const logout = () => {
    removeToken();
    setUser(null);
  };

  // --- Check Auth (called on mount and after login) ---
  const checkAuth = async () => {
    const token = getToken();
    if (!token) {
      setAuthInitialized(true);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data.user);
      } else {
        removeToken();
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      removeToken();
      setUser(null);
    } finally {
      setAuthInitialized(true);
    }
  };

  // --- Run auth check on load ---
  useEffect(() => {
    checkAuth();
  }, []);

  // --- Show loading screen until auth check completes ---
  if (!authInitialized) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100 text-gray-600">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 mb-4"></div>
        <p className="text-sm">Checking authentication...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, authInitialized }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
