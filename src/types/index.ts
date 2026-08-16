export type PredictionType = 'bullish' | 'bearish' | 'neutral';

export interface AgentOpinion {
  agentId: string;
  agentName: string;
  avatar: string;
  role: string;
  verdict: 'STRONG BUY' | 'ACCUMULATE' | 'HOLD' | 'TRIM' | 'EXIT';
  confidence: number;
  priceTarget: number;
  reasoning: string;
  timeHorizon: '1-3 Days' | '1-4 Weeks' | '3-6 Months' | '1 Year';
}

export interface CandlestickData {
  x: string | number | Date;
  y: [number, number, number, number]; // [Open, High, Low, Close]
}

export interface StockPrediction {
  id: string;
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE' | 'NASDAQ' | 'CRYPTO';
  sector: string;
  price: number;
  change: number;
  prediction: PredictionType;
  confidence: number;
  targetPrice: {
    bull: number;
    base: number;
    bear: number;
  };
  metrics: {
    peRatio: number;
    marketCap: string;
    volume24h: string;
    high52w: number;
    low52w: number;
    beta: number;
  };
  signals: {
    rsi: number;
    macd: 'positive' | 'negative';
    bollinger: 'upper' | 'middle' | 'lower';
    ema: 'above' | 'below';
    sma: 'above' | 'below';
    vwap: number;
    adx: number;
  };
  sentiment: {
    score: number; // 0 to 100
    twitter: number;
    youtube: number;
    telegram: number;
    news: number;
  };
  agentDeliberation: AgentOpinion[];
  historicalPrices: Array<{
    date: string;
    price: number;
    volume?: number;
  }>;
  candlesticks: CandlestickData[];
  inWatchlist: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  accountBalance: number;
  portfolioValue: number;
  watchlist: string[];
  paperTrades: PaperTrade[];
}

export interface PaperTrade {
  id: string;
  stockId: string;
  stockSymbol: string;
  stockName: string;
  type: 'buy' | 'sell';
  price: number;
  quantity: number;
  date: string;
  status: 'open' | 'closed';
  closePrice?: number;
  profitLoss?: number;
  profitLossPercentage?: number;
  stopLoss?: number;
  takeProfit?: number;
  agentRationale?: string;
}

export type NotificationType = 'prediction' | 'alert' | 'trade' | 'system' | 'agent';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  read: boolean;
  stockId?: string;
}

// -------------------------------------------------------------
// VIBE AGENCY: MULTI-AGENT TYPES
// -------------------------------------------------------------
export interface FinancialAgent {
  id: string;
  name: string;
  code: string;
  role: string;
  department: 'Quantitative' | 'Fundamental' | 'Sentiment' | 'Risk' | 'Macro';
  avatar: string;
  status: 'active' | 'analyzing' | 'idle' | 'executing';
  specialty: string;
  accuracyRate: number;
  recentTasksCount: number;
  systemPrompt: string;
}

export interface WarRoomMessage {
  id: string;
  agentId: string;
  agentName: string;
  avatar: string;
  symbol: string;
  content: string;
  verdict?: 'BUY' | 'SELL' | 'HOLD';
  confidence?: number;
  timestamp: string;
}

// -------------------------------------------------------------
// VIBE MEMORY: STRATEGY & DECISION TYPES
// -------------------------------------------------------------
export interface TradeThesisMemory {
  id: string;
  symbol: string;
  title: string;
  hypothesis: string;
  catalysts: string[];
  invalidationCriteria: string;
  targetHorizon: string;
  authorAgent: string;
  dateCreated: string;
  status: 'ACTIVE' | 'VALIDATED' | 'INVALIDATED' | 'ARCHIVED';
  pnlOutcome?: number;
}

export interface ArchitectureDecision {
  id: string;
  code: string;
  title: string;
  summary: string;
  date: string;
  category: 'Risk Thresholds' | 'Execution Slippage' | 'Model Consensus' | 'Data Pipeline';
}

// -------------------------------------------------------------
// VIBE SKILLS: EXECUTABLE SKILL TYPES
// -------------------------------------------------------------
export interface FinancialSkill {
  id: string;
  name: string;
  category: 'Quantitative' | 'NLP Sentiment' | 'Risk & Stress' | 'Valuation' | 'Automation';
  icon: string;
  description: string;
  inputsSchema: Record<string, string>;
  defaultParams: Record<string, string | number>;
  compliance: 'agentskills.io' | 'standard';
}