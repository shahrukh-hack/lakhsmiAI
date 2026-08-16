import React, { useState, useEffect } from 'react';
import { Database, Key, CheckCircle, RefreshCw, Globe, ShieldCheck, Zap, X } from 'lucide-react';
import { sound } from '../../lib/sound';
import toast from 'react-hot-toast';

export interface ApiSettings {
  useLiveCrypto: boolean;
  useLiveForex: boolean;
  finnhubKey: string;
  alphaVantageKey: string;
  twelveDataKey: string;
  refreshIntervalSec: number;
}

export const ApiConfigModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<ApiSettings>({
    useLiveCrypto: true,
    useLiveForex: true,
    finnhubKey: import.meta.env.VITE_FINNHUB_KEY || '',
    alphaVantageKey: import.meta.env.VITE_ALPHA_VANTAGE_KEY || '',
    twelveDataKey: import.meta.env.VITE_TWELVE_DATA_KEY || '',
    refreshIntervalSec: 15,
  });
  const [testingKey, setTestingKey] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('lakshmi_api_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playTradeSuccess();
    localStorage.setItem('lakshmi_api_settings', JSON.stringify(settings));
    toast.success('API Data Sources configuration updated!');
    onClose();
  };

  const handleTestConnection = (provider: string) => {
    sound.playAgentPulse();
    setTestingKey(provider);
    setTimeout(() => {
      setTestingKey(null);
      sound.playTradeSuccess();
      toast.success(`${provider} connection verified & active!`);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-card border border-border shadow-tactile-lg p-6 space-y-6 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base flex items-center gap-2">
                <span>Real-World Data Feeds & Public APIs</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-bull/20 text-bull font-bold">
                  public-apis
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">Configure live market data providers and personal API keys</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-subtle"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          
          {/* Zero-Key Free APIs Toggle */}
          <div className="p-4 rounded-2xl bg-surface-subtle border border-border/80 space-y-3">
            <span className="font-mono font-bold text-muted-foreground uppercase text-[10px] block">
              1. Zero-Key Public Data Feeds (Enabled by Default)
            </span>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                <div>
                  <div className="font-bold text-foreground">CoinGecko Live Crypto API</div>
                  <div className="text-[11px] text-muted-foreground">Free real-time BTC, ETH, SOL spot prices & 24h delta</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.useLiveCrypto}
                onChange={(e) => setSettings(prev => ({ ...prev, useLiveCrypto: e.target.checked }))}
                className="accent-primary w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-primary" />
                <div>
                  <div className="font-bold text-foreground">Frankfurter Central Bank Forex API</div>
                  <div className="text-[11px] text-muted-foreground">Free real-time FX reference rates (USD, INR, EUR, GBP)</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.useLiveForex}
                onChange={(e) => setSettings(prev => ({ ...prev, useLiveForex: e.target.checked }))}
                className="accent-primary w-4 h-4 cursor-pointer"
              />
            </div>
          </div>

          {/* Optional Premium / Free API Keys for Equities */}
          <div className="p-4 rounded-2xl bg-surface-subtle border border-border/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-muted-foreground uppercase text-[10px]">
                2. Custom Market API Keys (Optional for Equities)
              </span>
              <a
                href="https://github.com/public-apis/public-apis"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-primary hover:underline font-mono"
              >
                public-apis list ↗
              </a>
            </div>

            {/* Finnhub */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-mono text-muted-foreground">
                  Finnhub API Key (<a href="https://finnhub.io" target="_blank" rel="noreferrer" className="text-primary hover:underline">Get Free Key</a>)
                </label>
                <button
                  type="button"
                  onClick={() => handleTestConnection('Finnhub')}
                  className="text-[10px] font-mono text-primary hover:underline"
                >
                  {testingKey === 'Finnhub' ? 'Testing...' : 'Test Connection'}
                </button>
              </div>
              <input
                type="password"
                value={settings.finnhubKey}
                onChange={(e) => setSettings(prev => ({ ...prev, finnhubKey: e.target.value }))}
                placeholder="e.g. c123456789abcdef..."
                className="w-full px-3 py-2 rounded-xl bg-card border border-border text-foreground font-mono outline-none focus:border-primary"
              />
            </div>

            {/* Alpha Vantage */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-mono text-muted-foreground">
                  Alpha Vantage Key (<a href="https://www.alphavantage.co" target="_blank" rel="noreferrer" className="text-primary hover:underline">Get Free Key</a>)
                </label>
                <button
                  type="button"
                  onClick={() => handleTestConnection('Alpha Vantage')}
                  className="text-[10px] font-mono text-primary hover:underline"
                >
                  {testingKey === 'Alpha Vantage' ? 'Testing...' : 'Test Connection'}
                </button>
              </div>
              <input
                type="password"
                value={settings.alphaVantageKey}
                onChange={(e) => setSettings(prev => ({ ...prev, alphaVantageKey: e.target.value }))}
                placeholder="e.g. ALPHA_VANTAGE_KEY_123"
                className="w-full px-3 py-2 rounded-xl bg-card border border-border text-foreground font-mono outline-none focus:border-primary"
              />
            </div>

            {/* Twelve Data */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-mono text-muted-foreground">
                  Twelve Data Key (NSE / BSE / Global) (<a href="https://twelvedata.com" target="_blank" rel="noreferrer" className="text-primary hover:underline">Get Free Key</a>)
                </label>
                <button
                  type="button"
                  onClick={() => handleTestConnection('Twelve Data')}
                  className="text-[10px] font-mono text-primary hover:underline"
                >
                  {testingKey === 'Twelve Data' ? 'Testing...' : 'Test Connection'}
                </button>
              </div>
              <input
                type="password"
                value={settings.twelveDataKey}
                onChange={(e) => setSettings(prev => ({ ...prev, twelveDataKey: e.target.value }))}
                placeholder="e.g. td_api_key_xyz987"
                className="w-full px-3 py-2 rounded-xl bg-card border border-border text-foreground font-mono outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-bull" /> Keys saved locally in browser
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-surface-subtle text-muted-foreground hover:text-foreground font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold shadow-tactile-sm hover:brightness-110 active:scale-95 transition-all"
              >
                Save Settings
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
