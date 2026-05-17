import { useState } from 'react';
import { Mic2, Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';

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

/* ─────────────────────────────────────────────
   Animated background orb
───────────────────────────────────────────── */
function Orb({ className }) {
  return <div className={`absolute rounded-full pointer-events-none ${className}`} />;
}

/* ─────────────────────────────────────────────
   Form field with icon
───────────────────────────────────────────── */
function InputField({ label, icon: Icon, rightElement, error, ...props }) {
  return (
    <div>
      <label className="block text-xs font-medium text-white/70 mb-1.5 ml-1">{label}</label>
      <div className="relative">
        <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
        <input
          {...props}
          className={`w-full bg-white/[0.04] border rounded-xl pl-10 pr-${rightElement ? '12' : '4'} py-3
                      text-sm text-white/90 placeholder-white/20
                      focus:outline-none focus:bg-white/[0.07]
                      transition-all duration-200
                      ${error
                        ? 'border-red-500/60 focus:border-red-400/70'
                        : 'border-white/10 focus:border-cyan-400/50'
                      }`}
        />
        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 ml-1 text-xs text-red-400 flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Google SVG icon
───────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
        <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
        <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Main Login Page
───────────────────────────────────────────── */
export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Add this inside your Login component to debug
  console.log("My Client ID is:", import.meta.env.VITE_GOOGLE_CLIENT_ID);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');    // banner-level error
  const [fieldErrors, setFieldErrors] = useState({}); // per-field validation

  // ── Client-side validation ──────────────────────────────────────────────
  function validate() {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Enter a valid email address.';
    }
    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    return errs;
  }

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      // AuthContext.login() navigates to /dashboard on success.
      // If there was a previous protected location, go there instead.
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setFormError('Invalid Credentials. Please check your email and password.');
      } else if (status >= 500) {
        setFormError('Server error. Please try again later.');
      } else {
        setFormError(err?.message || 'Login failed. Please try again.');
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
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } catch (err) {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          setFormError('Google Authentication failed. Please check your credentials.');
        } else {
          setFormError(err?.message || 'Google Sign-In failed. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    },
    onError: () => setFormError('Google Sign-In was unsuccessful.'),
  });

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden text-white font-sans">
      {/* ── Background orbs ── */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Orb className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-600/10 blur-[120px]" />
        <Orb className="bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-700/10 blur-[100px]" />
        <Orb className="top-1/4 left-1/4 w-[400px] h-[400px] bg-violet-700/10 blur-[80px]" />
      </div>

      {/* ── Animated grid overlay ── */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <GlassCard className="w-full max-w-md p-8 shadow-2xl shadow-cyan-500/5">
        {/* ── Logo & Header ── */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/40 mb-4 relative">
            <Mic2 size={26} className="text-white" strokeWidth={2.5} />
            {/* Ping animation ring */}
            <span className="absolute inset-0 rounded-2xl border border-cyan-400/30 animate-ping opacity-50" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-white/50 mt-1">Sign in to your Voca AI workspace</p>
        </div>

        {/* ── Error Banner ── */}
        {formError && (
          <div className="mb-5 flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400 animate-[fadeIn_0.2s_ease]">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <InputField
            id="login-email"
            label="Email"
            icon={Mail}
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setFieldErrors(p => ({ ...p, email: '' })); }}
            placeholder="name@company.com"
            autoComplete="email"
            error={fieldErrors.email}
          />

          <InputField
            id="login-password"
            label="Password"
            icon={Lock}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setFieldErrors(p => ({ ...p, password: '' })); }}
            placeholder="••••••••"
            autoComplete="current-password"
            error={fieldErrors.password}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-white/30 hover:text-white/60 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          {/* Forgot password */}
          <div className="flex justify-end -mt-1 mr-1">
            <a href="#" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="mt-1 flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white
                       bg-gradient-to-r from-cyan-500 to-blue-600
                       shadow-[0_0_20px_rgba(6,182,212,0.4)]
                       hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]
                       hover:scale-[1.02] active:scale-[0.98]
                       disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none
                       transition-all duration-200"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Signing in…
              </>
            ) : (
              <>
                Sign In <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* ── Divider ── */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-white/30 uppercase tracking-widest font-semibold">Or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* ── Google SSO ── */}
        <button
          type="button"
          onClick={() => googleLogin()}
          className="flex items-center justify-center gap-3 w-full py-3 rounded-xl text-sm font-medium text-white/80
                     bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white
                     transition-all duration-200"
        >
          <GoogleIcon />
          Sign in with Google
        </button>

        <p className="text-center text-xs text-white/40 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
            Sign up
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}
