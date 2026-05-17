import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useCallStream } from './hooks/useCallStream';
import { auditService } from './api/services';
import {
  PhoneCall,
  Search,
  MessageCircle,
  Filter,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  PhoneMissed,
  Download,
  SlidersHorizontal,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Mic,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Glassmorphism card wrapper
───────────────────────────────────────────── */
function GlassCard({ children, className = '' }) {
  return (
    <div className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl ${className}`}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Mock call data
───────────────────────────────────────────── */
const MOCK_CALLS = [
  { id: 'c001', date: '2026-05-04 02:14', caller: '+1 (415) 820-3341', duration: '4m 22s', intent: 'Requested demo of enterprise plan, high budget signals', status: 'lead',     phone: '+14158203341' },
  { id: 'c002', date: '2026-05-04 01:53', caller: '+44 20 7946 0931', duration: '1m 08s', intent: 'Password reset support — resolved by agent',              status: 'resolved',  phone: '+442079460931' },
  { id: 'c003', date: '2026-05-04 01:31', caller: '+1 (646) 555-0192', duration: '7m 47s', intent: 'Billing dispute — customer unhappy, needs human review',  status: 'followup', phone: '+16465550192' },
  { id: 'c004', date: '2026-05-04 01:10', caller: '+91 98201 44231',   duration: '2m 55s', intent: 'Inquiry about API integration and pricing tiers',         status: 'lead',     phone: '+919820144231' },
  { id: 'c005', date: '2026-05-04 00:48', caller: '+1 (312) 555-0847', duration: '0m 34s', intent: 'Caller disconnected before agent could respond',          status: 'missed',   phone: '+13125550847' },
  { id: 'c006', date: '2026-05-03 23:59', caller: '+61 2 9876 5432',   duration: '3m 12s', intent: 'Onboarding walkthrough completed successfully',           status: 'resolved',  phone: '+61298765432'  },
  { id: 'c007', date: '2026-05-03 23:41', caller: '+1 (929) 555-0274', duration: '6m 03s', intent: 'Upgrade request from Growth to Enterprise plan',          status: 'lead',     phone: '+19295550274' },
  { id: 'c008', date: '2026-05-03 23:22', caller: '+49 30 12345678',   duration: '2m 18s', intent: 'GDPR data deletion request — needs compliance team',      status: 'followup', phone: '+493012345678' },
  { id: 'c009', date: '2026-05-03 23:05', caller: '+1 (213) 555-0130', duration: '5m 41s', intent: 'Product demo inquiry — asked for call-back from sales',    status: 'followup', phone: '+12135550130' },
  { id: 'c010', date: '2026-05-03 22:47', caller: '+33 1 42 86 83 26', duration: '1m 52s', intent: 'Connection error — agent unable to process the request',   status: 'error',    phone: '+33142868326' },
  { id: 'c011', date: '2026-05-03 22:30', caller: '+1 (503) 555-0388', duration: '3m 05s', intent: 'Feature feedback on knowledge forge module',               status: 'resolved',  phone: '+15035550388' },
  { id: 'c012', date: '2026-05-03 22:10', caller: '+81 3-1234-5678',   duration: '4m 57s', intent: 'Enterprise procurement team — budget approved, ready to close', status: 'lead', phone: '+81312345678' },
];

/* ─────────────────────────────────────────────
   Status config
───────────────────────────────────────────── */
const STATUS_CONFIG = {
  lead:     { label: 'Lead Captured',     icon: CheckCircle2, textColor: 'text-emerald-300', bg: 'bg-emerald-500/10', border: 'border-emerald-400/20' },
  resolved: { label: 'Resolved',          icon: CheckCircle2, textColor: 'text-cyan-300',    bg: 'bg-cyan-500/10',    border: 'border-cyan-400/20'    },
  followup: { label: 'Follow-up Needed',  icon: AlertCircle,  textColor: 'text-amber-300',   bg: 'bg-amber-500/10',   border: 'border-amber-400/20'   },
  missed:   { label: 'Missed Call',       icon: PhoneMissed,  textColor: 'text-rose-300',    bg: 'bg-rose-500/10',    border: 'border-rose-400/20'    },
  error:    { label: 'Agent Error',       icon: XCircle,      textColor: 'text-white/40',    bg: 'bg-white/5',        border: 'border-white/10'       },
};

/* ─────────────────────────────────────────────
   Status badge
───────────────────────────────────────────── */
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.error;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap
      ${cfg.textColor} ${cfg.bg} ${cfg.border}`}>
      <Icon size={11} strokeWidth={2.5} />
      {cfg.label}
    </span>
  );
}

