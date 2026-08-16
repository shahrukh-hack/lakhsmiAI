import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Search, TrendingUp, Bot, Brain, Sparkles, X, ChevronRight } from 'lucide-react';
import { sound } from '../../lib/sound';

export const CommandPalette: React.FC = () => {
  const { isCommandOpen, setIsCommandOpen, stocks, cryptoQuotes } = useAppContext();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isCommandOpen]);

  if (!isCommandOpen) return null;

  // Filter items
  const q = query.toLowerCase().trim();

  const stockResults = stocks.filter(
    s => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.sector.toLowerCase().includes(q)
  );

  const cryptoResults = cryptoQuotes.filter(
    c => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
  );

  const appNavItems = [
    { name: 'Market Dashboard', path: '/', icon: TrendingUp, type: 'Page' },
    { name: 'Multi-Agent War Room', path: '/agency', icon: Bot, type: 'Agency' },
    { name: 'Paper Trading Portfolio', path: '/paper-trading', icon: TrendingUp, type: 'Trading' },
    { name: 'Financial Memory & Thesis Journal', path: '/memory', icon: Brain, type: 'Memory' },
    { name: 'Financial & Agent Skills Hub', path: '/skills', icon: Sparkles, type: 'Skills' },
    { name: 'Asset Watchlist', path: '/watchlist', icon: TrendingUp, type: 'Page' },
  ].filter(item => item.name.toLowerCase().includes(q) || item.type.toLowerCase().includes(q));

  const allResults = [
    ...stockResults.map(s => ({ title: `${s.symbol} — ${s.name}`, subtitle: `₹${s.price} (${s.change >= 0 ? '+' : ''}${s.change}%)`, path: `/stock/${s.id}`, icon: TrendingUp, tag: 'Stock' })),
    ...cryptoResults.map(c => ({ title: `${c.symbol.toUpperCase()} — ${c.name}`, subtitle: `$${c.current_price.toLocaleString()}`, path: '/', icon: TrendingUp, tag: 'Crypto' })),
    ...appNavItems.map(n => ({ title: n.name, subtitle: n.type, path: n.path, icon: n.icon, tag: 'Nav' })),
  ];

  const handleSelect = (path: string) => {
    sound.playClick();
    setIsCommandOpen(false);
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={() => setIsCommandOpen(false)} 
      />
      <div className="relative w-full max-w-2xl rounded-2xl bg-card border border-border shadow-tactile-lg overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setIsCommandOpen(false);
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev < allResults.length - 1 ? prev + 1 : prev));
              }
              if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
              }
              if (e.key === 'Enter' && allResults[selectedIndex]) {
                handleSelect(allResults[selectedIndex].path);
              }
            }}
            placeholder="Search equities, crypto, agents, skills, or commands..."
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm font-medium"
          />
          <button 
            onClick={() => setIsCommandOpen(false)}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-subtle"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {allResults.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No matching assets or commands found for "{query}".
            </div>
          ) : (
            allResults.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={`${item.title}-${idx}`}
                  onClick={() => handleSelect(item.path)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all text-xs ${
                    isSelected 
                      ? 'bg-primary text-primary-foreground font-semibold shadow-sm' 
                      : 'text-foreground hover:bg-surface-subtle'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-black/20 text-white' : 'bg-surface-subtle text-primary'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{item.title}</div>
                      <div className={isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}>
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-card border border-border text-muted-foreground'
                    }`}>
                      {item.tag}
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-surface-subtle/50 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Navigate <kbd className="px-1.5 py-0.5 rounded bg-card border border-border font-mono">↑↓</kbd></span>
            <span>Select <kbd className="px-1.5 py-0.5 rounded bg-card border border-border font-mono">↵</kbd></span>
            <span>Close <kbd className="px-1.5 py-0.5 rounded bg-card border border-border font-mono">esc</kbd></span>
          </div>
          <span className="font-mono">Lakshmi AI Power Suite</span>
        </div>
      </div>
    </div>
  );
};
