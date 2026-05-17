import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/services';

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Helper: decode a JWT payload without a library ──────────────────────────
function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const navigate = useNavigate();

  // Rehydrate user state from an existing token on first render
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('jwt_token');
    if (!token) return null;
    const decoded = decodeToken(token);
    // Reject if the token is already expired
    if (decoded && decoded.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('jwt_token');
      return null;
    }
    return decoded ? { token, ...decoded } : { token };
  });

  /**
   * login({ email, password })
   * Calls POST /auth/login. On success, stores jwt_token and sets user state.
   * Throws an error with a user-friendly message so the UI can display it.
   */
  const login = useCallback(async (credentials) => {
    const response = await authService.login(credentials);
    const { token } = response.data;

    if (!token) throw new Error('No token received from server.');

    localStorage.setItem('jwt_token', token);
    const decoded = decodeToken(token);
    setUser(decoded ? { token, ...decoded } : { token });
    navigate('/dashboard');
  }, [navigate]);

  /**
   * loginWithGoogle(googleToken)
   * Calls POST /auth/google with the Google token. On success, stores jwt_token and sets user state.
   */
  const loginWithGoogle = useCallback(async (googleToken) => {
    const response = await authService.googleAuth(googleToken);
    const { token } = response.data;

    if (!token) throw new Error('No token received from server.');

    localStorage.setItem('jwt_token', token);
    const decoded = decodeToken(token);
    setUser(decoded ? { token, ...decoded } : { token });
    navigate('/dashboard');
  }, [navigate]);

  /**
   * logout()
   * Clears the token from localStorage, resets user state, and redirects to /login.
   */
  const logout = useCallback(() => {
    localStorage.removeItem('jwt_token');
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const value = { user, login, loginWithGoogle, logout, isAuthenticated: !!user };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
