import { useState, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import { knowledgeService } from './api/services';
import {
  UploadCloud,
  FileText,
  FileSpreadsheet,
  X,
  CheckCircle2,
  Bot,
  Sparkles,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Save,
  FlaskConical,
  HelpCircle,
  AlertCircle,
  Loader2,
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
function SectionHeader({ icon: Icon, iconClass, title, subtitle, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
      <div>
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Icon size={16} className={iconClass} strokeWidth={2} />
          {title}
        </h2>
        {subtitle && <p className="text-xs text-white/35 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   File type icon helper
───────────────────────────────────────────── */
function FileIcon({ name }) {
  const ext = name.split('.').pop()?.toLowerCase();
  if (ext === 'csv') return <FileSpreadsheet size={16} className="text-emerald-400" />;
  return <FileText size={16} className="text-cyan-400" />;
}

/* ─────────────────────────────────────────────
   Upload Zone
───────────────────────────────────────────── */
function UploadZone({ files, onAdd, onRemove }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const processFiles = useCallback((rawFiles) => {
    const allowed = ['application/pdf', 'text/csv', 'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const valid = Array.from(rawFiles).filter((f) => allowed.includes(f.type) || f.name.endsWith('.csv') || f.name.endsWith('.pdf'));
    valid.forEach((f) => {
      onAdd({
        id: `${f.name}-${Date.now()}`,
        name: f.name,
        size: f.size,
        status: 'ready', // ready | uploading | done | error
      });
    });
  }, [onAdd]);

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const fmt = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const statusIcon = (status) => {
    switch (status) {
      case 'done':      return <CheckCircle2 size={14} className="text-emerald-400" />;
      case 'uploading': return <Loader2 size={14} className="text-cyan-400 animate-spin" />;
      case 'error':     return <AlertCircle size={14} className="text-rose-400" />;
      default:          return <UploadCloud size={14} className="text-white/30" />;
    }
  };

  return (
    <GlassCard className="overflow-hidden">
      <div className="p-5 border-b border-white/[0.07]">
        <SectionHeader
          icon={UploadCloud}
          iconClass="text-cyan-400"
          title="Training Data Upload"
          subtitle="Upload PDFs or CSVs to populate the AI's knowledge base"
        >
          <div className="flex items-center gap-2 text-xs text-white/30">
            <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/10">PDF</span>
            <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/10">CSV</span>
            <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/10">XLSX</span>
          </div>
        </SectionHeader>

        {/* Drop zone */}
        <div
          id="knowledge-upload-zone"
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            relative flex flex-col items-center justify-center gap-4 rounded-xl
            border-2 border-dashed cursor-pointer
            transition-all duration-300 py-14 px-6 text-center
            ${dragging
              ? 'border-cyan-400/70 bg-cyan-500/8 shadow-[inset_0_0_40px_rgba(6,182,212,0.06)]'
              : 'border-white/15 hover:border-white/30 hover:bg-white/[0.03] bg-transparent'}
          `}
        >
          {/* Animated ring on drag */}
          {dragging && (
            <span className="absolute inset-0 rounded-xl border-2 border-cyan-400/40 animate-ping pointer-events-none" />
          )}

          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300
            ${dragging ? 'bg-cyan-500/20 border border-cyan-400/30' : 'bg-white/5 border border-white/10'}`}>
            <UploadCloud size={28} className={dragging ? 'text-cyan-400' : 'text-white/25'} strokeWidth={1.5} />
          </div>

          <div>
            <p className={`text-sm font-medium transition-colors duration-200 ${dragging ? 'text-cyan-300' : 'text-white/60'}`}>
              {dragging ? 'Release to upload' : 'Drag & drop files here'}
            </p>
            <p className="text-xs text-white/25 mt-1">
              or <span className="text-cyan-400 underline underline-offset-2">click to browse</span> · Max 50 MB per file
            </p>
          </div>

          <input
            ref={inputRef}
            id="knowledge-file-input"
            type="file"
            multiple
            accept=".pdf,.csv,.xlsx"
            className="hidden"
            onChange={(e) => { processFiles(e.target.files); e.target.value = ''; }}
          />
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="divide-y divide-white/[0.06]">
          {files.map((f) => (
            <div key={f.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.03] transition-colors group">
              <FileIcon name={f.name} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white/80 truncate">{f.name}</p>
                <p className="text-[10px] text-white/30 mt-0.5">{fmt(f.size)}</p>
              </div>
              {statusIcon(f.status)}
              <button
                onClick={() => onRemove(f.id)}
                className="w-6 h-6 rounded-md flex items-center justify-center text-white/20 hover:text-rose-400 hover:bg-rose-400/10 transition-all opacity-0 group-hover:opacity-100"
                title="Remove file"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <div className="px-5 py-3 flex items-center justify-between">
            <span className="text-xs text-white/30">{files.length} file{files.length !== 1 ? 's' : ''} queued</span>
            <button
              id="knowledge-upload-btn"
              onClick={() => {
                toast.promise(
                  new Promise(resolve => setTimeout(resolve, 2000)),
                  {
                    loading: 'Processing Knowledge...',
                    success: 'Knowledge Base Updated',
                    error: 'Upload Failed',
                  }
                );
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-white px-4 py-2 rounded-lg
                         bg-gradient-to-r from-cyan-500 to-blue-600
                         shadow-[0_0_16px_rgba(6,182,212,0.4)]
                         hover:shadow-[0_0_24px_rgba(6,182,212,0.6)]
                         hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <UploadCloud size={13} />
              Upload to Knowledge Base
            </button>
          </div>
        </div>
      )}
    </GlassCard>
  );
}

/* ─────────────────────────────────────────────
   System Prompt Config
───────────────────────────────────────────── */
const PRESET_PROMPTS = [
  { label: 'Professional', value: 'You are Aria, a professional AI voice agent for SoviaAI. You speak clearly, concisely, and always maintain a courteous, enterprise-grade tone. You resolve queries efficiently and escalate to a human when required.' },
  { label: 'Friendly', value: 'You are Aria, a friendly and approachable AI voice agent. You speak warmly, use natural conversational language, and make customers feel genuinely heard. You aim to delight every caller.' },
  { label: 'Technical', value: 'You are Aria, a technical support AI voice agent. You are precise, methodical, and knowledgeable. You guide users through troubleshooting steps calmly and accurately, confirming understanding at each stage.' },
];

function SystemPromptConfig() {
  const [prompt, setPrompt] = useState(PRESET_PROMPTS[0].value);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const maxLen = 2000;

  const handleSave = async () => {
    try {
      await knowledgeService.updatePrompt(prompt);
      setSaved(true);
      toast.success('System Prompt Updated');
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      toast.error('Failed to update system prompt');
      console.error(error);
    }
  };

  return (
    <GlassCard className="overflow-hidden">
      {/* Header — collapsible */}
      <button
        id="system-prompt-toggle"
        className="w-full flex items-center justify-between px-5 py-4 border-b border-white/[0.07] hover:bg-white/[0.02] transition-colors"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="text-left">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Bot size={16} className="text-violet-400" strokeWidth={2} />
            System Prompt Configuration
          </h2>
          <p className="text-xs text-white/35 mt-0.5">Define the AI agent's personality, tone, and behaviour rules</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] text-white/25 font-mono hidden sm:block">
            {prompt.length}/{maxLen}
          </span>
          {expanded ? <ChevronUp size={15} className="text-white/30" /> : <ChevronDown size={15} className="text-white/30" />}
        </div>
      </button>

      {expanded && (
        <div className="p-5 flex flex-col gap-4">
          {/* Preset chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] text-white/30 uppercase tracking-widest mr-1">Presets:</span>
            {PRESET_PROMPTS.map((p) => (
              <button
                key={p.label}
                id={`prompt-preset-${p.label.toLowerCase()}`}
                onClick={() => setPrompt(p.value)}
                className={`text-xs px-3 py-1 rounded-full border transition-all duration-200
                  ${prompt === p.value
                    ? 'bg-violet-500/20 border-violet-400/30 text-violet-300'
                    : 'bg-white/5 border-white/10 text-white/45 hover:text-white/70 hover:border-white/25'}`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Textarea */}
          <div className="relative">
            <textarea
              id="system-prompt-textarea"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value.slice(0, maxLen))}
              rows={7}
              placeholder="Describe the agent's personality, tone, constraints, and escalation rules…"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3
                         text-sm text-white/80 placeholder-white/20
                         focus:outline-none focus:border-violet-400/40 focus:bg-white/[0.06]
                         resize-none transition-all duration-200 leading-relaxed
                         scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10"
            />
            {/* Char counter inside textarea */}
            <span className="absolute bottom-3 right-3 text-[10px] text-white/20 font-mono select-none pointer-events-none">
              {prompt.length}/{maxLen}
            </span>
          </div>

          {/* Hints */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { icon: Sparkles, text: 'Define tone & persona', color: 'text-violet-400' },
              { icon: AlertCircle, text: 'Set escalation rules',  color: 'text-amber-400' },
              { icon: HelpCircle, text: 'List topics to avoid',  color: 'text-rose-400' },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-white/35">
                <Icon size={12} className={color} />
                {text}
              </div>
            ))}
          </div>

          {/* Save row */}
          <div className="flex justify-end">
            <button
              id="system-prompt-save-btn"
              onClick={handleSave}
              className={`flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-xl transition-all duration-300
                ${saved
                  ? 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-300'
                  : 'bg-violet-500/20 border border-violet-400/25 text-violet-300 hover:bg-violet-500/30 hover:border-violet-400/50 hover:scale-[1.02] active:scale-[0.98]'}`}
            >
              {saved ? <CheckCircle2 size={13} /> : <Save size={13} />}
              {saved ? 'Saved!' : 'Save Prompt'}
            </button>
          </div>
        </div>
      )}
    </GlassCard>
  );
}

/* ─────────────────────────────────────────────
   Priority FAQ Manager
───────────────────────────────────────────── */
const INITIAL_FAQS = [
  {
    id: 'faq-1',
    question: 'What are your support hours?',
    answer: 'Our AI agents are available 24/7. Human escalation is available Monday–Friday, 9 AM–6 PM EST.',
  },
  {
    id: 'faq-2',
    question: 'How do I cancel my subscription?',
    answer: 'You can cancel anytime from the Billing section in your account settings, or ask me to connect you with the billing team.',
  },
];

function FAQManager() {
  const [faqs, setFaqs] = useState(INITIAL_FAQS);
  const [newQ, setNewQ] = useState('');
  const [newA, setNewA] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [faqSaved, setFaqSaved] = useState(false);
  const qRef = useRef(null);

  const addFaq = () => {
    if (!newQ.trim() || !newA.trim()) return;
    setFaqs((prev) => [...prev, { id: `faq-${Date.now()}`, question: newQ.trim(), answer: newA.trim() }]);
    setNewQ('');
    setNewA('');
    qRef.current?.focus();
  };

  const removeFaq = (id) => setFaqs((prev) => prev.filter((f) => f.id !== id));

  const updateFaq = (id, field, value) =>
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: value } : f)));

  const handleSaveFaqs = async () => {
    setFaqSaved(true);
    toast.promise(
      // Sends each FAQ entry to the backend. In a real app, you might send the whole array in one call.
      Promise.all(faqs.map(faq => knowledgeService.saveFAQ(faq.question, faq.answer))),
      {
        loading: 'Processing Knowledge...',
        success: 'Knowledge Base Updated',
        error: 'Save Failed',
      }
    );
    setTimeout(() => setFaqSaved(false), 2500);
  };

  return (
    <GlassCard className="overflow-hidden">
      <div className="px-5 py-4 border-b border-white/[0.07]">
        <SectionHeader
          icon={HelpCircle}
          iconClass="text-amber-400"
          title="Priority FAQ"
          subtitle="High-confidence Q&A pairs the AI will answer with certainty"
        >
          <span className="text-[10px] text-white/25 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
            {faqs.length} entries
          </span>
        </SectionHeader>
      </div>

      {/* Existing FAQ list */}
      <div className="divide-y divide-white/[0.05] max-h-72 overflow-y-auto">
        {faqs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-white/20">
            <HelpCircle size={28} strokeWidth={1.2} />
            <p className="text-xs">No FAQs yet — add one below</p>
          </div>
        )}

        {faqs.map((faq, idx) => (
          <div key={faq.id} className="group">
            {/* Question row */}
            <div className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.03] transition-colors cursor-pointer"
              onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}>
              <span className="text-[10px] font-mono text-white/20 w-5 flex-shrink-0">#{idx + 1}</span>
              <span className="flex-1 text-sm text-white/75 font-medium truncate">{faq.question}</span>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); removeFaq(faq.id); }}
                  className="w-6 h-6 flex items-center justify-center rounded-md text-white/25 hover:text-rose-400 hover:bg-rose-400/10 transition-all"
                  title="Remove FAQ"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              {expandedId === faq.id
                ? <ChevronUp size={14} className="text-white/30 flex-shrink-0" />
                : <ChevronDown size={14} className="text-white/20 flex-shrink-0" />
              }
            </div>

            {/* Expanded edit area */}
            {expandedId === faq.id && (
              <div className="px-5 pb-4 flex flex-col gap-2 bg-white/[0.02]">
                <input
                  value={faq.question}
                  onChange={(e) => updateFaq(faq.id, 'question', e.target.value)}
                  placeholder="Question"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5
                             text-sm text-white/80 placeholder-white/20
                             focus:outline-none focus:border-amber-400/40 transition-all"
                />
                <textarea
                  value={faq.answer}
                  onChange={(e) => updateFaq(faq.id, 'answer', e.target.value)}
                  rows={3}
                  placeholder="Answer"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5
                             text-sm text-white/70 placeholder-white/20 resize-none
                             focus:outline-none focus:border-amber-400/40 transition-all"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add new FAQ */}
      <div className="px-5 py-4 border-t border-white/[0.07] bg-white/[0.02] flex flex-col gap-3">
        <p className="text-[10px] uppercase tracking-widest text-white/25 font-semibold">Add New Entry</p>
        <input
          ref={qRef}
          id="faq-question-input"
          value={newQ}
          onChange={(e) => setNewQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && document.getElementById('faq-answer-input')?.focus()}
          placeholder="Question — e.g. How do I upgrade my plan?"
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3
                     text-sm text-white/80 placeholder-white/20
                     focus:outline-none focus:border-amber-400/40 focus:bg-white/[0.06] transition-all"
        />
        <textarea
          id="faq-answer-input"
          value={newA}
          onChange={(e) => setNewA(e.target.value)}
          rows={3}
          placeholder="Answer — e.g. You can upgrade from the Billing section…"
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3
                     text-sm text-white/70 placeholder-white/20 resize-none
                     focus:outline-none focus:border-amber-400/40 focus:bg-white/[0.06] transition-all"
        />

        <div className="flex items-center justify-between gap-3 mt-1">
          <button
            id="faq-add-btn"
            onClick={addFaq}
            disabled={!newQ.trim() || !newA.trim()}
            className="flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-xl
                       bg-amber-500/15 border border-amber-400/25 text-amber-300
                       hover:bg-amber-500/25 hover:border-amber-400/45
                       hover:scale-[1.02] active:scale-[0.98]
                       disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100
                       transition-all duration-200"
          >
            <Plus size={13} />
            Add FAQ
          </button>

          <button
            id="faq-save-btn"
            onClick={handleSaveFaqs}
            className={`flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-xl transition-all duration-300
              ${faqSaved
                ? 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-300'
                : 'bg-white/[0.06] border border-white/15 text-white/60 hover:text-white hover:border-white/30 hover:scale-[1.02] active:scale-[0.98]'}`}
          >
            {faqSaved ? <CheckCircle2 size={13} /> : <Save size={13} />}
            {faqSaved ? 'Saved!' : 'Save All FAQs'}
          </button>
        </div>
      </div>
    </GlassCard>
  );
}

