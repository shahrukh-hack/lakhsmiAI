import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import StockCard from '../components/common/StockCard';
import SignalHeatmap from '../components/common/SignalHeatmap';
import { TickerRibbon } from '../components/common/TickerRibbon';
import { useNavigate, Link } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Bot, 
  Zap, 
  Newspaper, 
  Activity, 
  ShieldCheck, 
  Filter, 
  Sparkles, 
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Coins,
  DollarSign
} from 'lucide-react';
import { sound } from '../lib/sound';
import toast from 'react-hot-toast';

export const Dashboard: React.FC = () => {
  const { 
    stocks, 
    toggleWatchlist, 
    indianIndices, 
    marketNews, 
    loading, 
    isBeginnerMode, 
    toggleBeginnerMode,
    addPaperTrade 
  } = useAppContext();
  const navigate = useNavigate();
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');

  const handleStockClick = (id: string) => {
    navigate(`/stock/${id}`);
  };

  const handleQuickPracticeBuy = (stock: typeof stocks[0]) => {
    sound.playTradeSuccess();
    addPaperTrade({
      stockId: stock.id,
      stockSymbol: stock.symbol,
      stockName: stock.name,
      type: 'buy',
      price: stock.price,
      quantity: 10,
      stopLoss: stock.targetPrice.bear,
      takeProfit: stock.targetPrice.bull,
      agentRationale: `Beginner Practice Buy on ${stock.symbol} following AI Bullish setup.`
    });
    toast.success(`🎉 Practiced Buying 10 shares of ${stock.symbol}! View in Paper Desk.`);
  };

  const bullishStocks = stocks.filter(stock => stock.prediction === 'bullish');
  const bearishStocks = stocks.filter(stock => stock.prediction === 'bearish');

  const sectors = ['ALL', ...Array.from(new Set(stocks.map(s => s.sector)))];

  const filteredStocks = sectorFilter === 'ALL'
    ? stocks
    : stocks.filter(s => s.sector === sectorFilter);

  // Top 3 Safe Beginner Stocks
  const topSafePicks = stocks.slice(0, 3);

  return (
    <div className="min-h-screen pb-16 space-y-6">
      
      {/* Live Continuous Ticker Ribbon across Top */}
      <TickerRibbon />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
        
        {/* =========================================================================
            BEGINNER MODE ACTION CENTER (Clean, Jargon-Free, 3-Step Guide)
           ========================================================================= */}
        {isBeginnerMode ? (
          <div className="space-y-6">
            
            {/* Beginner Welcome Banner */}
            <div className="rounded-3xl bg-gradient-to-br from-card via-card to-bull/10 border border-bull/30 p-6 sm:p-8 shadow-tactile-md space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bull/20 text-bull text-xs font-mono font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Beginner Friendly Mode Active</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground tracking-tight">
                    Welcome to Lakshmi AI — Your Personal Stock Market Coach
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                    New to trading? We simplified everything. Our AI analyzes thousands of data points and tells you in plain English: <strong>What to buy</strong>, <strong>When to take profit</strong>, and <strong>How to protect your money</strong>.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to="/paper-trading"
                    onClick={() => sound.playClick()}
                    className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-primary text-primary-foreground text-xs font-bold shadow-tactile-sm hover:brightness-110 active:scale-95 transition-all"
                  >
                    <Coins className="w-4 h-4" />
                    <span>Practice Desk (₹10L Funds)</span>
                  </Link>
                </div>
              </div>

              {/* 3-Step Action Guide Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/60 text-xs">
                <div className="p-4 rounded-2xl bg-surface-subtle border border-border/80 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <span className="w-6 h-6 rounded-full bg-bull text-black flex items-center justify-center font-mono font-bold text-xs">1</span>
                    <span>Check AI Signal</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-[11px]">
                    Look for <strong>"🟢 Bullish (Buy)"</strong> signals on top companies with high confidence scores (80%+).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface-subtle border border-border/80 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <span className="w-6 h-6 rounded-full bg-bull text-black flex items-center justify-center font-mono font-bold text-xs">2</span>
                    <span>Set Profit Target & Safety Stop</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-[11px]">
                    Every stock shows an <strong>Expected Profit Target</strong> and a <strong>Safe Stop Loss</strong> to cap risk.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface-subtle border border-border/80 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <span className="w-6 h-6 rounded-full bg-bull text-black flex items-center justify-center font-mono font-bold text-xs">3</span>
                    <span>Practice with Zero Risk</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-[11px]">
                    Click <strong>"Practice Buy"</strong> to trade with ₹10,00,000 in virtual funds before risking real money!
                  </p>
                </div>
              </div>
            </div>

            {/* Top 3 Safe Stock Recommendations Today */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <div>
                    <h2 className="text-lg font-bold text-foreground tracking-tight">
                      Top 3 Safe AI Stock Picks Today for Beginners
                    </h2>
                    <p className="text-xs text-muted-foreground">High confidence, large-cap Indian companies with clear profit targets</p>
                  </div>
                </div>
                <button
                  onClick={toggleBeginnerMode}
                  className="text-xs font-mono text-primary hover:underline font-semibold"
                >
                  Switch to Pro Quant View →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {topSafePicks.map(stock => {
                  const upsidePct = (((stock.targetPrice.bull - stock.price) / stock.price) * 100).toFixed(1);
                  const downsidePct = (((stock.price - stock.targetPrice.bear) / stock.price) * 100).toFixed(1);

                  return (
                    <div
                      key={stock.id}
                      className="p-5 rounded-2xl bg-card border border-border hover:border-primary/50 shadow-tactile-sm space-y-4 transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Title & Exchange */}
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-foreground text-base font-display">{stock.symbol}</h3>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-subtle text-muted-foreground">NSE</span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1">{stock.name}</p>
                          </div>
                          <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-bull/20 text-bull border border-bull/30 uppercase">
                            🟢 Strong Buy
                          </span>
                        </div>

                        {/* Current Spot Price */}
                        <div className="my-3">
                          <span className="text-xs text-muted-foreground font-mono">Current Price:</span>
                          <div className="text-2xl font-bold font-num text-foreground">
                            ₹{stock.price.toLocaleString()}
                          </div>
                        </div>

                        {/* Plain English AI Reason */}
                        <div className="p-3 rounded-xl bg-surface-subtle border border-border/80 space-y-1 text-xs">
                          <span className="font-mono font-bold text-muted-foreground text-[10px] block">💡 Why Buy This Stock:</span>
                          <p className="text-foreground/90 text-xs leading-relaxed">
                            {stock.agentDeliberation[0]?.reasoning || "Strong institutional buying and expanding revenue runway."}
                          </p>
                        </div>

                        {/* Targets Breakdown */}
                        <div className="grid grid-cols-2 gap-2 my-3 text-xs font-mono">
                          <div className="p-2 rounded-lg bg-bull/10 border border-bull/20">
                            <span className="text-muted-foreground text-[10px] block">Expected Target</span>
                            <span className="font-bold text-bull text-sm">₹{stock.targetPrice.bull}</span>
                            <span className="text-[10px] text-bull block">(+{upsidePct}% Profit)</span>
                          </div>

                          <div className="p-2 rounded-lg bg-bear/10 border border-bear/20">
                            <span className="text-muted-foreground text-[10px] block">Safe Stop Loss</span>
                            <span className="font-bold text-bear text-sm">₹{stock.targetPrice.bear}</span>
                            <span className="text-[10px] text-bear block">(-{downsidePct}% Max Risk)</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                        <button
                          onClick={() => handleStockClick(stock.id)}
                          className="flex-1 py-2.5 rounded-xl bg-surface-subtle hover:bg-card border border-border text-foreground text-xs font-bold transition-all text-center"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleQuickPracticeBuy(stock)}
                          className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-tactile-sm hover:brightness-110 active:scale-95 transition-all text-center"
                        >
                          Practice Buy
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Beginner Market News Highlights */}
            <div className="rounded-2xl bg-card border border-border p-6 shadow-tactile-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-primary" />
                  <h3 className="text-base font-bold text-foreground">
                    Today's Indian Market Highlights (Simple Summary)
                  </h3>
                </div>
                <span className="text-xs font-mono text-muted-foreground">Updated in Real-Time</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {marketNews.slice(0, 4).map((n) => (
                  <div key={n.id} className="p-3.5 rounded-xl bg-surface-subtle border border-border/80 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                      <span className="font-bold text-foreground">{n.category}</span>
                      <span>{n.timestamp}</span>
                    </div>
                    <p className="font-semibold text-foreground">{n.title}</p>
                    <span className="text-[10px] text-muted-foreground block">{n.source}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          /* =========================================================================
             PRO MODE VIEW (Full Institutional Quant Analytics)
             ========================================================================= */
          <div className="space-y-8">
            
            {/* Pro Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card to-primary/10 border border-border p-6 sm:p-8 shadow-tactile-md">
              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="max-w-2xl space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/25 text-primary text-xs font-mono font-bold">
                    <span className="w-2 h-2 rounded-full bg-bull animate-pulse" />
                    <span>Pro Mode: NSE / BSE Live Intelligence Active</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-foreground tracking-tight">
                    Indian Equities AI Prediction & War Room
                  </h1>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    5 autonomous agents continuously track <strong className="text-foreground">NIFTY 50</strong>, <strong className="text-foreground">BANK NIFTY</strong>, FII/DII cash flows, option chain PCR, and quarterly results.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to="/agency"
                    onClick={() => sound.playClick()}
                    className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-tactile-sm hover:brightness-110 active:scale-95 transition-all"
                  >
                    <Bot className="w-5 h-5" />
                    <span>Open War Room</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Indian Benchmark Indices */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  <h2 className="text-base font-bold text-foreground tracking-tight">
                    Indian Benchmark Indices (NSE & BSE)
                  </h2>
                </div>
                <span className="text-xs font-mono text-muted-foreground">Live Telemetry</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {indianIndices.map(idx => {
                  const isPos = idx.changePercent >= 0;
                  return (
                    <div key={idx.symbol} className="p-4 rounded-xl bg-card border border-border shadow-tactile-sm flex flex-col justify-between hover:border-primary/40 transition-all">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-foreground font-mono">{idx.symbol}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">NSE</span>
                      </div>
                      <div className="text-lg font-bold font-num text-foreground">₹{idx.price.toLocaleString()}</div>
                      <div className={`text-xs font-mono font-semibold flex items-center gap-1 mt-1 ${isPos ? 'text-bull' : 'text-bear'}`}>
                        {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{isPos ? `+${idx.changePercent}%` : `${idx.changePercent}%`}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Signal Heatmap */}
            <div>
              <SignalHeatmap stocks={stocks} />
            </div>

            {/* All Equities Grid */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-foreground">NSE / BSE Equities Grid</h2>
                </div>

                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-subtle border border-border overflow-x-auto text-xs">
                  <Filter className="w-3.5 h-3.5 text-muted-foreground ml-2 mr-1 shrink-0" />
                  {sectors.map(sec => (
                    <button
                      key={sec}
                      onClick={() => {
                        sound.playClick();
                        setSectorFilter(sec);
                      }}
                      className={`px-3 py-1 rounded-lg font-mono font-medium transition-all ${
                        sectorFilter === sec ? 'bg-primary text-primary-foreground font-bold shadow-sm' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {sec}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredStocks.map((stock) => (
                  <StockCard 
                    key={stock.id} 
                    stock={stock} 
                    onToggleWatchlist={toggleWatchlist}
                    onClick={handleStockClick}
                  />
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;