import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Filter, Download, ArrowUpDown, Star, ChevronRight, Zap, Activity } from 'lucide-react';
import { sound } from '../lib/sound';
import toast from 'react-hot-toast';

export const MarketScreener: React.FC = () => {
  const { stocks, toggleWatchlist } = useAppContext();
  const navigate = useNavigate();

  // Filters State
  const [minConfidence, setMinConfidence] = useState<number>(60);
  const [predictionFilter, setPredictionFilter] = useState<string>('ALL');
  const [exchangeFilter, setExchangeFilter] = useState<string>('ALL');
  const [maxRsi, setMaxRsi] = useState<number>(100);
  const [minRsi, setMinRsi] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'confidence' | 'price' | 'change' | 'rsi'>('confidence');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter stocks
  const filtered = stocks
    .filter(s => {
      if (s.confidence < minConfidence) return false;
      if (predictionFilter !== 'ALL' && s.prediction !== predictionFilter) return false;
      if (exchangeFilter !== 'ALL' && s.exchange !== exchangeFilter) return false;
      if (s.signals.rsi < minRsi || s.signals.rsi > maxRsi) return false;
      return true;
    })
    .sort((a, b) => {
      let aVal = 0;
      let bVal = 0;
      if (sortBy === 'confidence') { aVal = a.confidence; bVal = b.confidence; }
      else if (sortBy === 'price') { aVal = a.price; bVal = b.price; }
      else if (sortBy === 'change') { aVal = a.change; bVal = b.change; }
      else if (sortBy === 'rsi') { aVal = a.signals.rsi; bVal = b.signals.rsi; }

      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });

  const handleExportCSV = () => {
    sound.playTradeSuccess();
    const csvRows = [
      ['Symbol', 'Name', 'Exchange', 'Price', 'Change %', 'Prediction', 'Confidence', 'RSI', 'MACD'],
      ...filtered.map(s => [
        s.symbol,
        s.name,
        s.exchange,
        s.price,
        s.change,
        s.prediction,
        s.confidence,
        s.signals.rsi,
        s.signals.macd
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `lakshmi_screener_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Screener results exported to CSV');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-border shadow-tactile-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-tactile-sm">
            <Filter className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Institutional Alpha Screener
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary/20 text-primary border border-primary/30">
                Multi-Parametric Filter
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Screen assets across AI confidence scores, RSI momentum, valuation percentiles & exchange
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-subtle border border-border text-foreground font-bold text-xs shadow-tactile-sm hover:border-primary/40 hover:bg-card active:scale-95 transition-all"
        >
          <Download className="w-4 h-4 text-primary" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter Control Bar */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-tactile-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        
        {/* Min Confidence */}
        <div>
          <div className="flex justify-between text-muted-foreground font-mono font-bold mb-1">
            <span>Min AI Confidence</span>
            <span className="text-primary">{minConfidence}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="95"
            step="5"
            value={minConfidence}
            onChange={(e) => setMinConfidence(parseInt(e.target.value))}
            className="w-full accent-primary cursor-pointer"
          />
        </div>

        {/* Prediction Signal */}
        <div>
          <label className="block text-muted-foreground font-mono font-bold mb-1">
            AI Signal Verdict
          </label>
          <select
            value={predictionFilter}
            onChange={(e) => setPredictionFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-surface-subtle border border-border text-foreground font-mono font-bold outline-none focus:border-primary cursor-pointer"
          >
            <option value="ALL">All Predictions (Bull / Bear / Neutral)</option>
            <option value="bullish">🟢 Bullish Only</option>
            <option value="bearish">🔴 Bearish Only</option>
            <option value="neutral">⚪ Neutral Only</option>
          </select>
        </div>

        {/* Exchange */}
        <div>
          <label className="block text-muted-foreground font-mono font-bold mb-1">
            Exchange Market
          </label>
          <select
            value={exchangeFilter}
            onChange={(e) => setExchangeFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-surface-subtle border border-border text-foreground font-mono font-bold outline-none focus:border-primary cursor-pointer"
          >
            <option value="ALL">All Exchanges (NSE, NASDAQ, Crypto)</option>
            <option value="NSE">NSE (National Stock Exchange)</option>
            <option value="NASDAQ">NASDAQ (US Equities)</option>
            <option value="CRYPTO">Crypto Digital Assets</option>
          </select>
        </div>

        {/* RSI Range */}
        <div>
          <div className="flex justify-between text-muted-foreground font-mono font-bold mb-1">
            <span>RSI Max Limit</span>
            <span className="text-foreground">{maxRsi}</span>
          </div>
          <input
            type="range"
            min="30"
            max="100"
            step="5"
            value={maxRsi}
            onChange={(e) => setMaxRsi(parseInt(e.target.value))}
            className="w-full accent-primary cursor-pointer"
          />
        </div>

      </div>

      {/* Screened Table Results */}
      <div className="rounded-2xl bg-card border border-border p-6 shadow-tactile-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border text-xs">
          <span className="font-mono font-bold text-foreground">
            Matched Assets: <strong className="text-primary">{filtered.length}</strong> Results
          </span>

          {/* Sort selector */}
          <div className="flex items-center gap-2 font-mono">
            <span className="text-muted-foreground">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as unknown as 'confidence')}
              className="px-2.5 py-1 rounded-lg bg-surface-subtle border border-border text-foreground outline-none cursor-pointer"
            >
              <option value="confidence">AI Confidence</option>
              <option value="price">Spot Price</option>
              <option value="change">24h Delta %</option>
              <option value="rsi">RSI Momentum</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="p-1 rounded-lg bg-surface-subtle border border-border text-muted-foreground hover:text-foreground"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border text-xs font-mono">
            <thead>
              <tr className="text-muted-foreground uppercase text-[10px]">
                <th className="py-3 text-left">Asset</th>
                <th className="py-3 text-left">Exchange</th>
                <th className="py-3 text-left">Spot Price</th>
                <th className="py-3 text-left">24h Delta</th>
                <th className="py-3 text-left">AI Signal</th>
                <th className="py-3 text-left">Confidence</th>
                <th className="py-3 text-left">RSI</th>
                <th className="py-3 text-left">MACD</th>
                <th className="py-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map(stock => {
                const isBull = stock.prediction === 'bullish';
                const isBear = stock.prediction === 'bearish';
                const isPos = stock.change >= 0;

                return (
                  <tr
                    key={stock.id}
                    onClick={() => {
                      sound.playClick();
                      navigate(`/stock/${stock.id}`);
                    }}
                    className="hover:bg-surface-subtle/80 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 whitespace-nowrap">
                      <div className="font-bold text-foreground text-sm">{stock.symbol}</div>
                      <div className="text-[10px] text-muted-foreground font-sans line-clamp-1">{stock.name}</div>
                    </td>
                    <td className="py-3.5 whitespace-nowrap text-muted-foreground">
                      {stock.exchange}
                    </td>
                    <td className="py-3.5 whitespace-nowrap font-bold text-foreground font-num">
                      ₹{stock.price.toLocaleString()}
                    </td>
                    <td className={`py-3.5 whitespace-nowrap font-bold ${isPos ? 'text-bull' : 'text-bear'}`}>
                      {isPos ? `+${stock.change}%` : `${stock.change}%`}
                    </td>
                    <td className="py-3.5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isBull ? 'bg-bull/20 text-bull border border-bull/30' : isBear ? 'bg-bear/20 text-bear border border-bear/30' : 'bg-muted text-muted-foreground'
                      }`}>
                        {stock.prediction}
                      </span>
                    </td>
                    <td className="py-3.5 whitespace-nowrap font-bold text-primary">
                      {stock.confidence}%
                    </td>
                    <td className="py-3.5 whitespace-nowrap text-muted-foreground">
                      {stock.signals.rsi}
                    </td>
                    <td className={`py-3.5 whitespace-nowrap font-bold uppercase ${stock.signals.macd === 'positive' ? 'text-bull' : 'text-bear'}`}>
                      {stock.signals.macd}
                    </td>
                    <td className="py-3.5 whitespace-nowrap text-right">
                      <ChevronRight className="w-4 h-4 text-muted-foreground inline group-hover:text-primary" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default MarketScreener;
