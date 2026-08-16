import React, { useState, useEffect } from 'react';
import { Layers, ShieldCheck, Activity, Zap } from 'lucide-react';

interface OrderBookProps {
  spotPrice: number;
  symbol: string;
}

interface OrderRow {
  price: number;
  size: number;
  total: number;
  depthPercent: number;
}

export const OrderBookDepth: React.FC<OrderBookProps> = ({ spotPrice, symbol }) => {
  const [bids, setBids] = useState<OrderRow[]>([]);
  const [asks, setAsks] = useState<OrderRow[]>([]);
  const [spread, setSpread] = useState<number>(0.15);

  useEffect(() => {
    // Generate realistic Level-2 Order book depth
    const generateDepth = () => {
      const askList: OrderRow[] = [];
      const bidList: OrderRow[] = [];

      let runningAskTotal = 0;
      for (let i = 5; i >= 1; i--) {
        const price = +(spotPrice + i * (spotPrice * 0.0008)).toFixed(2);
        const size = Math.floor(Math.random() * 800) + 150;
        runningAskTotal += size;
        askList.push({
          price,
          size,
          total: runningAskTotal,
          depthPercent: Math.min(100, (runningAskTotal / 3000) * 100),
        });
      }

      let runningBidTotal = 0;
      for (let i = 1; i <= 5; i++) {
        const price = +(spotPrice - i * (spotPrice * 0.0008)).toFixed(2);
        const size = Math.floor(Math.random() * 850) + 180;
        runningBidTotal += size;
        bidList.push({
          price,
          size,
          total: runningBidTotal,
          depthPercent: Math.min(100, (runningBidTotal / 3000) * 100),
        });
      }

      setAsks(askList);
      setBids(bidList);
      setSpread(+(askList[askList.length - 1]?.price - bidList[0]?.price || 0.15).toFixed(2));
    };

    generateDepth();
    const interval = setInterval(generateDepth, 3500);
    return () => clearInterval(interval);
  }, [spotPrice]);

  return (
    <div className="rounded-2xl bg-card border border-border p-5 shadow-tactile-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">
            Level-2 Institutional Order Flow ({symbol})
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-subtle text-muted-foreground border border-border">
          Spread: ₹{spread} ({((spread / spotPrice) * 100).toFixed(3)}%)
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs font-mono">
        {/* Asks (Sells) */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold px-1">
            <span>Ask Price</span>
            <span>Size</span>
          </div>

          {asks.map((ask, idx) => (
            <div
              key={`ask-${idx}`}
              className="relative flex items-center justify-between py-1 px-2 rounded-md overflow-hidden bg-bear/5 border border-bear/10"
            >
              <div
                className="absolute inset-y-0 right-0 bg-bear/20 transition-all duration-300"
                style={{ width: `${ask.depthPercent}%` }}
              />
              <span className="relative z-10 font-bold text-bear font-num">
                ₹{ask.price}
              </span>
              <span className="relative z-10 text-muted-foreground font-num">
                {ask.size.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Bids (Buys) */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold px-1">
            <span>Bid Price</span>
            <span>Size</span>
          </div>

          {bids.map((bid, idx) => (
            <div
              key={`bid-${idx}`}
              className="relative flex items-center justify-between py-1 px-2 rounded-md overflow-hidden bg-bull/5 border border-bull/10"
            >
              <div
                className="absolute inset-y-0 right-0 bg-bull/20 transition-all duration-300"
                style={{ width: `${bid.depthPercent}%` }}
              />
              <span className="relative z-10 font-bold text-bull font-num">
                ₹{bid.price}
              </span>
              <span className="relative z-10 text-muted-foreground font-num">
                {bid.size.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Whale Order Flow Alert Banner */}
      <div className="p-3 rounded-xl bg-surface-subtle border border-border/80 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-1.5 text-foreground">
          <Zap className="w-3.5 h-3.5 text-accent" />
          <span>Whale Order Sentinel: <strong>14,500 Shares</strong> Block Bid Absorbed @ ₹{spotPrice}</span>
        </div>
        <span className="text-bull font-bold">+0.8% Net Delta</span>
      </div>
    </div>
  );
};
