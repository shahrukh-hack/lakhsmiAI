import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Bot, Send, X, Sparkles, TrendingUp, ShieldAlert, Zap, ArrowRight, CornerDownLeft } from 'lucide-react';
import { sound } from '../../lib/sound';
import { useNavigate } from 'react-router-dom';

interface CopilotMessage {
  id: string;
  sender: 'user' | 'agent';
  agentName?: string;
  avatar?: string;
  text: string;
  actionStockId?: string;
  actionType?: 'buy' | 'sell';
  timestamp: string;
}

export const CopilotDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { stocks, addPaperTrade } = useAppContext();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'welcome',
      sender: 'agent',
      agentName: 'Lakshmi AI Trade Copilot',
      avatar: '🤖',
      text: 'Greetings Trader! I synthesize live input from Quant-X, AlphaVal, SentimentPulse, and RiskSentinel. Ask me for trade ideas, risk assessments, or market scans.',
      timestamp: 'Just now'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Scroll to bottom on message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickPrompts = [
    'Scan top bullish assets',
    'What is the downside risk on NVDA?',
    'Show highest confidence setup',
    'Evaluate RELIANCE target corridor'
  ];

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    sound.playClick();
    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Simulate multi-agent intelligence response
    setTimeout(() => {
      sound.playAgentPulse();
      setIsTyping(false);

      let replyText = '';
      let actionStockId: string | undefined;
      let actionType: 'buy' | 'sell' | undefined;

      const q = query.toLowerCase();

      if (q.includes('bullish') || q.includes('top') || q.includes('scan')) {
        const topBull = stocks.find(s => s.prediction === 'bullish');
        replyText = `🔎 **Multi-Agent Market Scan**: Top conviction setup is **${topBull?.symbol || 'RELIANCE'}** with **${topBull?.confidence || 88}% Confidence**. Quant-X reports positive MACD expansion above VWAP, while AlphaVal forecasts +14% upside to ₹${topBull?.targetPrice.bull || 3250}.`;
        actionStockId = topBull?.id;
        actionType = 'buy';
      } else if (q.includes('nvda') || q.includes('risk')) {
        replyText = `🛡️ **RiskSentinel Evaluation on NVDA**: Volatility beta is 1.68. Recommended position sizing is capped at 12% portfolio weight with stop-loss threshold strictly enforced at $112.00. Institutional order flow remains net positive.`;
        actionStockId = 'nvda';
        actionType = 'buy';
      } else if (q.includes('reliance')) {
        replyText = `📊 **RELIANCE Target Corridor Analysis**: Current Spot: ₹2,984.50. Base Target: ₹3,100.00 (+3.9%). Bull Target: ₹3,250.00 (+8.9%). Bear Invalidation: ₹2,820.00 (-5.5%). Reward-to-Risk ratio: **1.62x**.`;
        actionStockId = 'reliance';
        actionType = 'buy';
      } else {
        replyText = `💡 **Agent Consensus Synthesis**: I have evaluated "${query}" across 5 agent streams. Market breadth shows strong momentum in Tech and Energy. Always maintain position sizing within 2% max portfolio risk per trade.`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: `agent-${Date.now()}`,
          sender: 'agent',
          agentName: 'Lakshmi Trade Copilot',
          avatar: '⚡',
          text: replyText,
          actionStockId,
          actionType,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 900);
  };

  const handleQuickTradeAction = (stockId: string) => {
    const s = stocks.find(item => item.id === stockId);
    if (!s) return;
    addPaperTrade({
      stockId: s.id,
      stockSymbol: s.symbol,
      stockName: s.name,
      type: 'buy',
      price: s.price,
      quantity: 10,
      agentRationale: `Copilot 1-Click execution on ${s.symbol} based on high confidence setup.`
    });
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            sound.playClick();
            setIsOpen(prev => !prev);
          }}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-xs shadow-tactile-lg hover:scale-105 active:scale-95 transition-all"
        >
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white" />
          </div>
          <span className="font-display tracking-tight text-sm">AI Copilot</span>
        </button>
      </div>

      {/* Copilot Drawer Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-full max-w-md rounded-3xl bg-card border border-border shadow-tactile-lg flex flex-col h-[560px] overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 backdrop-blur-xl">
          
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-subtle/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                  <span>Lakshmi Trade Copilot</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-bull/20 text-bull font-bold">
                    ONLINE
                  </span>
                </h3>
                <p className="text-[10px] text-muted-foreground font-mono">5-Agent Real-time Multi-Model</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-subtle transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground px-1">
                    {!isUser && <span>{m.avatar} {m.agentName}</span>}
                    <span>{m.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed text-xs shadow-tactile-sm ${
                      isUser
                        ? 'bg-primary text-primary-foreground font-medium rounded-tr-none'
                        : 'bg-surface-subtle text-foreground border border-border/80 rounded-tl-none'
                    }`}
                  >
                    <div className="space-y-1 whitespace-pre-line">
                      {m.text}
                    </div>

                    {/* Action Card Chip */}
                    {m.actionStockId && (
                      <div className="mt-2.5 pt-2 border-t border-border/50 flex items-center justify-between gap-2">
                        <button
                          onClick={() => {
                            sound.playClick();
                            navigate(`/stock/${m.actionStockId}`);
                            setIsOpen(false);
                          }}
                          className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
                        >
                          <span>Open Deep-Dive</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => handleQuickTradeAction(m.actionStockId!)}
                          className="px-2.5 py-1 rounded-lg bg-bull text-white font-mono font-bold text-[10px] hover:brightness-110 shadow-sm active:scale-95 transition-all"
                        >
                          Execute 10x Buy
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-surface-subtle p-3 rounded-2xl w-fit border border-border">
                <Sparkles className="w-3.5 h-3.5 text-primary animate-spin" />
                <span className="font-mono text-[11px]">Agents deliberating on market telemetry...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-4 py-2 border-t border-border/60 bg-surface-subtle/30 overflow-x-auto flex gap-1.5 no-scrollbar">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 rounded-full bg-card border border-border hover:border-primary/40 text-muted-foreground hover:text-foreground text-[10px] font-mono whitespace-nowrap transition-all shadow-tactile-sm"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-border bg-card flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about stocks, targets, or risk..."
              className="flex-1 px-3 py-2 rounded-xl bg-surface-subtle border border-border text-foreground placeholder:text-muted-foreground text-xs font-medium outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-primary text-primary-foreground hover:brightness-110 active:scale-95 transition-all shadow-tactile-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
