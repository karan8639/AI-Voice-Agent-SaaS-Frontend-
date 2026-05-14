import { useState } from 'react';
import { Mic2, Mail, Lock, Globe, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [workspace, setWorkspace] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden text-white font-sans">
      {/* Background radial blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-cyan-600/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-700/10 blur-[100px]" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-violet-700/10 blur-[80px]" />
      </div>

      <GlassCard className="w-full max-w-md p-8 shadow-2xl shadow-cyan-500/5">
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 mb-4">
            <Mic2 size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-white/50 mt-1">Sign in to your SoviaAI workspace</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5 ml-1">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-3
                           text-sm text-white/90 placeholder-white/20
                           focus:outline-none focus:border-cyan-400/50 focus:bg-white/[0.06]
                           transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5 ml-1 mr-1">
              <label className="block text-xs font-medium text-white/70">Password</label>
              <a href="#" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                Forgot Password?
              </a>
            </div>
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
            Sign In <ArrowRight size={16} />
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
          Sign in with Google
        </button>

        <p className="text-center text-xs text-white/40 mt-6">
          Don't have an account?{' '}
          <button onClick={() => navigate('/signup')} className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
            Sign up
          </button>
        </p>

      </GlassCard>

      {/* Tenant Context */}
      <div className="mt-8 max-w-sm w-full">
        <label className="block text-[11px] uppercase tracking-widest font-semibold text-white/30 text-center mb-2">
          Workspace URL
        </label>
        <div className="relative flex items-center">
          <Globe size={14} className="absolute left-3 text-white/20" />
          <input
            type="text"
            value={workspace}
            onChange={(e) => setWorkspace(e.target.value)}
            placeholder="e.g. icet.sovia.ai"
            className="w-full bg-white/[0.02] border border-white/5 rounded-lg pl-9 pr-4 py-2.5
                       text-xs text-center text-white/60 placeholder-white/15
                       focus:outline-none focus:border-cyan-400/30 focus:bg-white/[0.04]
                       transition-all duration-200"
          />
        </div>
      </div>
    </div>
  );
}
