import React from 'react';
import { StockPrediction } from '../../types';
import { TrendingUp, TrendingDown, Star, ChevronRight, Activity, Zap } from 'lucide-react';
import { sound } from '../../lib/sound';

interface StockCardProps {
  stock: StockPrediction;
  onToggleWatchlist: (id: string) => void;
  onClick: (id: string) => void;
}

export const StockCard: React.FC<StockCardProps> = ({ stock, onToggleWatchlist, onClick }) => {
  const isBullish = stock.prediction === 'bullish';
  const isBearish = stock.prediction === 'bearish';
  const isPositiveChange = stock.change >= 0;

  return (
    <div 
      onClick={() => {
        sound.playClick();
        onClick(stock.id);
      }}
      className={`group relative rounded-2xl bg-card border border-border p-5 hover:border-primary/50 transition-all duration-200 cursor-pointer shadow-tactile-sm hover:shadow-tactile-md hover:-translate-y-0.5 ${
        isBullish ? 'hover:glow-bull-border' : isBearish ? 'hover:glow-bear-border' : ''
      }`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs font-mono border ${
            isBullish 
              ? 'bg-bull/10 text-bull border-bull/20' 
              : isBearish 
                ? 'bg-bear/10 text-bear border-bear/20' 
                : 'bg-muted text-muted-foreground border-border'
          }`}>
            {stock.symbol.slice(0, 3)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-foreground text-base tracking-tight group-hover:text-primary transition-colors">
                {stock.symbol}
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-subtle border border-border text-muted-foreground">
                {stock.exchange}
              </span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1 font-medium">{stock.name}</p>
          </div>
        </div>

        {/* Watchlist Star */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWatchlist(stock.id);
          }}
          className={`p-1.5 rounded-lg border transition-all ${
            stock.inWatchlist 
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 fill-amber-400' 
              : 'bg-surface-subtle border-border text-muted-foreground hover:text-foreground'
          }`}
          title={stock.inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          <Star className={`w-3.5 h-3.5 ${stock.inWatchlist ? 'fill-amber-400 text-amber-400' : ''}`} />
        </button>
      </div>

      {/* Price & Delta */}
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <span className="text-2xl font-bold text-foreground font-num tracking-tight">
            ₹{stock.price.toLocaleString()}
          </span>
        </div>
        <div className={`inline-flex items-center gap-1 text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
          isPositiveChange 
            ? 'bg-bull/15 text-bull' 
            : 'bg-bear/15 text-bear'
        }`}>
          {isPositiveChange ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          <span>{isPositiveChange ? `+${stock.change}%` : `${stock.change}%`}</span>
        </div>
      </div>

      {/* AI Signal Badge & Consensus Summary */}
      <div className="p-3 rounded-xl bg-surface-subtle/80 border border-border/80 mb-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="font-semibold text-foreground uppercase tracking-wider text-[11px]">
              AI Forecast
            </span>
          </div>
          <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase ${
            isBullish 
              ? 'bg-bull/20 text-bull border border-bull/30' 
              : isBearish 
                ? 'bg-bear/20 text-bear border border-bear/30' 
                : 'bg-muted text-muted-foreground border border-border'
          }`}>
            {stock.prediction}
          </span>
        </div>

        {/* Confidence Progress Bar */}
        <div>
          <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
            <span>Model Confidence</span>
            <span className="font-mono font-bold text-foreground">{stock.confidence}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                isBullish ? 'bg-bull' : isBearish ? 'bg-bear' : 'bg-muted-foreground'
              }`}
              style={{ width: `${stock.confidence}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[11px] text-muted-foreground font-mono">
        <div className="flex items-center gap-1">
          <Activity className="w-3 h-3 text-primary" />
          <span>RSI {stock.signals.rsi}</span>
        </div>
        <div className="flex items-center gap-1 group-hover:text-primary transition-colors font-medium">
          <span>War Room Consensus</span>
          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export default StockCard;