/* ─────────────────────────────────────────────
   WhatsApp Handoff button
───────────────────────────────────────────── */
function WhatsAppBtn({ call, onHandoff }) {
  const [sent, setSent] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setSent(true);
    onHandoff(call);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <button
      id={`whatsapp-handoff-${call.id}`}
      onClick={handleClick}
      title={`Send WhatsApp handoff to ${call.caller}`}
      className={`flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg border
        transition-all duration-300 whitespace-nowrap flex-shrink-0
        ${sent
          ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300 scale-95'
          : 'bg-white/5 border-white/10 text-white/50 hover:bg-emerald-500/15 hover:border-emerald-400/30 hover:text-emerald-300 hover:scale-[1.03] active:scale-95'
        }`}
    >
      <MessageCircle size={12} strokeWidth={2.5} />
      {sent ? 'Sent ✓' : 'WhatsApp'}
    </button>
  );
}

/* ─────────────────────────────────────────────
   Sortable column header
───────────────────────────────────────────── */
function ColHeader({ label, sortKey, currentSort, onSort }) {
  const isActive = currentSort.key === sortKey;
  return (
    <th
      className={`px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest cursor-pointer select-none
        transition-colors duration-200
        ${isActive ? 'text-cyan-400' : 'text-white/35 hover:text-white/60'}`}
      onClick={() => onSort(sortKey)}
    >
      <span className="flex items-center gap-1.5">
        {label}
        {isActive
          ? (currentSort.dir === 'asc'
            ? <ChevronUp size={12} strokeWidth={2.5} />
            : <ChevronDown size={12} strokeWidth={2.5} />)
          : <ArrowUpDown size={11} className="opacity-30" />
        }
      </span>
    </th>
  );
}

