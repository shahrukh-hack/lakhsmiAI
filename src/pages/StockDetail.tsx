import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { StockService } from '../api/apiService';
import { StockPrediction } from '../types';
import StockChart from '../components/common/StockChart';
import { OrderBookDepth } from '../components/common/OrderBookDepth';
import { 
  TrendingUp, 
  TrendingDown, 
  Star, 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  Activity, 
  DollarSign, 
  CheckCircle2,
  Bot
} from 'lucide-react';
import { sound } from '../lib/sound';
import toast from 'react-hot-toast';

export const StockDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toggleWatchlist, addPaperTrade, isBeginnerMode } = useAppContext();
  const [stock, setStock] = useState<StockPrediction | null>(null);
  const [loading, setLoading] = useState(true);

  // Quick Paper Trade State
  const [tradeQuantity, setTradeQuantity] = useState<number>(10);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      StockService.getStockById(id)
        .then(data => setStock(data || null))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-36">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Asset Not Found</h2>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const isBullish = stock.prediction === 'bullish';
  const isBearish = stock.prediction === 'bearish';
  const isPos = stock.change >= 0;

  const handleExecuteTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (tradeQuantity <= 0) return;

    addPaperTrade({
      stockId: stock.id,
      stockSymbol: stock.symbol,
      stockName: stock.name,
      type: tradeType,
      price: stock.price,
      quantity: tradeQuantity,
      stopLoss: isBullish ? stock.targetPrice.bear : stock.targetPrice.bull,
      takeProfit: isBullish ? stock.targetPrice.bull : stock.targetPrice.bear,
      agentRationale: `Executed on ${stock.symbol} following ${stock.prediction.toUpperCase()} consensus rating.`
    });

    setIsTradeModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              navigate(-1);
            }}
            className="p-2 rounded-xl bg-card border border-border hover:border-primary/50 text-foreground transition-all shadow-tactile-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">
                {stock.symbol}
              </h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-subtle border border-border text-muted-foreground">
                {stock.exchange}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-subtle border border-border text-muted-foreground">
                {stock.sector}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{stock.name}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => toggleWatchlist(stock.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all shadow-tactile-sm ${
              stock.inWatchlist
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-card border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <Star className={`w-4 h-4 ${stock.inWatchlist ? 'fill-amber-400' : ''}`} />
            <span>{stock.inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setIsTradeModalOpen(true);
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-tactile-sm hover:brightness-110 active:scale-95 transition-all"
          >
            <DollarSign className="w-4 h-4" />
            <span>Quick Paper Trade</span>
          </button>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-card border border-border shadow-tactile-sm">
          <span className="text-xs font-mono text-muted-foreground block">Spot Price</span>
          <div className="text-2xl font-bold font-num text-foreground mt-1">
            ₹{stock.price.toLocaleString()}
          </div>
          <div className={`text-xs font-mono font-semibold flex items-center gap-1 mt-0.5 ${isPos ? 'text-bull' : 'text-bear'}`}>
            {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{isPos ? `+${stock.change}%` : `${stock.change}%`}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border shadow-tactile-sm">
          <span className="text-xs font-mono text-muted-foreground block">AI Signal</span>
          <div className={`text-lg font-bold font-mono uppercase mt-1 ${
            isBullish ? 'text-bull' : isBearish ? 'text-bear' : 'text-muted-foreground'
          }`}>
            {stock.prediction}
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">
            {stock.confidence}% Confidence
          </span>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border shadow-tactile-sm">
          <span className="text-xs font-mono text-muted-foreground block">Bull Target</span>
          <div className="text-lg font-bold font-num text-bull mt-1">
            ₹{stock.targetPrice.bull.toLocaleString()}
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">
            +{( ((stock.targetPrice.bull - stock.price) / stock.price) * 100 ).toFixed(1)}% Upside
          </span>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border shadow-tactile-sm">
          <span className="text-xs font-mono text-muted-foreground block">Bear Invalidation</span>
          <div className="text-lg font-bold font-num text-bear mt-1">
            ₹{stock.targetPrice.bear.toLocaleString()}
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">
            Stop Threshold
          </span>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border shadow-tactile-sm">
          <span className="text-xs font-mono text-muted-foreground block">P/E Ratio</span>
          <div className="text-lg font-bold font-mono text-foreground mt-1">
            {stock.metrics.peRatio || 'N/A'}
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">
            Beta: {stock.metrics.beta}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border shadow-tactile-sm">
          <span className="text-xs font-mono text-muted-foreground block">Market Cap</span>
          <div className="text-lg font-bold font-mono text-foreground mt-1">
            {stock.metrics.marketCap}
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">
            Vol: {stock.metrics.volume24h}
          </span>
        </div>
      </div>

      {/* Beginner Mode Plain-English Guidance Card */}
      {isBeginnerMode && (
        <div className="p-6 rounded-2xl bg-card border border-bull/30 shadow-tactile-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-xl">💡</span>
              <h3 className="font-bold text-foreground text-sm">
                Beginner Friendly Trade Breakdown for {stock.symbol}
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-bull/20 text-bull font-bold">
              ZERO RISK PRACTICE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-surface-subtle border border-border/80">
              <span className="text-muted-foreground font-mono text-[10px] block">1. What to do:</span>
              <span className="text-base font-bold text-bull mt-1 block">
                {isBullish ? '🟢 Buy / Accumulate' : isBearish ? '🔴 Avoid / Wait' : '⚪ Hold / Neutral'}
              </span>
              <span className="text-muted-foreground text-[11px]">AI Confidence: {stock.confidence}%</span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-subtle border border-border/80">
              <span className="text-muted-foreground font-mono text-[10px] block">2. Expected Profit Goal:</span>
              <span className="text-base font-bold text-bull mt-1 block">
                ₹{stock.targetPrice.bull} (+{( ((stock.targetPrice.bull - stock.price) / stock.price) * 100 ).toFixed(1)}%)
              </span>
              <span className="text-muted-foreground text-[11px]">Take profit when price hits this goal</span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-subtle border border-border/80">
              <span className="text-muted-foreground font-mono text-[10px] block">3. Safety Exit (Stop Loss):</span>
              <span className="text-base font-bold text-bear mt-1 block">
                ₹{stock.targetPrice.bear} (-{( ((stock.price - stock.targetPrice.bear) / stock.price) * 100 ).toFixed(1)}%)
              </span>
              <span className="text-muted-foreground text-[11px]">Exit here to protect your capital</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Chart Section */}
      <StockChart
        symbol={stock.symbol}
        candlesticks={stock.candlesticks}
        historicalPrices={stock.historicalPrices}
        isBullish={isBullish}
      />

      {/* Level 2 Order Book Depth Ladder */}
      <OrderBookDepth spotPrice={stock.price} symbol={stock.symbol} />

      {/* Technical Indicators & Sentiment Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Technical Signals & Indicators (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl bg-card border border-border p-6 shadow-tactile-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">
              Technical Indicator Oscillators
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-surface-subtle border border-border">
              <span className="text-muted-foreground text-[11px] block">RSI (14)</span>
              <span className={`text-base font-bold ${stock.signals.rsi > 70 ? 'text-bear' : stock.signals.rsi < 30 ? 'text-bull' : 'text-foreground'}`}>
                {stock.signals.rsi}
              </span>
              <span className="text-[10px] text-muted-foreground block">
                {stock.signals.rsi > 70 ? 'Overbought' : stock.signals.rsi < 30 ? 'Oversold' : 'Neutral'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-surface-subtle border border-border">
              <span className="text-muted-foreground text-[11px] block">MACD Trend</span>
              <span className={`text-base font-bold uppercase ${stock.signals.macd === 'positive' ? 'text-bull' : 'text-bear'}`}>
                {stock.signals.macd}
              </span>
              <span className="text-[10px] text-muted-foreground block">Histogram Divergence</span>
            </div>

            <div className="p-3 rounded-xl bg-surface-subtle border border-border">
              <span className="text-muted-foreground text-[11px] block">Bollinger Band</span>
              <span className="text-base font-bold text-foreground capitalize">
                {stock.signals.bollinger}
              </span>
              <span className="text-[10px] text-muted-foreground block">Volatility Channel</span>
            </div>

            <div className="p-3 rounded-xl bg-surface-subtle border border-border">
              <span className="text-muted-foreground text-[11px] block">50/200 EMA</span>
              <span className={`text-base font-bold capitalize ${stock.signals.ema === 'above' ? 'text-bull' : 'text-bear'}`}>
                {stock.signals.ema} Trend
              </span>
              <span className="text-[10px] text-muted-foreground block">Moving Average</span>
            </div>

            <div className="p-3 rounded-xl bg-surface-subtle border border-border">
              <span className="text-muted-foreground text-[11px] block">VWAP Price</span>
              <span className="text-base font-bold text-foreground font-num">
                ₹{stock.signals.vwap}
              </span>
              <span className="text-[10px] text-muted-foreground block">Volume Weighted</span>
            </div>

            <div className="p-3 rounded-xl bg-surface-subtle border border-border">
              <span className="text-muted-foreground text-[11px] block">ADX Trend Strength</span>
              <span className="text-base font-bold text-primary">
                {stock.signals.adx}
              </span>
              <span className="text-[10px] text-muted-foreground block">
                {stock.signals.adx > 25 ? 'Strong Trend' : 'Ranging'}
              </span>
            </div>
          </div>
        </div>

        {/* Social & News Sentiment Matrix (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl bg-card border border-border p-6 shadow-tactile-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <Zap className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">
              Social NLP & Media Sentiment Score ({stock.sentiment.score}/100)
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-mono text-muted-foreground mb-1">
                <span>Overall Sentiment Index</span>
                <span className="text-foreground font-bold">{stock.sentiment.score}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${stock.sentiment.score}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-surface-subtle border border-border">
                <div className="text-[11px] text-muted-foreground font-mono">Twitter / X Sentiment</div>
                <div className="text-lg font-bold font-mono text-foreground mt-0.5">{stock.sentiment.twitter}% Bullish</div>
              </div>

              <div className="p-3 rounded-xl bg-surface-subtle border border-border">
                <div className="text-[11px] text-muted-foreground font-mono">YouTube Analyst Sentiment</div>
                <div className="text-lg font-bold font-mono text-foreground mt-0.5">{stock.sentiment.youtube}% Bullish</div>
              </div>

              <div className="p-3 rounded-xl bg-surface-subtle border border-border">
                <div className="text-[11px] text-muted-foreground font-mono">Telegram Trader Channels</div>
                <div className="text-lg font-bold font-mono text-foreground mt-0.5">{stock.sentiment.telegram}% Bullish</div>
              </div>

              <div className="p-3 rounded-xl bg-surface-subtle border border-border">
                <div className="text-[11px] text-muted-foreground font-mono">Financial News Score</div>
                <div className="text-lg font-bold font-mono text-foreground mt-0.5">{stock.sentiment.news}% Positive</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Multi-Agent Deliberation breakdown for this asset */}
      <div className="rounded-2xl bg-card border border-border p-6 shadow-tactile-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">
              Autonomous Agent Fleet Deliberation on {stock.symbol}
            </h3>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              navigate('/agency');
            }}
            className="text-xs font-mono text-primary hover:underline font-bold"
          >
            Open Live War Room →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stock.agentDeliberation.map((opinion) => (
            <div
              key={opinion.agentId}
              className="p-4 rounded-xl bg-surface-subtle border border-border space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{opinion.avatar}</span>
                  <div>
                    <span className="font-bold text-foreground">{opinion.agentName}</span>
                    <span className="text-[10px] text-muted-foreground block">{opinion.role}</span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                  opinion.verdict.includes('BUY') 
                    ? 'bg-bull/20 text-bull border border-bull/30' 
                    : opinion.verdict.includes('SELL') || opinion.verdict.includes('TRIM')
                      ? 'bg-bear/20 text-bear border border-bear/30' 
                      : 'bg-muted text-muted-foreground'
                }`}>
                  {opinion.verdict}
                </span>
              </div>

              <p className="text-muted-foreground leading-relaxed pl-7">
                {opinion.reasoning}
              </p>

              <div className="flex justify-between pl-7 text-[10px] font-mono text-muted-foreground pt-1">
                <span>Target: ₹{opinion.priceTarget}</span>
                <span>Horizon: {opinion.timeHorizon}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Paper Trade Modal */}
      {isTradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-tactile-lg space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-foreground text-base">
                Execute Paper Trade: {stock.symbol}
              </h3>
              <button 
                onClick={() => setIsTradeModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteTrade} className="space-y-4 text-xs">
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

              <div className="p-3 rounded-xl bg-surface-subtle border border-border/80 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-muted-foreground">
                  <span>Execution Price:</span>
                  <span className="text-foreground font-bold">₹{stock.price}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Estimated Order Value:</span>
                  <span className="text-foreground font-bold">₹{(stock.price * tradeQuantity).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Slippage Buffer:</span>
                  <span className="text-bull font-bold">0.05%</span>
                </div>
              </div>

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
                  Confirm {tradeType.toUpperCase()} Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default StockDetail;