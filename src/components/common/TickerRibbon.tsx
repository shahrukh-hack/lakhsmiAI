import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { TrendingUp, TrendingDown, IndianRupee, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sound } from '../../lib/sound';

export const TickerRibbon: React.FC = () => {
  const { stocks, indianIndices, forexRates } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="w-full bg-surface-subtle/80 border-y border-border overflow-hidden py-2 text-xs font-mono select-none backdrop-blur-md">
      <div className="flex animate-ticker whitespace-nowrap gap-8 hover:[animation-play-state:paused]">
        
        {/* Indian Benchmark Indices First */}
        {indianIndices.map(idx => {
          const isPos = idx.changePercent >= 0;
          return (
            <div
              key={`index-${idx.symbol}`}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 border border-primary/30 shadow-tactile-sm"
            >
              <span className="inline-flex items-center gap-1 font-bold text-primary">
                <Activity className="w-3 h-3" />
                {idx.symbol}
              </span>
              <span className="text-foreground font-num font-bold">₹{idx.price.toLocaleString()}</span>
              <span className={`inline-flex items-center gap-0.5 font-semibold ${isPos ? 'text-bull' : 'text-bear'}`}>
                {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isPos ? `+${idx.changePercent}%` : `${idx.changePercent}%`}
              </span>
            </div>
          );
        })}

        {/* Top NSE / BSE Equities */}
        {stocks.map(s => {
          const isPos = s.change >= 0;
          return (
            <div 
              key={`eq-${s.id}`} 
              onClick={() => {
                sound.playClick();
                navigate(`/stock/${s.id}`);
              }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-card/60 border border-border/60 hover:border-primary/50 cursor-pointer transition-all hover:bg-card shadow-tactile-sm"
            >
              <span className="font-bold text-foreground">{s.symbol}</span>
              <span className="text-muted-foreground font-num">₹{s.price.toLocaleString()}</span>
              <span className={`inline-flex items-center gap-0.5 font-semibold ${isPos ? 'text-bull' : 'text-bear'}`}>
                {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isPos ? `+${s.change}%` : `${s.change}%`}
              </span>
            </div>
          );
        })}

        {/* Live USD/INR Rate */}
        {forexRates && forexRates.rates && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-card/40 border border-border/40 text-muted-foreground">
            <IndianRupee className="w-3 h-3 text-accent" />
            <span>USD/INR <strong className="text-foreground font-num">₹{forexRates.rates.INR || 83.45}</strong></span>
          </div>
        )}

        {/* NSE Market Session Pill */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-bull/10 border border-bull/20 text-bull font-bold text-[10px]">
          <span className="w-2 h-2 rounded-full bg-bull animate-pulse" />
          <span>NSE / BSE LIVE (09:15 - 15:30 IST)</span>
        </div>

      </div>
    </div>
  );
};

export default TickerRibbon;
