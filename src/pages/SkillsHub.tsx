import React, { useState, useEffect } from 'react';
import { SkillsService } from '../api/apiService';
import { FinancialSkill } from '../types';
import { Sparkles, Play, CheckCircle2, Code2, Terminal, RefreshCw, Cpu, Layers } from 'lucide-react';
import { sound } from '../lib/sound';
import toast from 'react-hot-toast';

export const SkillsHub: React.FC = () => {
  const [skills, setSkills] = useState<FinancialSkill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<FinancialSkill | null>(null);
  const [params, setParams] = useState<Record<string, string | number>>({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<Record<string, unknown> | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  useEffect(() => {
    SkillsService.getSkills().then(data => {
      setSkills(data);
      if (data.length > 0) {
        setSelectedSkill(data[0]);
        setParams(data[0].defaultParams);
      }
    });
  }, []);

  const handleSelectSkill = (skill: FinancialSkill) => {
    sound.playClick();
    setSelectedSkill(skill);
    setParams(skill.defaultParams);
    setExecutionResult(null);
  };

  const handleRunSkill = async () => {
    if (!selectedSkill) return;
    setIsExecuting(true);
    sound.playAgentPulse();

    try {
      const result = await SkillsService.executeSkill(selectedSkill.id, params);
      setExecutionResult(result.output);
      sound.playTradeSuccess();
      toast.success(`Skill "${selectedSkill.name}" executed successfully (${result.executionTimeMs}ms)`);
    } finally {
      setIsExecuting(false);
    }
  };

  const categories = ['ALL', 'Quantitative', 'NLP Sentiment', 'Risk & Stress', 'Valuation', 'Automation'];

  const filteredSkills = activeCategory === 'ALL'
    ? skills
    : skills.filter(s => s.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-border shadow-tactile-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-tactile-sm">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Financial Agent Skills Hub
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary/20 text-primary border border-primary/30">
                agentskills.io Standard
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Standardized Algorithmic Tools, NLP Parsers, and Stress Testing Engines from <span className="font-mono text-foreground font-semibold">vibe-skills</span>
            </p>
          </div>
        </div>

        {/* CLI Snippet */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-subtle border border-border font-mono text-xs text-muted-foreground shadow-tactile-sm">
          <Terminal className="w-4 h-4 text-primary" />
          <span>npx vibe-skills add {selectedSkill?.id || 'browser-scraper'}</span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-surface-subtle border border-border w-fit text-xs">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              sound.playClick();
              setActiveCategory(cat);
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeCategory === cat
                ? 'bg-card text-foreground font-bold shadow-tactile-sm border border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Two-Column Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Skills Catalog (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-mono font-bold uppercase text-muted-foreground mb-2 flex items-center justify-between">
            <span>Available Standard Skills ({filteredSkills.length})</span>
            <span>vibe-skills v1.4</span>
          </div>

          {filteredSkills.map(skill => {
            const isSelected = selectedSkill?.id === skill.id;
            return (
              <div
                key={skill.id}
                onClick={() => handleSelectSkill(skill)}
                className={`p-4 rounded-xl border transition-all cursor-pointer shadow-tactile-sm ${
                  isSelected
                    ? 'bg-primary/10 border-primary shadow-tactile-md'
                    : 'bg-card border-border hover:border-muted-foreground'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{skill.icon}</span>
                    <div>
                      <h3 className="font-bold text-foreground text-sm tracking-tight">
                        {skill.name}
                      </h3>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-subtle text-muted-foreground border border-border">
                        {skill.category}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  )}
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
                  {skill.description}
                </p>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50 text-[10px] font-mono text-muted-foreground">
                  <span>ID: {skill.id}</span>
                  <span className="text-primary font-bold">{skill.compliance}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Interactive Execution Sandbox (7 cols) */}
        {selectedSkill && (
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-2xl bg-card border border-border shadow-tactile-sm space-y-6">
              
              <div className="flex items-start justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedSkill.icon}</span>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">
                      {selectedSkill.name}
                    </h2>
                    <p className="text-xs text-muted-foreground">{selectedSkill.description}</p>
                  </div>
                </div>

                <button
                  onClick={handleRunSkill}
                  disabled={isExecuting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-tactile-sm hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isExecuting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 fill-current" />
                  )}
                  <span>{isExecuting ? 'Executing Skill...' : 'Execute Skill'}</span>
                </button>
              </div>

              {/* Dynamic Input Parameters Form */}
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold uppercase text-muted-foreground block">
                  Input Parameters Schema
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(selectedSkill.inputsSchema).map(([key, label]) => (
                    <div key={key}>
                      <label className="block text-[11px] font-mono text-muted-foreground mb-1">
                        {label} <span className="text-primary font-bold">({key})</span>
                      </label>
                      <input
                        type="text"
                        value={params[key] ?? ''}
                        onChange={(e) => setParams(prev => ({ ...prev, [key]: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-surface-subtle border border-border text-foreground font-mono text-xs outline-none focus:border-primary"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Execution Output Console */}
              <div className="space-y-2 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-primary" />
                    <span>Live Output Payload (JSON-RPC)</span>
                  </span>
                  {executionResult && (
                    <span className="text-[10px] font-mono text-bull font-bold">
                      ● Status: OPTIMAL
                    </span>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-surface-subtle border border-border font-mono text-xs overflow-x-auto min-h-[160px] text-foreground">
                  {executionResult ? (
                    <pre className="text-emerald-400">
                      {JSON.stringify(executionResult, null, 2)}
                    </pre>
                  ) : (
                    <div className="h-full flex items-center justify-center py-12 text-muted-foreground text-xs">
                      Click "Execute Skill" to trigger the computation pipeline.
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default SkillsHub;
