import React from 'react';
import { PaperTrade } from '../../types';
import { DollarSign, CheckCircle2, Clock, X, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { sound } from '../../lib/sound';

interface PaperTradeListProps {
  trades: PaperTrade[];
  onCloseTrade?: (id: string, currentPrice: number) => void;
  currentPrices: Record<string, number>;
}

export const PaperTradeList: React.FC<PaperTradeListProps> = ({ 
  trades, 
  onCloseTrade,
  currentPrices
}) => {
  const calculateCurrentValue = (trade: PaperTrade) => {
    const currentPrice = currentPrices[trade.stockId] || trade.price;
    return (currentPrice * trade.quantity).toFixed(2);
  };
  
  const calculateProfitLoss = (trade: PaperTrade) => {
    if (trade.status === 'closed' && trade.profitLoss !== undefined) {
      return trade.profitLoss;
    }
    
    const currentPrice = currentPrices[trade.stockId] || trade.price;
    const profitLoss = trade.type === 'buy' 
      ? (currentPrice - trade.price) * trade.quantity
      : (trade.price - currentPrice) * trade.quantity;
      
    return parseFloat(profitLoss.toFixed(2));
  };
  
  if (trades.length === 0) {
    return (
      <div className="rounded-2xl bg-card border border-border p-12 text-center text-muted-foreground shadow-tactile-sm">
        <DollarSign className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-base font-semibold text-foreground">No paper trade executions yet.</p>
        <p className="text-xs text-muted-foreground mt-1">Execute simulated market or limit orders to test AI alpha strategies.</p>
      </div>
    );
  }
  
  return (
    <div className="rounded-2xl bg-card border border-border p-6 shadow-tactile-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          <span>Paper Portfolio Positions ({trades.length})</span>
        </h3>
        <span className="text-xs font-mono text-muted-foreground">Real-time Slippage Adjusted</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border text-xs">
          <thead>
            <tr className="text-muted-foreground font-mono uppercase text-[10px]">
              <th className="py-3 text-left font-bold">Asset</th>
              <th className="py-3 text-left font-bold">Side</th>
              <th className="py-3 text-left font-bold">Qty</th>
              <th className="py-3 text-left font-bold">Entry</th>
              <th className="py-3 text-left font-bold">Spot</th>
              <th className="py-3 text-left font-bold">Value</th>
              <th className="py-3 text-left font-bold">P/L Delta</th>
              <th className="py-3 text-left font-bold">Date</th>
              <th className="py-3 text-left font-bold">Status</th>
              <th className="py-3 text-right font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 font-mono">
            {trades.map((trade) => {
              const profitLoss = calculateProfitLoss(trade);
              const isProfit = profitLoss >= 0;
              const spot = currentPrices[trade.stockId] || trade.price;
              
              return (
                <tr key={trade.id} className="hover:bg-surface-subtle/60 transition-colors">
                  <td className="py-3.5 whitespace-nowrap">
                    <div className="font-bold text-foreground">{trade.stockSymbol}</div>
                    <div className="text-[10px] text-muted-foreground font-sans line-clamp-1">{trade.stockName}</div>
                  </td>
                  <td className="py-3.5 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      trade.type === 'buy' ? 'bg-bull/20 text-bull border border-bull/30' : 'bg-bear/20 text-bear border border-bear/30'
                    }`}>
                      {trade.type}
                    </span>
                  </td>
                  <td className="py-3.5 whitespace-nowrap font-bold text-foreground">{trade.quantity}</td>
                  <td className="py-3.5 whitespace-nowrap text-muted-foreground font-num">₹{trade.price.toFixed(2)}</td>
                  <td className="py-3.5 whitespace-nowrap text-foreground font-bold font-num">₹{spot.toFixed(2)}</td>
                  <td className="py-3.5 whitespace-nowrap text-muted-foreground font-num">₹{calculateCurrentValue(trade)}</td>
                  <td className="py-3.5 whitespace-nowrap font-bold">
                    <div className={`flex items-center gap-1 font-num ${isProfit ? 'text-bull' : 'text-bear'}`}>
                      {isProfit ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      <span>{isProfit ? '+' : ''}₹{profitLoss.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="py-3.5 whitespace-nowrap text-muted-foreground text-[11px]">
                    {trade.date}
                  </td>
                  <td className="py-3.5 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      trade.status === 'open' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-muted text-muted-foreground'
                    }`}>
                      {trade.status === 'open' ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                      {trade.status}
                    </span>
                  </td>
                  <td className="py-3.5 whitespace-nowrap text-right">
                    {trade.status === 'open' && onCloseTrade && (
                      <button 
                        onClick={() => {
                          sound.playClick();
                          onCloseTrade(trade.id, spot);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-surface-subtle hover:bg-bear/20 text-muted-foreground hover:text-bear border border-border font-bold text-[11px] transition-all"
                      >
                        Close Position
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaperTradeList;