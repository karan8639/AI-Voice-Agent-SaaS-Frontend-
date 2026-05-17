import { useState } from 'react';
import { Mic2, Mail, Lock, User, Globe, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

/* ─────────────────────────────────────────────
   Glassmorphism card wrapper
───────────────────────────────────────────── */
function GlassCard({ children, className = '' }) {
  return (
    <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl ${className}`}>
      {children}
    </div>
  );
}

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [workspace, setWorkspace] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setLoading(true);
    try {
      const res = await authService.register({ name, email, password, workspace });
      if (res.data?.token) {
        localStorage.setItem('jwt_token', res.data.token);
      }
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      const status = err?.response?.status;
      if (status === 409) {
        setFormError('An account with this email already exists.');
      } else if (status === 401 || status === 403) {
        setFormError('Invalid Credentials.');
      } else {
        setFormError(err?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setFormError('');
      try {
        await loginWithGoogle(tokenResponse.access_token);
        navigate('/dashboard');
      } catch (err) {
        setFormError(err?.message || 'Google Sign-Up failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => setFormError('Google Sign-Up was unsuccessful.'),
  });

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden text-white font-sans">
      {/* Background radial blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-cyan-600/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-emerald-700/10 blur-[100px]" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-700/10 blur-[80px]" />
      </div>

      <GlassCard className="w-full max-w-md p-8 shadow-2xl shadow-cyan-500/5">
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 mb-4">
            <Mic2 size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
          <p className="text-sm text-white/50 mt-1">Get started with SoviaAI today</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5 ml-1">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                required
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-3
                           text-sm text-white/90 placeholder-white/20
                           focus:outline-none focus:border-cyan-400/50 focus:bg-white/[0.06]
                           transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5 ml-1">Work Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@company.com"
                required
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-3
                           text-sm text-white/90 placeholder-white/20
                           focus:outline-none focus:border-cyan-400/50 focus:bg-white/[0.06]
                           transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5 ml-1">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-3
                           text-sm text-white/90 placeholder-white/20
                           focus:outline-none focus:border-cyan-400/50 focus:bg-white/[0.06]
                           transition-all duration-200"
              />
            </div>
          </div>

          {/* Tenant Context built into signup */}
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5 ml-1">Workspace Domain</label>
            <div className="relative flex items-center">
              <Globe size={16} className="absolute left-3.5 text-white/30" />
              <input
                type="text"
                value={workspace}
                onChange={(e) => setWorkspace(e.target.value)}
                placeholder="company-name"
                required
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-20 py-3
                           text-sm text-white/90 placeholder-white/20
                           focus:outline-none focus:border-cyan-400/50 focus:bg-white/[0.06]
                           transition-all duration-200"
              />
              <span className="absolute right-4 text-xs text-white/30 pointer-events-none">.sovia.ai</span>
            </div>
          </div>

          {/* Primary Action */}
          <button
            type="submit"
            className="mt-2 flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white
                       bg-gradient-to-r from-cyan-500 to-blue-600
                       shadow-[0_0_20px_rgba(6,182,212,0.4)]
                       hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]
                       hover:scale-[1.02] active:scale-[0.98]
                       transition-all duration-200"
          >
            Create Account <ArrowRight size={16} />
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-xs text-white/30 uppercase tracking-widest font-semibold">Or</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          onClick={() => googleLogin()}
          className="flex items-center justify-center gap-3 w-full py-3 rounded-xl text-sm font-medium text-white/80
                     bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white
                     transition-all duration-200"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
              <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
              <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
              <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
              <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
            </g>
          </svg>
          Sign up with Google
        </button>

        {formError && (
          <div className="mt-4 flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <p className="text-center text-xs text-white/40 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
            Log in
          </Link>
        </p>

      </GlassCard>
    </div>
  );
}
