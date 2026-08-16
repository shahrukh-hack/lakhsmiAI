import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { AgencyService } from '../api/apiService';
import { FinancialAgent, WarRoomMessage } from '../types';
import { 
  Bot, 
  Send, 
  CheckCircle2, 
  Activity, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  TrendingUp, 
  RefreshCw,
  Cpu
} from 'lucide-react';
import { sound } from '../lib/sound';
import toast from 'react-hot-toast';

export const AgencyWarRoom: React.FC = () => {
  const { stocks } = useAppContext();
  const [agents, setAgents] = useState<FinancialAgent[]>([]);
  const [selectedStockSymbol, setSelectedStockSymbol] = useState<string>('RELIANCE');
  const [isDeliberating, setIsDeliberating] = useState(false);
  const [consensus, setConsensus] = useState<{
    verdict: 'STRONG BUY' | 'ACCUMULATE' | 'HOLD' | 'TRIM' | 'EXIT';
    confidence: number;
    targetMean: number;
  }>({
    verdict: 'STRONG BUY',
    confidence: 88,
    targetMean: 3180,
  });
  const [messages, setMessages] = useState<WarRoomMessage[]>([]);
  const [customTaskInput, setCustomTaskInput] = useState('');
  const [activeDepartment, setActiveDepartment] = useState<string>('ALL');

  useEffect(() => {
    AgencyService.getAgents().then(data => setAgents(data));
    runNewDeliberation('RELIANCE');
  }, []);

  const runNewDeliberation = async (symbol: string) => {
    setIsDeliberating(true);
    sound.playAgentPulse();
    setMessages([]);

    try {
      const result = await AgencyService.runDeliberation(symbol);
      setConsensus({
        verdict: result.consensusVerdict,
        confidence: result.consensusConfidence,
        targetMean: result.targetMean,
      });

      // Stream messages sequentially for dynamic war room vibe
      result.messages.forEach((msg, idx) => {
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              id: `msg-${Date.now()}-${idx}`,
              agentId: `agent-${idx}`,
              agentName: msg.agentName,
              avatar: msg.avatar,
              symbol: result.symbol,
              content: msg.text,
              verdict: msg.verdict.includes('BUY') ? 'BUY' : msg.verdict.includes('SELL') || msg.verdict.includes('TRIM') ? 'SELL' : 'HOLD',
              timestamp: 'Just now',
            }
          ]);
          sound.playAgentPulse();
        }, (idx + 1) * 350);
      });
    } finally {
      setTimeout(() => setIsDeliberating(false), 1600);
    }
  };

  const handleSendCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTaskInput.trim()) return;

    sound.playTradeSuccess();
    const newTask: WarRoomMessage = {
      id: `task-${Date.now()}`,
      agentId: 'user-lead',
      agentName: 'Trading Desk Commander (You)',
      avatar: '👑',
      symbol: selectedStockSymbol,
      content: customTaskInput,
      timestamp: 'Just now',
    };
    setMessages(prev => [newTask, ...prev]);
    setCustomTaskInput('');
    toast.success('Task dispatched to Agent Inboxes');

    // Auto agent reply
    setTimeout(() => {
      sound.playAgentPulse();
      setMessages(prev => [
        {
          id: `reply-${Date.now()}`,
          agentId: 'agent-quant',
          agentName: 'Quant-X Algorithmic',
          avatar: '📈',
          symbol: selectedStockSymbol,
          content: `Acknowledged: Executing multi-timeframe backtest and volatility screening for "${customTaskInput}". Optimization report ready in 400ms.`,
          verdict: 'BUY',
          timestamp: 'Just now'
        },
        ...prev
      ]);
    }, 1200);
  };

  const filteredAgents = activeDepartment === 'ALL'
    ? agents
    : agents.filter(a => a.department === activeDepartment);

  const selectedStock = stocks.find(s => s.symbol === selectedStockSymbol) || stocks[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* War Room Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-border shadow-tactile-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-tactile-sm">
            <Bot className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Multi-Agent Financial War Room
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary/20 text-primary border border-primary/30">
                5 Active Agents
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Autonomous Consensus Engine powered by <span className="font-mono text-foreground font-semibold">vibe-agency</span>
            </p>
          </div>
        </div>

        {/* Asset Selector & Deliberation Trigger */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedStockSymbol}
            onChange={(e) => {
              setSelectedStockSymbol(e.target.value);
              runNewDeliberation(e.target.value);
            }}
            className="px-3 py-2 rounded-xl bg-surface-subtle border border-border text-foreground font-mono text-sm font-semibold outline-none focus:border-primary cursor-pointer shadow-tactile-sm"
          >
            {stocks.map(s => (
              <option key={s.id} value={s.symbol}>
                {s.symbol} — {s.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => runNewDeliberation(selectedStockSymbol)}
            disabled={isDeliberating}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 active:scale-95 transition-all shadow-tactile-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isDeliberating ? 'animate-spin' : ''}`} />
            <span>{isDeliberating ? 'Deliberating...' : 'Trigger Deliberation'}</span>
          </button>
        </div>
      </div>

      {/* Consensus Verdict Radar Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Consensus Verdict */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-tactile-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
              Consensus Recommendation
            </div>
            <div className="text-2xl font-bold font-mono text-primary mt-1 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6" />
              <span>{consensus.verdict}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Based on Quant, Valuation, Sentiment & Macro votes
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-muted-foreground font-mono">Target Mean</span>
            <div className="text-xl font-bold font-num text-foreground">
              ₹{consensus.targetMean.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Confidence Gauge */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-tactile-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
              Agent Confidence Score
            </span>
            <span className="text-base font-bold font-mono text-primary">{consensus.confidence}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-border overflow-hidden mb-2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-primary transition-all duration-700"
              style={{ width: `${consensus.confidence}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>Low Dissensus</span>
            <span>High Convergence</span>
          </div>
        </div>

        {/* Selected Asset Snapshot */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-tactile-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
              Active Focus
            </div>
            <div className="text-xl font-bold text-foreground mt-1">
              {selectedStock?.symbol}
            </div>
            <div className="text-xs text-muted-foreground">
              {selectedStock?.name}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold font-num text-foreground">
              ₹{selectedStock?.price.toLocaleString()}
            </div>
            <div className={`text-xs font-mono font-bold ${selectedStock?.change && selectedStock.change >= 0 ? 'text-bull' : 'text-bear'}`}>
              {selectedStock?.change && selectedStock.change >= 0 ? `+${selectedStock.change}%` : `${selectedStock?.change}%`}
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: Agents Roster & Live Deliberation Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: 5 Specialized Agent Persona Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" />
              <span>Agency Fleet Personas</span>
            </h2>
            
            {/* Department Filter */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-subtle border border-border text-[11px]">
              {['ALL', 'Quantitative', 'Fundamental', 'Risk'].map(dep => (
                <button
                  key={dep}
                  onClick={() => {
                    sound.playClick();
                    setActiveDepartment(dep);
                  }}
                  className={`px-2 py-0.5 rounded font-mono transition-all ${
                    activeDepartment === dep ? 'bg-primary text-primary-foreground font-bold' : 'text-muted-foreground'
                  }`}
                >
                  {dep === 'Quantitative' ? 'Quant' : dep === 'Fundamental' ? 'Val' : dep}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredAgents.map(agent => (
              <div
                key={agent.id}
                className="p-4 rounded-xl bg-card border border-border hover:border-primary/40 transition-all shadow-tactile-sm group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{agent.avatar}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-sm">{agent.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-subtle text-muted-foreground border border-border">
                          {agent.code}
                        </span>
                      </div>
                      <div className="text-xs text-primary font-medium">{agent.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
                    <Activity className="w-3 h-3 text-emerald-400" />
                    <span>{agent.accuracyRate}%</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 mt-2 font-sans bg-surface-subtle/50 p-2 rounded-lg border border-border/50">
                  {agent.specialty}
                </p>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50 text-[11px] text-muted-foreground font-mono">
                  <span>Tasks: {agent.recentTasksCount}</span>
                  <span className="inline-flex items-center gap-1 text-bull">
                    <CheckCircle2 className="w-3 h-3" /> Standby Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Real-time War Room Deliberation Feed (7 cols) */}
        <div className="lg:col-span-7 flex flex-col h-full space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Live Deliberation Debate & Consensus Feed</span>
            </h2>
            <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> Real-time stream
            </span>
          </div>

          {/* Messages Container */}
          <div className="flex-1 min-h-[480px] max-h-[580px] overflow-y-auto p-4 rounded-2xl bg-card border border-border shadow-tactile-sm space-y-3">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Bot className="w-12 h-12 text-muted-foreground/40 mb-3 animate-bounce" />
                <p className="text-sm font-semibold">Agents are analyzing {selectedStockSymbol}...</p>
                <p className="text-xs text-muted-foreground mt-1">Processing order book depth, MACD, SEC disclosures</p>
              </div>
            ) : (
              messages.map(msg => (
                <div
                  key={msg.id}
                  className="p-4 rounded-xl bg-surface-subtle/80 border border-border/80 hover:border-primary/30 transition-all text-xs space-y-2 animate-in fade-in slide-in-from-bottom-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{msg.avatar}</span>
                      <span className="font-bold text-foreground">{msg.agentName}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">({msg.symbol})</span>
                    </div>
                    {msg.verdict && (
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase ${
                        msg.verdict === 'BUY' 
                          ? 'bg-bull/20 text-bull border border-bull/30' 
                          : msg.verdict === 'SELL' 
                            ? 'bg-bear/20 text-bear border border-bear/30' 
                            : 'bg-muted text-muted-foreground'
                      }`}>
                        VERDICT: {msg.verdict}
                      </span>
                    )}
                  </div>

                  <p className="text-foreground/90 text-xs leading-relaxed font-sans pl-7">
                    {msg.content}
                  </p>

                  <div className="flex justify-end pl-7 text-[10px] font-mono text-muted-foreground">
                    <span>{msg.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Task Dispatcher Form */}
          <form onSubmit={handleSendCustomTask} className="flex items-center gap-2">
            <input
              type="text"
              value={customTaskInput}
              onChange={(e) => setCustomTaskInput(e.target.value)}
              placeholder={`Instruct agents to analyze ${selectedStockSymbol} (e.g. "Simulate 20% tariff shock on margins")...`}
              className="flex-1 px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground text-xs font-medium outline-none focus:border-primary shadow-tactile-sm"
            />
            <button
              type="submit"
              className="px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition-all shadow-tactile-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default AgencyWarRoom;
