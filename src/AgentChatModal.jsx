import React, { useState, useRef, useEffect } from 'react';
import api from './api/axios';
import { Bot, X, Send, Mic, Loader2, Volume2 } from 'lucide-react';

function GlassCard({ children, className = '' }) {
  return (
    <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl ${className}`}>
      {children}
    </div>
  );
}

export default function AgentChatModal({ agent, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: `Hi! I'm ${agent.name}. How can I help you today?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const audioRef = useRef(null);

  // 1. Generate a unique session ID when the modal opens
  useEffect(() => {
    const uniqueId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(uniqueId);
  }, [agent.id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    try {
      // Send message to backend and expect an audio stream (blob) in return
      const response = await api.post(`/agents/${agent.id}/chat`,
        {
          message: userText,
          sessionId: sessionId // Sending our session state to Java
        },
        { responseType: 'blob' } // Expecting raw audio bytes from ElevenLabs via Spring Boot
      );

      // Create a URL for the audio blob
      const audioUrl = URL.createObjectURL(response.data);

      // Add a dummy text response just for visual feedback
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: 'ElevenLabs synthesized this response!',
        audioUrl
      }]);

      // Play the audio natively
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }

    } catch (error) {
      console.error("Failed to get response from agent", error);
      setMessages(prev => [...prev, {
        role: 'system',
        text: 'Error communicating with the agent backend. Ensure POST /agents/{id}/chat is implemented.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <GlassCard className="w-full max-w-2xl h-[600px] flex flex-col relative shadow-2xl shadow-cyan-900/20 border-white/20 animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/20 flex items-center justify-center">
              <Bot size={20} className="text-cyan-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">{agent.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-white/50">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Online & Listening
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Hidden Audio Player */}
        <audio ref={audioRef} className="hidden" />

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                  ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-sm'
                  : msg.role === 'system'
                    ? 'bg-red-500/20 text-red-200 border border-red-500/30 text-sm mx-auto'
                    : 'bg-white/10 text-white border border-white/5 rounded-tl-sm'
                }`}>
                {msg.text}
                {msg.audioUrl && (
                  <div className="mt-2 flex items-center gap-2 text-cyan-300 bg-black/20 p-2 rounded-lg text-xs">
                    <Volume2 size={14} /> Playing Voice Synthesis...
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/10 border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2 text-white/50">
                <Loader2 size={16} className="animate-spin" />
                Synthesizing audio...
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02]">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message to synthesize speech..."
                className="w-full bg-black/30 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all"
                disabled={isTyping}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white/30 hover:text-cyan-400 transition-colors"
                title="Voice input (coming soon)"
              >
                <Mic size={16} />
              </button>
            </div>
            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/50 text-slate-900 p-3 rounded-xl shadow-lg shadow-cyan-500/20 transition-all focus:outline-none disabled:cursor-not-allowed"
            >
              <Send size={18} className={isTyping ? "opacity-50" : ""} />
            </button>
          </form>
        </div>

      </GlassCard>
    </div>
  );
}
