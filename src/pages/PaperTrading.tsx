import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import PaperTradeList from '../components/common/PaperTradeList';
import { Coins, TrendingUp, TrendingDown, RefreshCw, Wallet, ShieldCheck, Plus } from 'lucide-react';
import { sound } from '../lib/sound';
import toast from 'react-hot-toast';

export const PaperTrading: React.FC = () => {
  const { user, closePaperTrade, stocks, addPaperTrade, loading } = useAppContext();
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [selectedStockId, setSelectedStockId] = useState(stocks[0]?.id || 'reliance');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [tradeQuantity, setTradeQuantity] = useState(10);

  const getTotalInvestment = () => {
    if (!user) return 0;
    return user.paperTrades.reduce((total, trade) => {
      if (trade.status === 'open') {
        return total + (trade.price * trade.quantity);
      }
      return total;
    }, 0);
  };

  const getCurrentPortfolioValue = () => {
    if (!user) return 0;
    return user.paperTrades.reduce((total, trade) => {
      if (trade.status === 'open') {
        const stock = stocks.find(s => s.id === trade.stockId);
        const currentPrice = stock ? stock.price : trade.price;
        return total + (currentPrice * trade.quantity);
      }
      return total;
    }, 0);
  };

  const getTotalProfitLoss = () => {
    const currentValue = getCurrentPortfolioValue();
    const investment = getTotalInvestment();
    return currentValue - investment;
  };

  const getClosedProfitLoss = () => {
    if (!user) return 0;
    return user.paperTrades.reduce((total, trade) => {
      if (trade.status === 'closed' && trade.profitLoss !== undefined) {
        return total + trade.profitLoss;
      }
      return total;
    }, 0);
  };

  const getCurrentPrices = () => {
    const prices: Record<string, number> = {};
    stocks.forEach(stock => {
      prices[stock.id] = stock.price;
    });
    return prices;
  };

  const activeStock = stocks.find(s => s.id === selectedStockId) || stocks[0];

  const handleExecuteModalTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStock || tradeQuantity <= 0) return;

    addPaperTrade({
      stockId: activeStock.id,
      stockSymbol: activeStock.symbol,
      stockName: activeStock.name,
      type: tradeType,
      price: activeStock.price,
      quantity: tradeQuantity,
      agentRationale: `Manual Paper Trade dispatched on ${activeStock.symbol}.`
    });

    setIsTradeModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-border shadow-tactile-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-tactile-sm">
            <Coins className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Simulated Paper Trading Desk
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Practice trading strategies with real-time price feeds and zero capital risk
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setIsTradeModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-tactile-sm hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Order Execution</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Key Metric Gauges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-card border border-border shadow-tactile-sm">
              <span className="text-xs font-mono text-muted-foreground font-semibold uppercase block mb-1">
                Available Cash
              </span>
              <p className="text-2xl font-bold font-num text-foreground">
                ₹{user?.accountBalance ? user.accountBalance.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '100,000.00'}
              </p>
              <span className="text-[10px] font-mono text-muted-foreground mt-1 block">
                Instant Purchasing Power
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border shadow-tactile-sm">
              <span className="text-xs font-mono text-muted-foreground font-semibold uppercase block mb-1">
                Active Positions Value
              </span>
              <p className="text-2xl font-bold font-num text-foreground">
                ₹{getCurrentPortfolioValue().toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
              <span className="text-[10px] font-mono text-muted-foreground mt-1 block">
                Cost: ₹{getTotalInvestment().toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border shadow-tactile-sm">
              <span className="text-xs font-mono text-muted-foreground font-semibold uppercase block mb-1">
                Unrealized Open P/L
              </span>
              <div className="flex items-center gap-1.5">
                <p className={`text-2xl font-bold font-num ${getTotalProfitLoss() >= 0 ? 'text-bull' : 'text-bear'}`}>
                  {getTotalProfitLoss() >= 0 ? '+' : ''}₹{getTotalProfitLoss().toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
                {getTotalProfitLoss() >= 0 ? <TrendingUp className="w-5 h-5 text-bull" /> : <TrendingDown className="w-5 h-5 text-bear" />}
              </div>
              <span className="text-[10px] font-mono text-muted-foreground mt-1 block">
                Live Floating Return
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border shadow-tactile-sm">
              <span className="text-xs font-mono text-muted-foreground font-semibold uppercase block mb-1">
                Realized Closed P/L
              </span>
              <div className="flex items-center gap-1.5">
                <p className={`text-2xl font-bold font-num ${getClosedProfitLoss() >= 0 ? 'text-bull' : 'text-bear'}`}>
                  {getClosedProfitLoss() >= 0 ? '+' : ''}₹{getClosedProfitLoss().toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
                {getClosedProfitLoss() >= 0 ? <TrendingUp className="w-5 h-5 text-bull" /> : <TrendingDown className="w-5 h-5 text-bear" />}
              </div>
              <span className="text-[10px] font-mono text-muted-foreground mt-1 block">
                Booked Trade Profits
              </span>
            </div>

          </div>

          {/* Positions Table */}
          {user && (
            <PaperTradeList 
              trades={user.paperTrades} 
              onCloseTrade={closePaperTrade}
              currentPrices={getCurrentPrices()}
            />
          )}
        </>
      )}

      {/* New Trade Modal */}
      {isTradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-tactile-lg space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-foreground text-base">
                New Simulated Order
              </h3>
              <button 
                onClick={() => setIsTradeModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteModalTrade} className="space-y-4 text-xs">
              <div>
                <label className="block text-muted-foreground font-mono font-bold mb-1">
                  Select Asset
                </label>
                <select
                  value={selectedStockId}
                  onChange={(e) => setSelectedStockId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-subtle border border-border text-foreground font-mono font-bold outline-none focus:border-primary cursor-pointer"
                >
                  {stocks.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.symbol} — ₹{s.price} ({s.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Buy / Sell switch */}
              <div className="flex rounded-xl bg-surface-subtle p-1 border border-border font-mono font-bold">
                <button
                  type="button"
                  onClick={() => setTradeType('buy')}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    tradeType === 'buy' ? 'bg-bull text-white shadow-sm' : 'text-muted-foreground'
                  }`}
                >
                  BUY LONG
                </button>
                <button
                  type="button"
                  onClick={() => setTradeType('sell')}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    tradeType === 'sell' ? 'bg-bear text-white shadow-sm' : 'text-muted-foreground'
                  }`}
                >
                  SELL SHORT
                </button>
              </div>

              <div>
                <label className="block text-muted-foreground font-mono font-bold mb-1">
                  Quantity of Shares
                </label>
                <input
                  type="number"
                  min="1"
                  value={tradeQuantity}
                  onChange={(e) => setTradeQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 rounded-xl bg-surface-subtle border border-border text-foreground font-mono font-bold text-sm outline-none focus:border-primary"
                />
              </div>

              {activeStock && (
                <div className="p-3 rounded-xl bg-surface-subtle border border-border/80 space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Spot Price:</span>
                    <span className="text-foreground font-bold font-num">₹{activeStock.price}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Estimated Total:</span>
                    <span className="text-foreground font-bold font-num">₹{(activeStock.price * tradeQuantity).toLocaleString()}</span>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsTradeModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface-subtle text-muted-foreground hover:text-foreground font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl font-bold text-white shadow-tactile-sm hover:brightness-110 active:scale-95 transition-all ${
                    tradeType === 'buy' ? 'bg-bull' : 'bg-bear'
                  }`}
                >
                  Execute Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PaperTrading;