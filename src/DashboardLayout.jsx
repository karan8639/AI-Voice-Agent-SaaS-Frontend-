import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FlaskConical,
  PhoneCall,
  Settings,
  Mic2,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  Users,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Nav link data
───────────────────────────────────────────── */
const NAV_LINKS = [
  {
    path: '/dashboard/home',
    label: 'Command Center',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    path: '/dashboard/knowledge',
    label: 'Knowledge Forge',
    icon: FlaskConical,
    badge: 'New',
  },
  {
    path: '/dashboard/calls',
    label: 'Call Intelligence',
    icon: PhoneCall,
    badge: '12',
  },
  {
    path: '/dashboard/team',
    label: 'Team',
    icon: Users,
    badge: null,
  },
  {
    path: '/dashboard/settings',
    label: 'Settings',
    icon: Settings,
    badge: null,
  },
];

/* ─────────────────────────────────────────────
   Sidebar
───────────────────────────────────────────── */
function Sidebar({ collapsed, onToggleCollapse }) {
  return (
    <aside
      className={`
        relative flex flex-col h-full z-20
        bg-white/5 backdrop-blur-md border-r border-white/10
        transition-all duration-300 ease-in-out flex-shrink-0
        ${collapsed ? 'w-[68px]' : 'w-[220px]'}
      `}
    >
      {/* Logo */}
      <div
        className={`
          flex items-center gap-3 px-4 h-16 border-b border-white/10 flex-shrink-0
          ${collapsed ? 'justify-center px-0' : ''}
        `}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 flex-shrink-0">
          <Mic2 size={15} className="text-white" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <span className="text-white font-semibold text-[15px] tracking-tight whitespace-nowrap">
            Sovia<span className="text-cyan-400">AI</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
        {!collapsed && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25 px-2 mb-3">
            Menu
          </p>
        )}

        {NAV_LINKS.map(({ path, label, icon: Icon, badge }) => {
          return (
            <NavLink
              key={path}
              to={path}
              id={`sidebar-nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
              title={collapsed ? label : undefined}
              className={({ isActive }) => `
                w-full flex items-center gap-3 rounded-xl px-3 py-2.5
                text-sm font-medium transition-all duration-200 group relative
                ${isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/20 shadow-sm shadow-cyan-500/10'
                  : 'text-white/50 hover:bg-white/5 hover:text-white/90 border border-transparent'}
                ${collapsed ? 'justify-center px-0' : ''}
              `}
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-cyan-400" />
                  )}

                  <Icon
                    size={17}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className={`flex-shrink-0 transition-colors ${isActive ? 'text-cyan-400' : 'text-white/40 group-hover:text-white/70'}`}
                  />

                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left truncate">{label}</span>
                      {badge && (
                        <span
                          className={`
                            text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none
                            ${badge === 'New'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/20'
                              : 'bg-white/10 text-white/60'}
                          `}
                        >
                          {badge}
                        </span>
                      )}
                    </>
                  )}

                  {/* Tooltip for collapsed mode */}
                  {collapsed && (
                    <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-white/10 z-50">
                      {label}
                      {badge && (
                        <span className="ml-1.5 text-cyan-400">({badge})</span>
                      )}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User profile */}
      <div className="flex-shrink-0 border-t border-white/10 p-3">
        <div
          className={`
            flex items-center gap-3 rounded-xl p-2.5
            bg-white/[0.04] border border-white/[0.08]
            hover:bg-white/[0.07] transition-colors cursor-pointer
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
              A
            </div>
            {/* Status dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          </div>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white/90 truncate leading-tight">
                Admin
              </p>
              <p className="text-[10px] text-emerald-400 font-medium leading-tight flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                Online
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle button */}
      <button
        id="sidebar-collapse-btn"
        onClick={onToggleCollapse}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full
                   bg-slate-800 border border-white/15 text-white/50
                   hover:text-white hover:border-white/30 hover:bg-slate-700
                   flex items-center justify-center transition-all duration-200
                   shadow-lg z-30"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed
          ? <ChevronRight size={12} strokeWidth={2.5} />
          : <ChevronLeft size={12} strokeWidth={2.5} />
        }
      </button>
    </aside>
  );
}

/* ─────────────────────────────────────────────
   Top bar (inside main content area)
───────────────────────────────────────────── */
function Topbar() {
  const location = useLocation();
  const currentPage = NAV_LINKS.find((n) => location.pathname.includes(n.path))?.label ?? 'Dashboard';

  return (
    <header className="flex-shrink-0 h-14 flex items-center justify-between px-6 border-b border-white/[0.08] bg-white/[0.02] backdrop-blur-sm">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-white/30">SoviaAI</span>
        <ChevronRight size={13} className="text-white/20" />
        <span className="text-white/80 font-medium">{currentPage}</span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button
          id="topbar-search-btn"
          className="flex items-center gap-2 text-sm text-white/35 hover:text-white/70
                     bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08]
                     rounded-lg px-3 py-1.5 transition-all duration-200"
        >
          <Search size={13} />
          <span className="hidden sm:inline text-xs">Search…</span>
          <kbd className="hidden sm:inline text-[10px] bg-white/10 px-1 rounded ml-1">⌘K</kbd>
        </button>

        {/* Notifications */}
        <button
          id="topbar-notifications-btn"
          className="relative w-8 h-8 flex items-center justify-center rounded-lg
                     bg-white/[0.04] border border-white/[0.08]
                     text-white/40 hover:text-white/80 hover:bg-white/[0.08]
                     transition-all duration-200"
        >
          <Bell size={15} />
          {/* Notification pip */}
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(6,182,212,0.8)]" />
        </button>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────
   DashboardLayout — main shell
───────────────────────────────────────────── */
export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950">

      {/* Subtle background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] -z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      {/* Radial glow accent */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[400px] rounded-full bg-cyan-800/10 blur-[120px] pointer-events-none -z-0" />

      {/* ── Sidebar ── */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
      />

      {/* ── Main area ── */}
      <div className="flex flex-col flex-1 min-w-0 relative z-10">

        {/* Top bar */}
        <Topbar />

        {/* Content */}
        <main
          id="dashboard-main-content"
          className="flex-1 overflow-y-auto overflow-x-hidden p-6"
        >
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
