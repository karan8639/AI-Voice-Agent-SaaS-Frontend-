import { useState, useEffect } from 'react';
import { dashboardService } from './api/services';
import {
  PhoneIncoming,
  UserCheck,
  Clock4,
  TrendingUp,
  TrendingDown,
  Minus,
  Wifi,
  WifiOff,
  BarChart2,
  RefreshCcw,
  Zap,
  AlertCircle,
  Activity,
  Radio,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Reusable glassmorphism card
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
   Stat Card
───────────────────────────────────────────── */
function StatCard({ id, icon: Icon, label, value, unit, delta, deltaLabel, accentClass, glowClass }) {
  const isPositive = delta > 0;
  const isNeutral = delta === 0;
  const DeltaIcon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;
  const deltaColor = isNeutral
    ? 'text-white/35'
    : isPositive
    ? 'text-emerald-400'
    : 'text-rose-400';

  return (
    <GlassCard className={`p-6 flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-0.5 transition-all duration-300 hover:border-white/20`}>
      {/* Glow blob */}
      <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${glowClass}`} />

      {/* Icon + label row */}
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${accentClass}`}>
          <Icon size={18} strokeWidth={1.8} />
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${deltaColor} bg-white/5`}>
          <DeltaIcon size={11} strokeWidth={2.5} />
          {Math.abs(delta)}%
        </span>
      </div>

      {/* Value */}
      <div>
        <div className="flex items-end gap-1.5">
          <span
            id={id}
            className={`text-4xl font-bold tracking-tight leading-none ${accentClass.includes('cyan') ? 'text-cyan-300' : accentClass.includes('emerald') ? 'text-emerald-300' : 'text-violet-300'}`}
          >
            {value}
          </span>
          {unit && (
            <span className="text-sm text-white/30 mb-0.5">{unit}</span>
          )}
        </div>
        <p className="text-sm text-white/50 mt-2 font-medium">{label}</p>
        <p className="text-xs text-white/25 mt-0.5">{deltaLabel}</p>
      </div>

      {/* Sparkline bar decoration */}
      <div className="flex items-end gap-[3px] h-7 mt-auto opacity-40">
        {[4, 7, 5, 9, 6, 8, 10, 7, 9, 12, 10, 14].map((h, i) => (
          <div
            key={i}
            style={{ height: `${h * 2}px` }}
            className={`flex-1 rounded-sm ${
              accentClass.includes('cyan')
                ? 'bg-cyan-400'
                : accentClass.includes('emerald')
                ? 'bg-emerald-400'
                : 'bg-violet-400'
            }`}
          />
        ))}
      </div>
    </GlassCard>
  );
}

/* ─────────────────────────────────────────────
   Toggle Switch — Agent Live / Offline
───────────────────────────────────────────── */
function AgentToggle() {
  const [isLive, setIsLive] = useState(true);

  return (
    <div className="flex items-center gap-4">
      {/* Status label left */}
      <div className="flex flex-col items-end">
        <span className="text-xs font-semibold text-white/60">AI Agent Status</span>
        <span className={`text-[11px] font-bold mt-0.5 transition-colors duration-300 ${isLive ? 'text-emerald-400' : 'text-white/25'}`}>
          {isLive ? 'LIVE' : 'OFFLINE'}
        </span>
      </div>

      {/* The toggle */}
      <button
        id="agent-live-toggle"
        role="switch"
        aria-checked={isLive}
        onClick={() => setIsLive((v) => !v)}
        className={`
          relative w-14 h-7 rounded-full border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
          ${isLive
            ? 'bg-emerald-500/30 border-emerald-400/40 shadow-[0_0_14px_rgba(52,211,153,0.35)]'
            : 'bg-white/5 border-white/10'}
        `}
      >
        {/* Thumb */}
        <span
          className={`
            absolute top-[3px] w-[22px] h-[22px] rounded-full shadow-md
            flex items-center justify-center
            transition-all duration-300
            ${isLive
              ? 'left-[26px] bg-emerald-400 shadow-emerald-400/50'
              : 'left-[3px] bg-white/30'}
          `}
        >
          {isLive
            ? <Wifi size={10} className="text-slate-900" strokeWidth={2.5} />
            : <WifiOff size={10} className="text-white/60" strokeWidth={2.5} />
          }
        </span>
      </button>

      {/* Live pulse ring */}
      {isLive && (
        <div className="relative w-4 h-4 flex items-center justify-center">
          <span className="absolute w-full h-full rounded-full bg-emerald-400 opacity-25 animate-ping" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Chart Placeholder — sine-wave SVG path
───────────────────────────────────────────── */
function ChartPlaceholder() {
  // Two fake SVG polyline paths to simulate a performance chart
  const width = 800;
  const height = 200;

  // Generate smooth sine-like points
  const makePoints = (offset, amplitude, freq) =>
    Array.from({ length: 60 }, (_, i) => {
      const x = (i / 59) * width;
      const y =
        height / 2 -
        amplitude * Math.sin((i / 59) * Math.PI * freq + offset) -
        (i / 59) * 20;
      return `${x},${Math.max(8, Math.min(height - 8, y))}`;
    }).join(' ');

  const cyanPoints  = makePoints(0, 55, 3);
  const emeraldPoints = makePoints(1.2, 38, 4);

  return (
    <div className="relative w-full h-48 overflow-hidden">
      {/* Y-axis grid lines */}
      {[0, 25, 50, 75, 100].map((pct) => (
        <div
          key={pct}
          className="absolute left-0 right-0 border-t border-white/[0.05]"
          style={{ top: `${pct}%` }}
        >
          <span className="absolute -top-2.5 right-0 text-[10px] text-white/15 pr-1 font-mono">
            {100 - pct}%
          </span>
        </div>
      ))}

      {/* SVG chart */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Cyan area fill */}
        <polyline
          points={`0,${height} ${cyanPoints} ${width},${height}`}
          fill="url(#cyanGrad)"
        />
        {/* Cyan line */}
        <polyline
          points={cyanPoints}
          fill="none"
          stroke="#22d3ee"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Emerald area fill */}
        <polyline
          points={`0,${height} ${emeraldPoints} ${width},${height}`}
          fill="url(#emeraldGrad)"
        />
        {/* Emerald line */}
        <polyline
          points={emeraldPoints}
          fill="none"
          stroke="#34d399"
          strokeWidth="2"
          strokeDasharray="5 4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Animated scrubber dot on cyan line */}
        <circle r="5" fill="#22d3ee" opacity="0.9">
          <animateMotion dur="8s" repeatCount="indefinite" path={`M ${cyanPoints.split(' ').map(p => p.replace(',', ' ')).join(' L ')}`} />
        </circle>
      </svg>

      {/* Tooltip card floating */}
      <div className="absolute top-3 left-4 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl">
        <p className="text-white/40 mb-1 text-[10px] uppercase tracking-wider">Realtime</p>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-white/70">Call Volume</span>
          <span className="text-cyan-300 font-bold ml-1">87%</span>
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-white/70">Resolution Rate</span>
          <span className="text-emerald-300 font-bold ml-1">94%</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Recent Activity Feed
───────────────────────────────────────────── */
const ACTIVITY = [
  { icon: PhoneIncoming, color: 'text-cyan-400',    bg: 'bg-cyan-400/10',    msg: 'Inbound call resolved — Billing Inquiry',       time: '2m ago' },
  { icon: UserCheck,     color: 'text-emerald-400', bg: 'bg-emerald-400/10', msg: 'Lead qualified — "Acme Corp" Enterprise plan',    time: '7m ago' },
  { icon: AlertCircle,   color: 'text-amber-400',   bg: 'bg-amber-400/10',   msg: 'Escalation triggered — Customer sentiment low',  time: '15m ago' },
  { icon: UserCheck,     color: 'text-emerald-400', bg: 'bg-emerald-400/10', msg: 'Lead qualified — "Nova Systems" Growth plan',     time: '22m ago' },
  { icon: PhoneIncoming, color: 'text-cyan-400',    bg: 'bg-cyan-400/10',    msg: 'Inbound call resolved — Password reset request', time: '31m ago' },
];

/* ─────────────────────────────────────────────
   CommandCenter page
───────────────────────────────────────────── */
export default function CommandCenter() {
  const [chartRange, setChartRange] = useState('24h');
  const [stats, setStats] = useState({
    totalCalls: "24,831",
    successfulLeads: "3,492",
    hoursSaved: "9,200",
    deltas: { calls: 12, leads: 38, hours: -3 }
  });

  const ranges = ['1h', '24h', '7d', '30d'];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardService.getStats();
        if (response.data) {
          setStats({
            totalCalls: response.data.totalCalls?.toLocaleString() || "0",
            successfulLeads: response.data.successfulLeads?.toLocaleString() || "0",
            hoursSaved: response.data.minutesSaved ? (response.data.minutesSaved / 60).toFixed(0).toLocaleString() : "0",
            deltas: { 
              calls: response.data.deltaCalls || 0, 
              leads: response.data.deltaLeads || 0, 
              hours: response.data.deltaHours || 0 
            }
          });
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col gap-6 h-full">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity size={20} className="text-cyan-400" strokeWidth={2} />
            Command Center
          </h1>
          <p className="text-sm text-white/35 mt-0.5">
            Live performance overview · Last refreshed just now
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh button */}
          <button
            id="cmd-refresh-btn"
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/80
                       bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2
                       hover:bg-white/[0.08] transition-all duration-200"
          >
            <RefreshCcw size={12} />
            Refresh
          </button>

          {/* Agent live toggle */}
          <GlassCard className="px-4 py-2 flex items-center">
            <AgentToggle />
          </GlassCard>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          id="stat-total-calls"
          icon={PhoneIncoming}
          label="Total Calls Handled"
          value={stats.totalCalls}
          unit="calls"
          delta={stats.deltas.calls}
          deltaLabel="vs. last 30 days"
          accentClass="bg-cyan-500/10 border-cyan-400/20 text-cyan-400"
          glowClass="bg-cyan-500/20"
        />
        <StatCard
          id="stat-successful-leads"
          icon={UserCheck}
          label="Successful Leads"
          value={stats.successfulLeads}
          unit="leads"
          delta={stats.deltas.leads}
          deltaLabel="vs. last 30 days"
          accentClass="bg-emerald-500/10 border-emerald-400/20 text-emerald-400"
          glowClass="bg-emerald-500/20"
        />
        <StatCard
          id="stat-hours-saved"
          icon={Clock4}
          label="Staff Hours Saved"
          value={stats.hoursSaved}
          unit="hrs"
          delta={stats.deltas.hours}
          deltaLabel="vs. last 30 days"
          accentClass="bg-violet-500/10 border-violet-400/20 text-violet-400"
          glowClass="bg-violet-500/20"
        />
      </div>

      {/* ── Bottom section: Chart + Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">

        {/* Performance Chart — spans 2 cols */}
        <GlassCard className="lg:col-span-2 flex flex-col overflow-hidden">
          {/* Card header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/[0.07] flex-shrink-0">
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <BarChart2 size={15} className="text-cyan-400" />
                Recent AI Performance
              </h2>
              <p className="text-xs text-white/30 mt-0.5">Call volume · Resolution rate · Live data</p>
            </div>

            {/* Range selector */}
            <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] rounded-lg p-1">
              {ranges.map((r) => (
                <button
                  key={r}
                  id={`chart-range-${r}`}
                  onClick={() => setChartRange(r)}
                  className={`text-xs px-2.5 py-1 rounded-md transition-all duration-200 font-medium
                    ${chartRange === r
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/20'
                      : 'text-white/35 hover:text-white/70'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 px-5 pt-3 pb-1 flex-shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-white/45">
              <span className="w-6 h-0.5 rounded-full bg-cyan-400 inline-block" />
              Call Volume
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/45">
              <span className="w-6 h-0.5 rounded-full bg-emerald-400 inline-block border-dashed border-t border-emerald-400" />
              Resolution Rate
            </div>
            <div className="ml-auto flex items-center gap-1.5 text-xs">
              <Radio size={11} className="text-cyan-400 animate-pulse" />
              <span className="text-cyan-400 font-medium">Live</span>
            </div>
          </div>

          {/* Chart area */}
          <div className="flex-1 px-5 pb-5 min-h-0">
            <ChartPlaceholder />
          </div>

          {/* Bottom KPI strip */}
          <div className="grid grid-cols-3 divide-x divide-white/[0.07] border-t border-white/[0.07] flex-shrink-0">
            {[
              { label: 'Peak Hour', value: '2–3 PM', icon: Zap, color: 'text-amber-400' },
              { label: 'Avg Resolution', value: '94.2%', icon: UserCheck, color: 'text-emerald-400' },
              { label: 'Avg Handle Time', value: '1m 47s', icon: Clock4, color: 'text-cyan-400' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex flex-col gap-0.5 px-5 py-3">
                <span className="text-[10px] text-white/30 flex items-center gap-1 uppercase tracking-wider">
                  <Icon size={10} className={color} />
                  {label}
                </span>
                <span className={`text-base font-bold ${color}`}>{value}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Recent Activity Feed — 1 col */}
        <GlassCard className="flex flex-col overflow-hidden">
          <div className="px-5 pt-5 pb-4 border-b border-white/[0.07] flex-shrink-0">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Activity size={15} className="text-emerald-400" />
              Recent Activity
            </h2>
            <p className="text-xs text-white/30 mt-0.5">Live agent events</p>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
            {ACTIVITY.map(({ icon: Icon, color, bg, msg, time }, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-transparent hover:border-white/[0.07] transition-all duration-200 group"
              >
                <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Icon size={13} className={color} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/70 leading-relaxed group-hover:text-white/90 transition-colors">{msg}</p>
                  <p className="text-[10px] text-white/25 mt-1">{time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 py-3 border-t border-white/[0.07] flex-shrink-0">
            <button
              id="activity-view-all-btn"
              className="w-full text-xs text-white/35 hover:text-cyan-400 text-center transition-colors duration-200 font-medium"
            >
              View all activity →
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
