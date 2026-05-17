import React, { useEffect, useState } from 'react';
import api from './api/axios';
import { Bot, Mic, Cpu, Activity, RefreshCcw, Server, Plus, Trash2, Edit2, Play, X, MessageCircle } from 'lucide-react';
import AgentChatModal from './AgentChatModal';

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

const Dashboard = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voices, setVoices] = useState([]);
  const [voicesLoading, setVoicesLoading] = useState(false);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newAgent, setNewAgent] = useState({ name: '', systemPrompt: '', voiceId: '' });
  const [isVoiceDropdownOpen, setIsVoiceDropdownOpen] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [chatAgent, setChatAgent] = useState(null);

  useEffect(() => {
    fetchAgents();
    fetchVoices();
  }, []);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/agents');
      setAgents(response.data);
    } catch (error) {
      console.error("Failed to load agents", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVoices = async () => {
    setVoicesLoading(true);
    try {
      const response = await api.get('/voices');
      setVoices(response.data);
    } catch (error) {
      console.error("Failed to load voices from backend", error);
      // Fallback voices in case the backend /voices endpoint is not built yet
      setVoices([
        { voiceId: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel (ElevenLabs)', previewUrl: '' },
        { voiceId: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi (ElevenLabs)', previewUrl: '' },
        { voiceId: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella (ElevenLabs)', previewUrl: '' }
      ]);
    } finally {
      setVoicesLoading(false);
    }
  };

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    if (!newAgent.name || !newAgent.systemPrompt || !newAgent.voiceId) {
      alert("Validation Error: Please fill out all fields and select a voice!");
      return;
    }

    setIsCreating(true);
    try {
      await api.post('/agents', newAgent);
      setIsModalOpen(false);
      setNewAgent({ name: '', systemPrompt: '', voiceId: '' });
      fetchAgents();
    } catch (error) {
      console.error("Failed to create agent", error);
      alert("Backend API Error: Failed to create agent. Check your Spring Boot backend /api/v1/agents endpoint.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteAgent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this agent?")) return;

    try {
      await api.delete(`/agents/${id}`);
      fetchAgents();
    } catch (error) {
      console.error("Failed to delete agent", error);
    }
  };

  const playPreview = (e, url) => {
    e.stopPropagation();
    if (!url) return;

    if (playingAudio) {
      playingAudio.pause();
    }

    const audio = new Audio(url);
    audio.play();
    setPlayingAudio(audio);
  };

  return (
    <div className="flex flex-col gap-6 h-full text-white animate-in fade-in duration-500">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <Server size={24} className="text-cyan-400" strokeWidth={2} />
            Your AI Voice Agents
          </h1>
          <p className="text-sm text-white/40 mt-1">
            Manage and monitor your deployed AI voice agents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { fetchAgents(); fetchVoices(); }}
            className="flex items-center gap-2 text-xs font-medium text-white/70 hover:text-white
                       bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5
                       hover:bg-white/[0.1] hover:border-cyan-400/30 transition-all duration-300"
          >
            <RefreshCcw size={14} className={loading || voicesLoading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">{loading || voicesLoading ? "Refreshing..." : "Refresh"}</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 text-sm font-bold text-slate-900 bg-cyan-500
                       hover:bg-cyan-400 rounded-xl px-5 py-2.5 shadow-lg shadow-cyan-500/20 
                       transition-all duration-300 hover:-translate-y-0.5"
          >
            <Plus size={16} strokeWidth={2.5} />
            Create New Agent
          </button>
        </div>
      </div>

      {/* ── Agents Grid ── */}
      {loading && agents.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
          <RefreshCcw size={32} className="text-cyan-400 animate-spin mb-4 opacity-50" />
          <p className="text-white/40 font-medium">Loading agents...</p>
        </div>
      ) : agents.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] border border-white/10 rounded-2xl bg-white/[0.02]">
          <Bot size={48} className="text-white/20 mb-4" />
          <h2 className="text-lg font-semibold text-white/70 mb-2">No agents found</h2>
          <p className="text-sm text-white/40 text-center max-w-sm mb-6">
            You don't have any AI voice agents deployed yet. Create your first agent to get started.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 text-sm font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20
                       hover:bg-cyan-500/20 rounded-xl px-5 py-2.5 transition-all duration-300"
          >
            <Plus size={16} />
            Create Your First Agent
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {agents.map(agent => (
            <GlassCard key={agent.id} className="p-6 flex flex-col relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 hover:border-cyan-400/30 hover:shadow-[0_8px_30px_rgba(34,211,238,0.1)]">
              {/* Glow effect on hover */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/20 flex items-center justify-center">
                  <Bot size={24} className="text-cyan-400" />
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <Activity size={12} className="text-emerald-400" />
                  <span className="text-[10px] font-semibold text-emerald-400 tracking-wide">ACTIVE</span>
                </div>
              </div>

              <h2 className="font-bold text-lg text-white mb-2 relative z-10">{agent.name}</h2>
              <p className="text-sm text-white/50 mb-6 line-clamp-2 leading-relaxed relative z-10">
                {agent.systemPrompt || "No system prompt defined."}
              </p>

              <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <Mic size={14} className="text-white/30" />
                  <span className="text-xs font-mono text-cyan-400/80 bg-cyan-400/10 px-2 py-0.5 rounded-md border border-cyan-400/20 truncate max-w-[120px]" title={agent.voiceId}>
                    {agent.voiceId || "N/A"}
                  </span>
                </div>

                <div className="flex items-center gap-2 transition-opacity">
                  <button onClick={() => setChatAgent(agent)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-400 bg-cyan-400/10 hover:bg-cyan-400/20 rounded-lg transition-all border border-cyan-400/20" title="Chat & Synthesize Voice">
                    <MessageCircle size={14} />
                    Test Chat
                  </button>
                  <button className="p-1.5 text-white/40 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all" title="Edit Agent">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDeleteAgent(agent.id)} className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all" title="Delete Agent">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* ── Create Agent Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <GlassCard className="w-full max-w-lg p-6 sm:p-8 flex flex-col gap-6 relative shadow-2xl shadow-cyan-900/20 border-white/20 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white hover:bg-white/10 p-1 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>

            <div>
              <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                <Bot size={22} className="text-cyan-400" />
                Create New Agent
              </h2>
              <p className="text-sm text-white/50">Configure the personality and voice for your new AI agent.</p>
            </div>

            <form onSubmit={handleCreateAgent} className="flex flex-col gap-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Agent Name</label>
                <input
                  type="text"
                  required
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all"
                  placeholder="e.g. Sales Assistant"
                />
              </div>

              {/* System Prompt */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">System Prompt</label>
                <textarea
                  required
                  rows={4}
                  value={newAgent.systemPrompt}
                  onChange={(e) => setNewAgent({ ...newAgent, systemPrompt: e.target.value })}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all resize-none"
                  placeholder="You are a helpful sales assistant..."
                />
              </div>

              {/* Custom Voice Dropdown */}
              <div className="relative">
                <label className="block text-sm font-medium text-white/70 mb-1.5">Select Voice</label>
                <div
                  onClick={() => setIsVoiceDropdownOpen(!isVoiceDropdownOpen)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white flex items-center justify-between cursor-pointer hover:bg-white/[0.04] focus:border-cyan-400/50 transition-all"
                >
                  <span className={newAgent.voiceId ? "text-white" : "text-white/20"}>
                    {newAgent.voiceId
                      ? voices.find(v => v.voiceId === newAgent.voiceId)?.name || newAgent.voiceId
                      : "Choose a voice..."}
                  </span>
                  <div className={`text-white/50 pointer-events-none transition-transform duration-200 ${isVoiceDropdownOpen ? "rotate-180" : ""}`}>
                    ▼
                  </div>
                </div>

                {isVoiceDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-xl max-h-56 overflow-y-auto z-20">
                    {voicesLoading ? (
                      <div className="p-4 text-center text-white/40 text-sm flex items-center justify-center gap-2">
                        <RefreshCcw size={14} className="animate-spin" /> Loading voices...
                      </div>
                    ) : voices.length === 0 ? (
                      <div className="p-4 text-center text-white/40 text-sm">No voices available</div>
                    ) : (
                      voices.map(voice => (
                        <div
                          key={voice.voiceId}
                          className={`flex items-center justify-between px-4 py-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 ${newAgent.voiceId === voice.voiceId ? 'bg-cyan-500/10' : ''}`}
                          onClick={() => {
                            setNewAgent({ ...newAgent, voiceId: voice.voiceId });
                            setIsVoiceDropdownOpen(false);
                          }}
                        >
                          <span className={`text-sm ${newAgent.voiceId === voice.voiceId ? 'text-cyan-400 font-medium' : 'text-white/80'}`}>
                            {voice.name}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => playPreview(e, voice.previewUrl)}
                            className="p-1.5 bg-white/5 text-white/70 hover:bg-cyan-500/20 hover:text-cyan-400 rounded-full transition-colors focus:outline-none"
                            title="Play Preview"
                          >
                            <Play size={14} fill="currentColor" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-sm font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 focus:outline-none"
                >
                  {isCreating ? (
                    <>
                      <RefreshCcw size={16} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Agent"
                  )}
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* ── Voice Synthesis Chat Modal ── */}
      {chatAgent && (
        <AgentChatModal agent={chatAgent} onClose={() => setChatAgent(null)} />
      )}
    </div>
  );
};

export default Dashboard;
