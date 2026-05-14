import { useState } from 'react';
import {
  Settings,
  Mic,
  Play,
  Volume2,
  CheckCircle2,
  Globe2,
  Languages,
  MessageSquare,
  Phone,
  Radio,
  Zap,
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
   Section header with icon
───────────────────────────────────────────── */
function SectionHeader({ icon: Icon, iconClass, title, subtitle }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
      <div>
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Icon size={16} className={iconClass} strokeWidth={2} />
          {title}
        </h2>
        {subtitle && <p className="text-xs text-white/35 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Mock Voice Profiles
───────────────────────────────────────────── */
const VOICES = [
  { id: 'v1', name: 'Arjun', tone: 'Professional', gender: 'Male', accent: 'South Asian' },
  { id: 'v2', name: 'Dilini', tone: 'Friendly', gender: 'Female', accent: 'South Asian' },
  { id: 'v3', name: 'Sarah', tone: 'Empathetic', gender: 'Female', accent: 'American' },
  { id: 'v4', name: 'James', tone: 'Authoritative', gender: 'Male', accent: 'British' },
];

/* ─────────────────────────────────────────────
   AgentSettings Page
───────────────────────────────────────────── */
export default function AgentSettings() {
  const [activeVoice, setActiveVoice] = useState('v1');
  const [playingId, setPlayingId] = useState(null);
  const [language, setLanguage] = useState('en');
  const [autoDetect, setAutoDetect] = useState(true);
  const [templateText, setTemplateText] = useState('Hi {{name}}, here is the course brochure for {{course}}...');
  const [showToast, setShowToast] = useState(false);

  // Mock play function
  const handlePlay = (id, e) => {
    e.stopPropagation();
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
      setTimeout(() => setPlayingId(null), 3000); // Auto-stop after 3s
    }
  };

  const handleTestAutomation = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 h-full pb-8">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Settings size={20} className="text-cyan-400" strokeWidth={2} />
          Agent Settings
        </h1>
        <p className="text-sm text-white/35 mt-0.5">
          Configure voice, language, and telephony integrations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ── Left Column (Voice & Language) ── */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Voice Selection */}
          <GlassCard className="p-5">
            <SectionHeader
              icon={Mic}
              iconClass="text-violet-400"
              title="Voice Profile Selection"
              subtitle="Choose the synthetic voice for your AI agent"
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {VOICES.map((v) => {
                const isActive = activeVoice === v.id;
                const isPlaying = playingId === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => setActiveVoice(v.id)}
                    className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-300
                      ${isActive
                        ? 'bg-violet-500/10 border-violet-400/40 shadow-[0_0_15px_rgba(139,92,246,0.15)]'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/30 hover:bg-white/[0.05]'
                      }`}
                  >
                    {isActive && (
                      <div className="absolute top-3 right-3 text-violet-400">
                        <CheckCircle2 size={16} />
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          {v.name} <span className="text-white/40 font-normal">— {v.tone}</span>
                        </h3>
                        <p className="text-xs text-white/40 mt-1">
                          {v.gender} · {v.accent}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
                      <button
                        onClick={(e) => handlePlay(v.id, e)}
                        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors
                          ${isPlaying
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30'
                            : 'bg-white/[0.06] text-white/60 hover:text-white hover:bg-white/10'
                          }`}
                      >
                        {isPlaying ? <Volume2 size={12} className="animate-pulse" /> : <Play size={12} />}
                        {isPlaying ? 'Playing...' : 'Play Preview'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Language Toggle */}
          <GlassCard className="p-5">
            <SectionHeader
              icon={Languages}
              iconClass="text-amber-400"
              title="Language & Localization"
              subtitle="Configure the primary language and detection behaviour"
            />
            
            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 font-semibold mb-3">
                  Primary Language
                </label>
                <div className="flex items-center gap-3">
                  {/* English Toggle */}
                  <button
                    onClick={() => setLanguage('en')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all duration-200
                      ${language === 'en'
                        ? 'bg-amber-500/10 border-amber-400/40 text-amber-300'
                        : 'bg-white/[0.03] border-white/10 text-white/50 hover:bg-white/[0.06] hover:text-white/80'
                      }`}
                  >
                    <Globe2 size={16} />
                    <span className="text-sm font-medium">English</span>
                  </button>
                  
                  {/* Sinhala Toggle */}
                  <button
                    onClick={() => setLanguage('si')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all duration-200
                      ${language === 'si'
                        ? 'bg-amber-500/10 border-amber-400/40 text-amber-300'
                        : 'bg-white/[0.03] border-white/10 text-white/50 hover:bg-white/[0.06] hover:text-white/80'
                      }`}
                  >
                    <Globe2 size={16} />
                    <span className="text-sm font-medium">Sinhala</span>
                  </button>
                </div>
              </div>

              {/* Bilingual Auto-Detect Checkbox */}
              <div className="flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                <button
                  id="auto-detect-toggle"
                  onClick={() => setAutoDetect(!autoDetect)}
                  className={`w-10 h-5 rounded-full relative transition-colors duration-300 focus:outline-none flex-shrink-0
                    ${autoDetect ? 'bg-amber-500' : 'bg-white/20'}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300
                      ${autoDetect ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </button>
                <div>
                  <h4 className="text-sm font-medium text-white/90">Enable Bilingual Auto-Detection</h4>
                  <p className="text-xs text-white/40 mt-0.5">
                    Agent will automatically switch between English and Sinhala based on caller speech.
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

        </div>

        {/* ── Right Column (Integrations) ── */}
        <div className="flex flex-col gap-6">
          <GlassCard className="p-5">
            <SectionHeader
              icon={Radio}
              iconClass="text-emerald-400"
              title="API Integrations"
              subtitle="Telephony and messaging providers"
            />
            
            <div className="flex flex-col gap-4">
              {/* Twilio Card */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <Phone size={14} className="text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Twilio API</h4>
                      <p className="text-[10px] text-white/40">Voice & Telephony</p>
                    </div>
                  </div>
                  {/* Status Indicator */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-semibold tracking-wider uppercase">Connected</span>
                  </div>
                </div>
                
                <div className="text-xs text-white/50 font-mono bg-black/20 p-2 rounded-lg border border-white/5">
                  ID: ACf7...a891
                </div>
                <button className="text-xs font-medium text-cyan-400 hover:text-cyan-300 self-start">
                  Configure Webhooks →
                </button>
              </div>

              {/* WhatsApp Card */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <MessageSquare size={14} className="text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">WhatsApp Business</h4>
                      <p className="text-[10px] text-white/40">Manual Handoffs</p>
                    </div>
                  </div>
                  {/* Status Indicator */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-semibold tracking-wider uppercase">Connected</span>
                  </div>
                </div>
                
                <div className="text-xs text-white/50 font-mono bg-black/20 p-2 rounded-lg border border-white/5">
                  No: +1 (415) 820-3341
                </div>
                <button className="text-xs font-medium text-cyan-400 hover:text-cyan-300 self-start">
                  Manage Templates →
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Post-Call Automations */}
          <GlassCard className="p-5 relative overflow-hidden">
            <SectionHeader
              icon={Zap}
              iconClass="text-pink-400"
              title="Post-Call Automations"
              subtitle="Automate actions when a call ends"
            />
            
            <div className="flex flex-col gap-4">
              {/* Visual Workflow Card */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col gap-2">
                <div className="flex items-center flex-wrap gap-2 text-xs text-white/70 font-medium">
                  <span className="text-pink-400 font-bold">IF</span>
                  <span className="px-2 py-1 rounded bg-white/10 border border-white/5">Call Ends</span>
                  <span className="text-pink-400 font-bold">AND</span>
                  <span className="px-2 py-1 rounded bg-white/10 border border-white/5">Lead Captured</span>
                </div>
                <div className="flex items-center flex-wrap gap-2 text-xs text-white/70 font-medium mt-1">
                  <span className="text-cyan-400 font-bold">THEN</span>
                  <span className="px-2 py-1 rounded bg-cyan-500/20 border border-cyan-500/30 text-cyan-300">Send WhatsApp Message</span>
                </div>
              </div>

              {/* Template Editor */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/40 font-semibold mb-2">
                  Message Template
                </label>
                <textarea
                  value={templateText}
                  onChange={(e) => setTemplateText(e.target.value)}
                  rows={4}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl p-3
                             text-sm text-white/90 placeholder-white/20
                             focus:outline-none focus:border-pink-400/50 focus:bg-white/[0.06]
                             transition-all duration-200 resize-none font-mono text-xs"
                />
              </div>

              {/* Test Button */}
              <button
                onClick={handleTestAutomation}
                className="mt-2 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
                           bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)] hover:shadow-[0_0_25px_rgba(244,63,94,0.5)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <Zap size={16} />
                Test Automation
              </button>
            </div>
          </GlassCard>
        </div>

      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 right-8 flex items-center gap-2 bg-emerald-500/10 backdrop-blur-md text-emerald-300 px-4 py-3 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] border border-emerald-400/30 z-50 transition-all duration-300">
          <CheckCircle2 size={18} />
          <span className="text-sm font-medium">Automation triggered successfully!</span>
        </div>
      )}
    </div>
  );
}