/* ─────────────────────────────────────────────
   Expanded row detail panel
───────────────────────────────────────────── */
function RowDetail({ call }) {
  return (
    <tr className="bg-white/[0.02]">
      <td colSpan={6} className="px-6 py-4 border-b border-white/[0.05]">
        <div className="flex flex-wrap items-start gap-6">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-[10px] text-white/30 uppercase tracking-widest">Full Intent Summary</span>
            <p className="text-sm text-white/70 leading-relaxed max-w-xl">{call.intent}</p>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-white/30 uppercase tracking-widest">Caller Phone</span>
            <a
              href={`tel:${call.phone}`}
              className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              {call.phone}
              <ExternalLink size={11} />
            </a>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-white/30 uppercase tracking-widest">Recording</span>
            <button className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors">
              <Mic size={12} className="text-cyan-400" />
              Play transcript
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}

/* ─────────────────────────────────────────────
   CallIntelligence page
───────────────────────────────────────────── */
const PAGE_SIZE = 8;

export default function CallIntelligence() {
  const [query, setQuery]           = useState('');
  const [statusFilter, setStatus]   = useState('all');
  const [sort, setSort]             = useState({ key: 'date', dir: 'desc' });
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage]             = useState(1);
  const [handoffLog, setHandoffLog] = useState([]);
  const [calls, setCalls]           = useState(MOCK_CALLS);
  const [newCallIds, setNewCallIds] = useState(new Set());

  // Handle incoming real-time call updates
  const handleNewCall = useCallback((newCall) => {
    setCalls(prev => [newCall, ...prev]);
    
    // Highlight the new row
    setNewCallIds(prev => {
      const next = new Set(prev);
      next.add(newCall.id);
      return next;
    });
    
    // Remove highlight after 3 seconds
    setTimeout(() => {
      setNewCallIds(prev => {
        const next = new Set(prev);
        next.delete(newCall.id);
        return next;
      });
    }, 3000);
  }, []);

  // Use the custom hook for SSE streaming
  const { isConnected: isSyncing } = useCallStream(handleNewCall);

  useEffect(() => {
    // Initial fetch of historical logs from backend
    const fetchLogs = async () => {
      try {
        const response = await auditService.getLogs();
        if (response.data && response.data.length > 0) {
          setCalls(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch initial audit logs:", err);
      }
    };
    fetchLogs();
  }, []);

  /* ── Filtering + sorting ── */
  const filtered = useMemo(() => {
    let rows = calls;
    if (statusFilter !== 'all') rows = rows.filter((r) => r.status === statusFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter(
        (r) => r.caller.toLowerCase().includes(q) || r.intent.toLowerCase().includes(q)
      );
    }
    rows = [...rows].sort((a, b) => {
      let va = a[sort.key], vb = b[sort.key];
      if (sort.key === 'duration') {
        const toSec = (s) => {
          const [m, sec] = s.replace('s', '').split('m ').map(Number);
          return m * 60 + sec;
        };
        va = toSec(va); vb = toSec(vb);
      }
      if (va < vb) return sort.dir === 'asc' ? -1 : 1;
      if (va > vb) return sort.dir === 'asc' ? 1 : -1;
      return 0;
    });
    return rows;
  }, [query, statusFilter, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageRows   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key) => {
    setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }));
    setPage(1);
  };

  const handleHandoff = (call) => {
    setHandoffLog((l) => [{ ...call, sentAt: new Date().toLocaleTimeString() }, ...l]);
  };

  /* ── Status filter tabs ── */
  const STATUS_TABS = [
    { key: 'all',      label: 'All',          count: calls.length },
    { key: 'lead',     label: 'Leads',        count: calls.filter(c => c.status === 'lead').length },
    { key: 'followup', label: 'Follow-up',    count: calls.filter(c => c.status === 'followup').length },
    { key: 'resolved', label: 'Resolved',     count: calls.filter(c => c.status === 'resolved').length },
    { key: 'missed',   label: 'Missed',       count: calls.filter(c => c.status === 'missed').length },
  ];

  return (
    <div className="flex flex-col gap-5 h-full">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <PhoneCall size={20} className="text-cyan-400" strokeWidth={2} />
              Call Intelligence
            </h1>
            {isSyncing && (
              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-semibold text-cyan-400 bg-cyan-900/30 border border-cyan-500/30 px-2.5 py-1 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Syncing with AI...
              </span>
            )}
          </div>
          <p className="text-sm text-white/35 mt-1">
            Review, filter, and act on every AI-handled call
          </p>
        </div>
        <button
          id="call-export-btn"
          className="flex items-center gap-2 text-xs text-white/50 hover:text-white/80
                     bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5
                     hover:bg-white/[0.08] transition-all duration-200 self-start sm:self-auto"
        >
          <Download size={13} />
          Export CSV
        </button>
      </div>

      {/* ── Main table card ── */}
      <GlassCard className="flex flex-col flex-1 min-h-0 overflow-hidden">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-white/[0.07] flex-shrink-0">

          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
            <input
              id="call-search-input"
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search caller or intent…"
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl pl-9 pr-4 py-2
                         text-sm text-white/80 placeholder-white/20
                         focus:outline-none focus:border-cyan-400/40 focus:bg-white/[0.08]
                         transition-all duration-200"
            />
          </div>

          {/* Status filter chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <SlidersHorizontal size={13} className="text-white/25 flex-shrink-0" />
            {STATUS_TABS.map(({ key, label, count }) => (
              <button
                key={key}
                id={`call-filter-${key}`}
                onClick={() => { setStatus(key); setPage(1); }}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 font-medium flex items-center gap-1.5
                  ${statusFilter === key
                    ? 'bg-cyan-500/20 border-cyan-400/30 text-cyan-300'
                    : 'bg-white/[0.04] border-white/10 text-white/40 hover:text-white/70 hover:border-white/25'}`}
              >
                {label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold
                  ${statusFilter === key ? 'bg-cyan-400/20 text-cyan-300' : 'bg-white/10 text-white/30'}`}>
                  {count}
                </span>
              </button>
            ))}
          </div>

          {/* Results count */}
          <span className="text-xs text-white/25 ml-auto flex-shrink-0 hidden sm:block">
            {filtered.length} call{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Table wrapper */}
        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse min-w-[700px]">
            <thead className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-sm">
              <tr className="border-b border-white/[0.07]">
                <ColHeader label="Date"           sortKey="date"     currentSort={sort} onSort={handleSort} />
                <ColHeader label="Caller ID"      sortKey="caller"   currentSort={sort} onSort={handleSort} />
                <ColHeader label="Duration"       sortKey="duration" currentSort={sort} onSort={handleSort} />
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-white/35">
                  Intent Summary
                </th>
                <ColHeader label="Status"         sortKey="status"   currentSort={sort} onSort={handleSort} />
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-white/35">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-white/25 text-sm">
                    <Filter size={24} className="mx-auto mb-3 opacity-30" />
                    No calls match your search
                  </td>
                </tr>
              )}

              {pageRows.map((call) => {
                const isExpanded = expandedId === call.id;
                const isNew = newCallIds.has(call.id);
                return (
                  <React.Fragment key={call.id}>
                    <tr
                      key={call.id}
                      id={`call-row-${call.id}`}
                      onClick={() => setExpandedId(isExpanded ? null : call.id)}
                      className={`
                        cursor-pointer transition-all duration-500 group
                        ${isExpanded ? 'bg-white/[0.05]' : 'hover:bg-white/5'}
                        ${isNew 
                          ? 'bg-cyan-900/20 shadow-[0_0_15px_rgba(34,211,238,0.15)] border-b border-cyan-400/50' 
                          : 'border-b border-white/[0.04]'
                        }
                      `}
                    >
                      {/* Date */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="text-xs text-white/45 font-mono">{call.date}</span>
                      </td>

                      {/* Caller */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-white/10 flex items-center justify-center flex-shrink-0">
                            <PhoneCall size={12} className="text-cyan-400" strokeWidth={1.8} />
                          </div>
                          <span className="text-xs text-white/70 font-medium">{call.caller}</span>
                          {isNew && (
                            <span className="text-[9px] uppercase tracking-wider font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 px-1.5 py-0.5 rounded shadow-[0_0_8px_rgba(34,211,238,0.5)] animate-pulse">
                              New
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs text-white/50">
                          <Clock size={12} className="text-white/25" />
                          {call.duration}
                        </div>
                      </td>

                      {/* Intent — truncated */}
                      <td className="px-4 py-3.5 max-w-[280px]">
                        <p className="text-xs text-white/60 truncate leading-relaxed group-hover:text-white/80 transition-colors">
                          {call.intent}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <StatusBadge status={call.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <WhatsAppBtn call={call} onHandoff={handleHandoff} />
                      </td>
                    </tr>

                    {/* Expanded detail row */}
                    {isExpanded && <RowDetail key={`detail-${call.id}`} call={call} />}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.07] flex-shrink-0 gap-4">
          <span className="text-xs text-white/25">
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>

          <div className="flex items-center gap-1">
            <button
              id="call-page-prev"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-white/40
                         hover:text-white hover:bg-white/[0.08] disabled:opacity-20
                         disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={14} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                id={`call-page-${p}`}
                onClick={() => setPage(p)}
                className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-medium transition-all
                  ${p === page
                    ? 'bg-cyan-500/20 border border-cyan-400/30 text-cyan-300'
                    : 'text-white/35 hover:text-white hover:bg-white/[0.08]'}`}
              >
                {p}
              </button>
            ))}

            <button
              id="call-page-next"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-white/40
                         hover:text-white hover:bg-white/[0.08] disabled:opacity-20
                         disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Handoff log toast strip (shows last 2) */}
      {handoffLog.length > 0 && (
        <div className="flex flex-col gap-2">
          {handoffLog.slice(0, 2).map((h, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 rounded-xl
                         bg-emerald-500/10 border border-emerald-400/20 text-xs text-emerald-300"
            >
              <MessageCircle size={14} className="flex-shrink-0" />
              <span>WhatsApp handoff sent to <strong>{h.caller}</strong> at {h.sentAt}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
