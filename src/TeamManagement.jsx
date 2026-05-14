import { useState } from 'react';
import {
  Users,
  UserPlus,
  Mail,
  Shield,
  ChevronDown,
  MoreVertical,
  Activity,
  CheckCircle2,
  AlertCircle
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
   Mock Data
───────────────────────────────────────────── */
const INITIAL_MEMBERS = [
  { id: 1, name: 'Alex Thompson', email: 'alex@sovia.ai', role: 'Admin', lastActive: 'Just now', status: 'online' },
  { id: 2, name: 'Sarah Chen', email: 'sarah@sovia.ai', role: 'Manager', lastActive: '2h ago', status: 'offline' },
  { id: 3, name: 'Marcus Johnson', email: 'marcus@sovia.ai', role: 'Agent', lastActive: '5m ago', status: 'online' },
  { id: 4, name: 'Emily Davis', email: 'emily@sovia.ai', role: 'Agent', lastActive: '1d ago', status: 'offline' },
  { id: 5, name: 'David Wilson', email: 'david@sovia.ai', role: 'Agent', lastActive: 'Pending invite', status: 'pending' },
];

const ROLES = ['Admin', 'Manager', 'Agent'];

export default function TeamManagement() {
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Agent');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);

  const totalSeats = 10;
  const usedSeats = members.length;
  const usagePercentage = (usedSeats / totalSeats) * 100;

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail) return;

    setInviteSent(true);
    setMembers([
      ...members,
      {
        id: Date.now(),
        name: 'Pending User',
        email: inviteEmail,
        role: inviteRole,
        lastActive: 'Pending invite',
        status: 'pending'
      }
    ]);
    
    setTimeout(() => {
      setInviteSent(false);
      setInviteEmail('');
    }, 2500);
  };

  return (
    <div className="flex flex-col gap-6 h-full pb-8">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Users size={20} className="text-cyan-400" strokeWidth={2} />
          Team Management
        </h1>
        <p className="text-sm text-white/35 mt-0.5">
          Manage your workspace members and role permissions
        </p>
      </div>

      {/* Usage Meter */}
      <div className="relative rounded-2xl bg-black/40 backdrop-blur-2xl border border-cyan-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(6,182,212,0.15)] flex flex-col justify-center min-h-[140px] p-6 sm:p-8">
        {/* Background glow isolation to prevent cutting off text shadows outside the container */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/20 blur-[100px] rounded-full" />
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 w-full">
          <div className="flex flex-col justify-center">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Activity size={20} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" strokeWidth={2} />
              <span className="tracking-wide">Plan Usage</span>
            </h2>
            <p className="text-sm text-cyan-100/50 mt-1.5">
              You are currently on the <span className="text-white/90 font-medium">Enterprise Plan</span>
            </p>
          </div>
          <div className="text-right flex items-baseline justify-end gap-1.5">
            <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 leading-normal py-1 drop-shadow-sm">{usedSeats}</span>
            <span className="text-sm text-white/50 font-medium whitespace-nowrap">/ {totalSeats} Seats Filled</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 w-full h-3 bg-black/60 rounded-full overflow-hidden border border-white/5 relative z-10 shadow-inner flex-shrink-0">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(6,182,212,0.8),inset_0_0_8px_rgba(255,255,255,0.4)] animate-pulse"
            style={{ width: `${usagePercentage}%`, backgroundSize: '200% 100%' }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Member List */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <GlassCard className="flex flex-col flex-1 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.07]">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Users size={16} className="text-violet-400" strokeWidth={2} />
                Current Team Members
              </h2>
            </div>
            
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white/[0.02] border-b border-white/[0.05]">
                  <tr>
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-white/35">Member</th>
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-white/35">Role</th>
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-white/35">Last Active</th>
                    <th className="px-5 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-white/10 flex items-center justify-center text-xs font-medium text-cyan-300">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white/90">{member.name}</p>
                            <p className="text-xs text-white/40">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded border border-white/10 bg-white/5 text-[11px] font-medium text-white/60">
                          {member.role}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            member.status === 'online' ? 'bg-emerald-400 animate-pulse' : 
                            member.status === 'pending' ? 'bg-amber-400' : 'bg-white/20'
                          }`} />
                          <span className={`text-xs ${member.status === 'pending' ? 'text-amber-400/80 italic' : 'text-white/50'}`}>
                            {member.lastActive}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button className="text-white/20 hover:text-white/80 transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Invite Form */}
        <div className="flex flex-col gap-6">
          <GlassCard className="p-5 relative overflow-visible">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
              <UserPlus size={16} className="text-cyan-400" strokeWidth={2} />
              Invite New Member
            </h2>
            
            <form onSubmit={handleInvite} className="flex flex-col gap-4">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-4 py-2.5
                               text-sm text-white/90 placeholder-white/20
                               focus:outline-none focus:border-cyan-400/50 focus:bg-white/[0.06]
                               transition-all duration-200"
                  />
                </div>
              </div>

              {/* Role Dropdown (Custom) */}
              <div className="relative">
                <label className="block text-xs font-medium text-white/50 mb-1.5">Role Permission</label>
                <button
                  type="button"
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="w-full flex items-center justify-between bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2.5
                             text-sm text-white/90 hover:bg-white/[0.06] transition-all duration-200"
                >
                  <span className="flex items-center gap-2">
                    <Shield size={14} className="text-white/40" />
                    {inviteRole}
                  </span>
                  <ChevronDown size={14} className={`text-white/40 transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {roleDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900 border border-white/10 rounded-xl overflow-hidden z-20 shadow-xl">
                    {ROLES.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => { setInviteRole(r); setRoleDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                          ${inviteRole === r ? 'bg-cyan-500/10 text-cyan-300' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!inviteEmail || usedSeats >= totalSeats}
                className={`mt-2 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
                  ${inviteSent 
                    ? 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-300' 
                    : usedSeats >= totalSeats
                      ? 'bg-white/[0.05] border border-white/5 text-white/30 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:scale-[1.02] active:scale-[0.98]'
                  }`}
              >
                {inviteSent ? <CheckCircle2 size={16} /> : <UserPlus size={16} />}
                {inviteSent ? 'Invite Sent' : usedSeats >= totalSeats ? 'No Seats Available' : 'Send Invite'}
              </button>
              
              {usedSeats >= totalSeats && (
                <p className="text-[10px] text-amber-400/80 text-center flex items-center justify-center gap-1 mt-1">
                  <AlertCircle size={10} /> Plan limit reached
                </p>
              )}
            </form>
          </GlassCard>
        </div>
        
      </div>
    </div>
  );
}
