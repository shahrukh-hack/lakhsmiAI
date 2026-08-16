import React, { useState, useEffect } from 'react';
import { MemoryService } from '../api/apiService';
import { TradeThesisMemory, ArchitectureDecision } from '../types';
import { Brain, Plus, CheckCircle, AlertTriangle, ShieldCheck, Database, Zap, BookOpen, Layers } from 'lucide-react';
import { sound } from '../lib/sound';
import toast from 'react-hot-toast';

export const FinancialMemory: React.FC = () => {
  const [theses, setTheses] = useState<TradeThesisMemory[]>([]);
  const [adrs, setAdrs] = useState<ArchitectureDecision[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'theses' | 'adrs' | 'telemetry'>('theses');

  // Form State
  const [newSymbol, setNewSymbol] = useState('TCS');
  const [newTitle, setNewTitle] = useState('');
  const [newHypothesis, setNewHypothesis] = useState('');
  const [newCatalysts, setNewCatalysts] = useState('');
  const [newInvalidation, setNewInvalidation] = useState('');

  useEffect(() => {
    MemoryService.getTheses().then(data => setTheses(data));
    MemoryService.getAdrs().then(data => setAdrs(data));
  }, []);

  const handleCreateThesis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newHypothesis.trim()) return;

    sound.playTradeSuccess();
    const created = await MemoryService.addThesis({
      symbol: newSymbol.toUpperCase(),
      title: newTitle,
      hypothesis: newHypothesis,
      catalysts: newCatalysts.split(',').map(c => c.trim()).filter(Boolean),
      invalidationCriteria: newInvalidation || 'Loss exceeding 5% from entry price',
      targetHorizon: '3-6 Months',
      authorAgent: 'AlphaVal Intrinsic',
      status: 'ACTIVE',
    });

    setTheses(prev => [created, ...prev]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewHypothesis('');
    setNewCatalysts('');
    setNewInvalidation('');
    toast.success('New Trade Thesis logged into Universal Memory');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-border shadow-tactile-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-tactile-sm">
            <Brain className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Universal Financial Memory Protocol
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary/20 text-primary border border-primary/30">
                vibe-memory AST
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Long-Term Context Engine, Architectural Strategy Logs & Post-Mortem Analytics
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            sound.playClick();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-tactile-sm hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Trade Thesis</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-surface-subtle border border-border w-fit">
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('theses');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'theses'
              ? 'bg-card text-foreground font-bold shadow-tactile-sm border border-border'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Active Theses & Journal ({theses.length})</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('adrs');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'adrs'
              ? 'bg-card text-foreground font-bold shadow-tactile-sm border border-border'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Strategy Decisions (ADRs) ({adrs.length})</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('telemetry');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'telemetry'
              ? 'bg-card text-foreground font-bold shadow-tactile-sm border border-border'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Token & Cost Telemetry</span>
        </button>
      </div>

      {/* Tab 1: Trade Theses Journal */}
      {activeTab === 'theses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {theses.map((thesis) => (
            <div
              key={thesis.id}
              className="p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all shadow-tactile-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 font-mono font-bold text-xs">
                      {thesis.symbol}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                      Horizon: {thesis.targetHorizon}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-bull/20 text-bull border border-bull/30">
                    {thesis.status}
                  </span>
                </div>

                <h3 className="font-bold text-foreground text-base mb-2">
                  {thesis.title}
                </h3>

                <p className="text-xs text-foreground/80 leading-relaxed bg-surface-subtle p-3 rounded-xl border border-border/60">
                  {thesis.hypothesis}
                </p>
              </div>

              {/* Catalysts & Invalidation */}
              <div className="space-y-2 pt-3 border-t border-border/50 text-xs">
                <div>
                  <span className="font-mono text-muted-foreground font-semibold text-[11px] block mb-1">
                    Key Catalysts:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {thesis.catalysts.map((cat, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-surface-subtle text-muted-foreground text-[10px] border border-border">
                        • {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-1.5 text-amber-400 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span><strong>Invalidation:</strong> {thesis.invalidationCriteria}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground font-mono">
                <span>Author: {thesis.authorAgent}</span>
                <span>Logged: {thesis.dateCreated}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: ADR Decisions */}
      {activeTab === 'adrs' && (
        <div className="space-y-4">
          {adrs.map(adr => (
            <div
              key={adr.id}
              className="p-5 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all shadow-tactile-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-primary text-xs px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                    {adr.code}
                  </span>
                  <span className="font-bold text-foreground text-sm">{adr.title}</span>
                </div>
                <span className="text-xs font-mono text-muted-foreground px-2 py-0.5 rounded bg-surface-subtle border border-border">
                  {adr.category}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-1">
                {adr.summary}
              </p>
              <div className="mt-3 pt-2 border-t border-border/50 text-[10px] font-mono text-muted-foreground">
                Documented on {adr.date}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Token Telemetry */}
      {activeTab === 'telemetry' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-tactile-sm">
            <div className="text-xs font-mono text-muted-foreground uppercase font-bold">
              Token Efficiency Ratio
            </div>
            <div className="text-3xl font-bold font-mono text-primary mt-2">
              97.4%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              AST pruning reduces query payload from 124k tokens to 3.2k tokens per market scan.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border shadow-tactile-sm">
            <div className="text-xs font-mono text-muted-foreground uppercase font-bold">
              Cost Saved ($/Month)
            </div>
            <div className="text-3xl font-bold font-mono text-bull mt-2">
              $482.50
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Deterministic symbol caching eliminates repeated model invocations.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border shadow-tactile-sm">
            <div className="text-xs font-mono text-muted-foreground uppercase font-bold">
              Memory AST Nodes
            </div>
            <div className="text-3xl font-bold font-mono text-foreground mt-2">
              1,420
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Cross-session handoff nodes across all registered ticker symbols.
            </p>
          </div>
        </div>
      )}

      {/* Create Thesis Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-2xl bg-card border border-border p-6 shadow-tactile-lg space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-foreground text-base flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                <span>Log New Investment Thesis</span>
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateThesis} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-muted-foreground mb-1 uppercase font-mono">
                  Asset Symbol
                </label>
                <input
                  type="text"
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-subtle border border-border text-foreground font-mono font-bold outline-none focus:border-primary"
                  placeholder="e.g. RELIANCE, NVDA, BTC"
                />
              </div>

              <div>
                <label className="block font-bold text-muted-foreground mb-1 uppercase font-mono">
                  Thesis Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-subtle border border-border text-foreground font-semibold outline-none focus:border-primary"
                  placeholder="e.g. Next-Gen AI Silicon Cycle Acceleration"
                />
              </div>

              <div>
                <label className="block font-bold text-muted-foreground mb-1 uppercase font-mono">
                  Hypothesis & Rationale
                </label>
                <textarea
                  rows={3}
                  value={newHypothesis}
                  onChange={(e) => setNewHypothesis(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-subtle border border-border text-foreground outline-none focus:border-primary resize-none"
                  placeholder="Why is this asset mispriced? What fundamental shift creates the alpha?"
                />
              </div>

              <div>
                <label className="block font-bold text-muted-foreground mb-1 uppercase font-mono">
                  Catalysts (comma-separated)
                </label>
                <input
                  type="text"
                  value={newCatalysts}
                  onChange={(e) => setNewCatalysts(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-subtle border border-border text-foreground outline-none focus:border-primary"
                  placeholder="Earnings surprise, New contract announcement, Rate cut"
                />
              </div>

              <div>
                <label className="block font-bold text-muted-foreground mb-1 uppercase font-mono">
                  Invalidation Criteria (Stop Logic)
                </label>
                <input
                  type="text"
                  value={newInvalidation}
                  onChange={(e) => setNewInvalidation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-subtle border border-border text-foreground outline-none focus:border-primary"
                  placeholder="e.g. Close below 200 EMA or revenue miss > 5%"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface-subtle text-muted-foreground hover:text-foreground font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:brightness-110 active:scale-95 transition-all shadow-tactile-sm"
                >
                  Save to Universal Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default FinancialMemory;