/* ─────────────────────────────────────────────
   KnowledgeForge page root
───────────────────────────────────────────── */
export default function KnowledgeForge() {
  const [files, setFiles] = useState([]);

  const addFile = useCallback((f) => {
    setFiles((prev) => {
      // Deduplicate by name
      if (prev.some((p) => p.name === f.name)) return prev;
      return [...prev, f];
    });
  }, []);

  const removeFile = (id) => setFiles((prev) => prev.filter((f) => f.id !== id));

  return (
    <div className="flex flex-col gap-6 h-full">

      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <FlaskConical size={20} className="text-cyan-400" strokeWidth={2} />
          Knowledge Forge
        </h1>
        <p className="text-sm text-white/35 mt-0.5">
          Train and configure your AI voice agent's knowledge base and personality
        </p>
      </div>

      {/* Two-column layout on large screens */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1 min-h-0">

        {/* Left column */}
        <div className="flex flex-col gap-6">
          <UploadZone files={files} onAdd={addFile} onRemove={removeFile} />
          <SystemPromptConfig />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          <FAQManager />

          {/* Knowledge base status card */}
          <GlassCard className="p-5">
            <SectionHeader
              icon={Sparkles}
              iconClass="text-cyan-400"
              title="Knowledge Base Status"
              subtitle="Current training data indexed by the AI"
            />
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Documents', value: '24', color: 'text-cyan-300' },
                { label: 'FAQ Pairs',  value: '91', color: 'text-amber-300' },
                { label: 'Last Synced', value: '3m ago', color: 'text-emerald-300' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex flex-col items-center justify-center gap-1 py-4 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                  <span className={`text-2xl font-bold ${color}`}>{value}</span>
                  <span className="text-[10px] text-white/30 uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
