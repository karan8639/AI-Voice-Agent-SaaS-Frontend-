import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mic2,
  PhoneCall,
  BarChart3,
  Zap,
  Shield,
  Globe2,
  ChevronRight,
  Play,
  TrendingUp,
  Users,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Bot,
  Activity,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Reusable glassmorphism card wrapper
───────────────────────────────────────────── */
function GlassCard({ children, className = '' }) {
  return (
    <div
      className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl ${className}`}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Top Navigation
───────────────────────────────────────────── */
function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Mic2 size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">
            Sovia<span className="text-cyan-400">AI</span>
          </span>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8 text-sm text-white/60">
          {['Product', 'Pricing', 'Docs', 'Blog'].map((item) => (
            <li key={item}>
              <a
                href="#"
                className="hover:text-white transition-colors duration-200"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            id="nav-login-btn"
            onClick={() => navigate('/login')}
            className="text-sm text-white/70 hover:text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Login
          </button>
          <button
            id="nav-book-demo-btn"
            onClick={() => navigate('/signup')}
            className="relative text-sm font-medium text-white px-5 py-2 rounded-lg
                       bg-gradient-to-r from-cyan-500 to-blue-600
                       shadow-[0_0_20px_rgba(6,182,212,0.5)]
                       hover:shadow-[0_0_30px_rgba(6,182,212,0.75)]
                       hover:scale-[1.03] active:scale-[0.98]
                       transition-all duration-200"
          >
            Book Demo
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          id="nav-mobile-menu-btn"
          className="md:hidden text-white/70 hover:text-white p-2"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-current mb-1.5 transition-all ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-current mb-1.5 transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-current transition-all ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-md border-b border-white/10 px-6 pb-4">
          {['Product', 'Pricing', 'Docs', 'Blog'].map((item) => (
            <a
              key={item}
              href="#"
              className="block py-3 text-sm text-white/70 hover:text-white border-b border-white/5"
            >
              {item}
            </a>
          ))}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => navigate('/login')}
              className="flex-1 text-sm text-white/70 border border-white/10 rounded-lg py-2"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="flex-1 text-sm font-medium text-white rounded-lg py-2 bg-gradient-to-r from-cyan-500 to-blue-600"
            >
              Book Demo
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─────────────────────────────────────────────
   Animated audio wave (pure CSS)
───────────────────────────────────────────── */
function AudioWave() {
  const bars = [3, 5, 8, 6, 10, 7, 4, 9, 6, 8, 5, 3, 7, 10, 6];
  return (
    <div className="flex items-end gap-[3px] h-8">
      {bars.map((h, i) => (
        <div
          key={i}
          style={{
            height: `${h * 3}px`,
            animationDelay: `${i * 0.08}s`,
            animationDuration: `${0.8 + (i % 4) * 0.15}s`,
          }}
          className="w-[3px] rounded-full bg-cyan-400 opacity-80 animate-pulse"
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Floating Dashboard Mockup
───────────────────────────────────────────── */
function DashboardMockup() {
  const calls = [
    { name: 'Inbound — Tier 1 Support', status: 'live', duration: '2:14', sentiment: 'Positive' },
    { name: 'Outbound — Lead Qualification', status: 'live', duration: '0:47', sentiment: 'Neutral' },
    { name: 'Outbound — Renewal Upsell', status: 'queued', duration: '—', sentiment: '—' },
    { name: 'Inbound — Billing Inquiry', status: 'done', duration: '4:02', sentiment: 'Positive' },
  ];

  const statusColor = {
    live: 'text-emerald-400 bg-emerald-400/10',
    queued: 'text-amber-400 bg-amber-400/10',
    done: 'text-slate-400 bg-slate-400/10',
  };
  const statusDot = {
    live: 'bg-emerald-400 animate-pulse',
    queued: 'bg-amber-400',
    done: 'bg-slate-500',
  };

  return (
    <GlassCard className="w-full max-w-4xl mx-auto overflow-hidden shadow-2xl shadow-cyan-500/10">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/10 bg-white/[0.03]">
        <span className="w-3 h-3 rounded-full bg-red-500/70" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
        <span className="ml-3 text-xs text-white/30 font-mono select-none">
          SoviaAI · Live Command Center
        </span>
        <div className="ml-auto flex items-center gap-2 text-xs text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          2 agents live
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 divide-x divide-white/10 border-b border-white/10">
        {[
          { icon: PhoneCall, label: 'Calls Today', value: '1,284', delta: '+12%' },
          { icon: Clock, label: 'Avg Handle Time', value: '1m 47s', delta: '−23%' },
          { icon: TrendingUp, label: 'Leads Captured', value: '342', delta: '+38%' },
        ].map(({ icon: Icon, label, value, delta }) => (
          <div key={label} className="flex flex-col gap-1 px-6 py-4">
            <div className="flex items-center gap-1.5 text-white/40 text-xs">
              <Icon size={12} />
              {label}
            </div>
            <span className="text-2xl font-semibold text-white">{value}</span>
            <span className="text-xs text-emerald-400">{delta} vs yesterday</span>
          </div>
        ))}
      </div>

      {/* Live calls table */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-white/50 uppercase tracking-widest">
            Active &amp; Recent Calls
          </span>
          <div className="flex items-center gap-1.5 text-xs text-cyan-400">
            <Activity size={12} />
            Real-time
          </div>
        </div>
        <div className="space-y-2">
          {calls.map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] transition-colors"
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot[c.status]}`} />
              <span className="flex-1 text-sm text-white/80 truncate">{c.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[c.status]}`}>
                {c.status}
              </span>
              <span className="text-xs text-white/40 w-10 text-right">{c.duration}</span>
              <span className="text-xs text-white/30 hidden sm:block w-16 text-right">{c.sentiment}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom audio bar */}
      <div className="flex items-center gap-4 px-5 py-3.5 mt-2 border-t border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-2 text-xs text-white/40">
          <Bot size={13} className="text-cyan-400" />
          <span>Agent "Aria" speaking…</span>
        </div>
        <AudioWave />
        <span className="ml-auto text-xs text-white/25 font-mono">00:02:14</span>
      </div>
    </GlassCard>
  );
}

/* ─────────────────────────────────────────────
   Hero Section
───────────────────────────────────────────── */
function HeroSection() {
  const navigate = useNavigate();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6 overflow-hidden"
    >
      {/* Background radial blobs */}
      <div className="absolute inset-0 -z-10">
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.3) 1px,transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Cyan blob */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-cyan-600/20 blur-[120px] pointer-events-none" />
        {/* Blue blob */}
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-700/20 blur-[100px] pointer-events-none" />
        {/* Purple accent */}
        <div className="absolute top-2/3 left-1/4 w-[300px] h-[300px] rounded-full bg-violet-700/15 blur-[80px] pointer-events-none" />
      </div>

      {/* Pill badge */}
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 text-xs text-white/60 backdrop-blur-sm">
        <Sparkles size={12} className="text-cyan-400" />
        Introducing SoviaAI — Autonomous Voice Agents for Enterprise
        <ChevronRight size={12} />
      </div>

      {/* Headline */}
      <h1 className="text-center text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight max-w-4xl mb-6">
        Automate Your{' '}
        <span
          className="text-transparent bg-clip-text"
          style={{
            backgroundImage: 'linear-gradient(135deg, #22d3ee 0%, #3b82f6 60%, #a78bfa 100%)',
          }}
        >
          Call Center
        </span>{' '}
        with Agentic AI.
      </h1>

      {/* Sub-headline */}
      <p className="text-center text-lg sm:text-xl text-white/50 max-w-2xl mb-10 leading-relaxed">
        SoviaAI deploys intelligent voice agents that handle inbound &amp; outbound calls
        24/7 — saving{' '}
        <span className="text-white/80">thousands of human hours</span>, qualifying
        leads in real-time, and{' '}
        <span className="text-white/80">capturing every revenue opportunity</span> — automatically.
      </p>

      {/* CTA row */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
        <button
          id="hero-book-demo-btn"
          onClick={() => navigate('/signup')}
          className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-semibold text-sm
                     bg-gradient-to-r from-cyan-500 to-blue-600
                     shadow-[0_0_24px_rgba(6,182,212,0.55)]
                     hover:shadow-[0_0_40px_rgba(6,182,212,0.8)]
                     hover:scale-[1.04] active:scale-[0.98]
                     transition-all duration-200"
        >
          Book a Free Demo
          <ArrowRight size={16} />
        </button>
        <button
          id="hero-watch-video-btn"
          className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-white/80 text-sm font-medium
                     bg-white/5 border border-white/10 backdrop-blur-sm
                     hover:bg-white/10 hover:text-white
                     transition-all duration-200"
        >
          <Play size={14} className="text-cyan-400" fill="currentColor" />
          Watch 2-min overview
        </button>
      </div>

      {/* Social proof strip */}
      <div className="flex flex-wrap justify-center items-center gap-6 mb-14 text-xs text-white/35">
        {[
          { icon: CheckCircle2, text: 'No credit card required' },
          { icon: Shield, text: 'SOC 2 Type II certified' },
          { icon: Globe2, text: '40+ languages supported' },
          { icon: Users, text: 'Trusted by 500+ enterprises' },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-1.5">
            <Icon size={12} className="text-cyan-400" />
            {text}
          </div>
        ))}
      </div>

      {/* Dashboard mockup */}
      <DashboardMockup />

      {/* Subtle bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
    </section>
  );
}

/* ─────────────────────────────────────────────
   Feature highlights strip
───────────────────────────────────────────── */
function FeaturesStrip() {
  const features = [
    {
      icon: Mic2,
      title: 'Human-like Voice',
      desc: 'Ultra-low latency LLM + TTS pipeline delivering natural, empathetic conversations.',
    },
    {
      icon: Zap,
      title: 'Instant Deployment',
      desc: 'Go live in under 24 hours. Connect your CRM and telephony with one-click integrations.',
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      desc: 'Sentiment scoring, call summaries, and lead scoring delivered to your dashboard live.',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      desc: 'End-to-end encryption, HIPAA & GDPR compliance, private cloud deployments available.',
    },
  ];

  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs text-cyan-400 uppercase tracking-[0.2em] font-semibold">
            Why SoviaAI
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">
            Everything you need, nothing you don't.
          </h2>
          <p className="text-white/40 max-w-xl mx-auto">
            Built from the ground up for enterprise-scale call operations with
            security and compliance at the core.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <GlassCard
              key={title}
              className="p-6 flex flex-col gap-4 hover:bg-white/[0.08] hover:border-white/20 hover:-translate-y-1 transition-all duration-300 cursor-default group"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                <Icon size={18} className="text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-base mb-1.5">{title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{desc}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Landing Page root
───────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <Navbar />
      <HeroSection />
      <FeaturesStrip />

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 text-center text-xs text-white/25">
        © {new Date().getFullYear()} SoviaAI Inc. All rights reserved. ·{' '}
        <a href="#" className="hover:text-white/50 transition-colors">Privacy</a> ·{' '}
        <a href="#" className="hover:text-white/50 transition-colors">Terms</a>
      </footer>
    </div>
  );
}
