import React, { useState } from 'react';
import { StockPrediction } from '../../types';
import { useNavigate } from 'react-router-dom';
import { Activity, Zap } from 'lucide-react';
import { sound } from '../../lib/sound';

interface SignalHeatmapProps {
  stocks: StockPrediction[];
}

export const SignalHeatmap: React.FC<SignalHeatmapProps> = ({ stocks }) => {
  const navigate = useNavigate();
  const [selectedExchange, setSelectedExchange] = useState<string>('ALL');

  const filtered = selectedExchange === 'ALL' 
    ? stocks 
    : stocks.filter(s => s.exchange === selectedExchange);

  return (
    <div className="rounded-2xl bg-card border border-border p-5 shadow-tactile-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground tracking-tight">
              Market Intelligence Heatmap
            </h2>
            <p className="text-xs text-muted-foreground">
              Multi-Asset AI Signal Matrix & Sentiment Density
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-subtle border border-border text-xs">
          {['ALL', 'NSE', 'NASDAQ', 'CRYPTO'].map(ex => (
            <button
              key={ex}
              onClick={() => {
                sound.playClick();
                setSelectedExchange(ex);
              }}
              className={`px-2.5 py-1 rounded-lg font-mono font-medium transition-all ${
                selectedExchange === ex
                  ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Matrix Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {filtered.map(stock => {
          const isBull = stock.prediction === 'bullish';
          const isBear = stock.prediction === 'bearish';

          return (
            <div
              key={stock.id}
              onClick={() => {
                sound.playClick();
                navigate(`/stock/${stock.id}`);
              }}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer hover:scale-105 flex flex-col justify-between shadow-tactile-sm ${
                isBull
                  ? 'bg-gradient-to-br from-bull/15 to-bull/5 border-bull/30 hover:border-bull'
                  : isBear
                    ? 'bg-gradient-to-br from-bear/15 to-bear/5 border-bear/30 hover:border-bear'
                    : 'bg-surface-subtle border-border hover:border-muted-foreground'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-foreground font-mono text-sm">{stock.symbol}</span>
                <span className="text-[9px] font-mono px-1 rounded bg-black/20 text-muted-foreground">
                  {stock.exchange}
                </span>
              </div>

              <div className="mb-2">
                <div className="text-base font-bold font-num text-foreground">
                  ₹{stock.price > 1000 ? Math.round(stock.price).toLocaleString() : stock.price}
                </div>
                <div className={`text-xs font-mono font-semibold ${stock.change >= 0 ? 'text-bull' : 'text-bear'}`}>
                  {stock.change >= 0 ? `+${stock.change}%` : `${stock.change}%`}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono">
                <span className="flex items-center gap-0.5 text-muted-foreground">
                  <Zap className="w-2.5 h-2.5 text-primary" /> {stock.confidence}%
                </span>
                <span className={`uppercase font-bold ${isBull ? 'text-bull' : isBear ? 'text-bear' : 'text-muted-foreground'}`}>
                  {stock.prediction}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SignalHeatmap;