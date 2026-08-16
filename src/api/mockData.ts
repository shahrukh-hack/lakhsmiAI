import { StockPrediction, Notification, User, FinancialAgent, TradeThesisMemory, ArchitectureDecision, FinancialSkill } from '../types';

// Helper to generate realistic candlestick data for ApexCharts
function generateCandlesticks(basePrice: number, count = 30) {
  const result = [];
  let current = basePrice * 0.92;
  const now = new Date();

  for (let i = count; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split('T')[0];
    
    const delta = (Math.random() - 0.48) * (basePrice * 0.025);
    const open = current;
    const close = +(current + delta).toFixed(2);
    const high = +(Math.max(open, close) + Math.random() * (basePrice * 0.015)).toFixed(2);
    const low = +(Math.min(open, close) - Math.random() * (basePrice * 0.015)).toFixed(2);
    
    result.push({
      x: dateStr,
      y: [open, high, low, close] as [number, number, number, number]
    });
    current = close;
  }
  return result;
}

export const mockStocks: StockPrediction[] = [
  {
    id: 'reliance',
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    exchange: 'NSE',
    sector: 'Energy & Digital Retail',
    price: 2984.50,
    change: 2.34,
    prediction: 'bullish',
    confidence: 89,
    targetPrice: { bull: 3250.00, base: 3100.00, bear: 2820.00 },
    metrics: {
      peRatio: 26.8,
      marketCap: '₹20.19 Lakh Cr',
      volume24h: '48.2 Lakh shares',
      high52w: 3024.90,
      low52w: 2210.30,
      beta: 0.94
    },
    signals: {
      rsi: 62.4,
      macd: 'positive',
      bollinger: 'upper',
      ema: 'above',
      sma: 'above',
      vwap: 2962.10,
      adx: 28.5
    },
    sentiment: { score: 88, twitter: 84, youtube: 92, telegram: 80, news: 91 },
    agentDeliberation: [
      {
        agentId: 'agent-quant',
        agentName: 'Quant-X Engine',
        avatar: '📈',
        role: 'NSE Derivative & Momentum Quant',
        verdict: 'STRONG BUY',
        confidence: 92,
        priceTarget: 3220,
        reasoning: 'Golden Cross on 50/200 EMA with heavy call unwinding at ₹3000 strike. Nifty weightage support intact.',
        timeHorizon: '1-4 Weeks'
      },
      {
        agentId: 'agent-fund',
        agentName: 'AlphaVal Fundamental',
        avatar: '📊',
        role: 'Chief Indian Equities Valuation Lead',
        verdict: 'ACCUMULATE',
        confidence: 86,
        priceTarget: 3180,
        reasoning: 'Jio 5G ARPU expansion + Retail EBITDA margin inflection creates a ₹220/share intrinsic value re-rating.',
        timeHorizon: '3-6 Months'
      },
      {
        agentId: 'agent-sent',
        agentName: 'SentimentPulse',
        avatar: '📰',
        role: 'DII & Domestic Retail Sentiment Sentinel',
        verdict: 'STRONG BUY',
        confidence: 89,
        priceTarget: 3250,
        reasoning: 'Green energy giga-complex commissioning updates driving mutual fund bulk buying inflows.',
        timeHorizon: '1-3 Days'
      },
      {
        agentId: 'agent-risk',
        agentName: 'RiskSentinel Guard',
        avatar: '🛡️',
        role: 'NSE Circuit & Stop Loss Officer',
        verdict: 'HOLD',
        confidence: 84,
        priceTarget: 2950,
        reasoning: 'Trailing stop-loss at ₹2,870. Portfolio beta well within Nifty 50 safety envelope.',
        timeHorizon: '1-4 Weeks'
      }
    ],
    historicalPrices: [
      { date: '2026-07-15', price: 2820.00 },
      { date: '2026-07-22', price: 2865.40 },
      { date: '2026-07-29', price: 2890.10 },
      { date: '2026-08-05', price: 2920.00 },
      { date: '2026-08-12', price: 2954.80 },
      { date: '2026-08-16', price: 2984.50 },
    ],
    candlesticks: generateCandlesticks(2984.50),
    inWatchlist: true,
  },
  {
    id: 'tcs',
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    exchange: 'NSE',
    sector: 'Information Technology',
    price: 4312.20,
    change: 1.15,
    prediction: 'bullish',
    confidence: 83,
    targetPrice: { bull: 4650.00, base: 4450.00, bear: 4100.00 },
    metrics: {
      peRatio: 31.4,
      marketCap: '₹15.60 Lakh Cr',
      volume24h: '21.5 Lakh shares',
      high52w: 4592.00,
      low52w: 3315.00,
      beta: 0.72
    },
    signals: {
      rsi: 57.8,
      macd: 'positive',
      bollinger: 'middle',
      ema: 'above',
      sma: 'above',
      vwap: 4295.00,
      adx: 22.1
    },
    sentiment: { score: 81, twitter: 76, youtube: 84, telegram: 78, news: 86 },
    agentDeliberation: [
      {
        agentId: 'agent-quant',
        agentName: 'Quant-X Engine',
        avatar: '📈',
        role: 'NSE Derivative & Momentum Quant',
        verdict: 'ACCUMULATE',
        confidence: 82,
        priceTarget: 4480,
        reasoning: 'RSI sustaining 55-60 bull zone with steady DII mutual fund systematic accumulation.',
        timeHorizon: '1-4 Weeks'
      },
      {
        agentId: 'agent-macro',
        agentName: 'MacroSphere',
        avatar: '🌐',
        role: 'India Macro & FX Strategist',
        verdict: 'STRONG BUY',
        confidence: 87,
        priceTarget: 4620,
        reasoning: 'USD/INR stability at ₹83.45 and BFSI deal ramp-ups in North America supporting margin expansion.',
        timeHorizon: '3-6 Months'
      }
    ],
    historicalPrices: [
      { date: '2026-07-15', price: 4150.00 },
      { date: '2026-07-22', price: 4205.00 },
      { date: '2026-07-29', price: 4240.50 },
      { date: '2026-08-05', price: 4280.00 },
      { date: '2026-08-12', price: 4295.00 },
      { date: '2026-08-16', price: 4312.20 },
    ],
    candlesticks: generateCandlesticks(4312.20),
    inWatchlist: true,
  },
  {
    id: 'hdfcbank',
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Limited',
    exchange: 'NSE',
    sector: 'Banking & Financial Services',
    price: 1648.75,
    change: -0.62,
    prediction: 'neutral',
    confidence: 68,
    targetPrice: { bull: 1820.00, base: 1710.00, bear: 1540.00 },
    metrics: {
      peRatio: 18.2,
      marketCap: '₹12.54 Lakh Cr',
      volume24h: '94.0 Lakh shares',
      high52w: 1794.00,
      low52w: 1363.00,
      beta: 1.08
    },
    signals: {
      rsi: 48.2,
      macd: 'negative',
      bollinger: 'middle',
      ema: 'below',
      sma: 'above',
      vwap: 1655.40,
      adx: 16.4
    },
    sentiment: { score: 64, twitter: 60, youtube: 68, telegram: 62, news: 70 },
    agentDeliberation: [
      {
        agentId: 'agent-fund',
        agentName: 'AlphaVal Fundamental',
        avatar: '📊',
        role: 'Chief Indian Equities Valuation Lead',
        verdict: 'ACCUMULATE',
        confidence: 78,
        priceTarget: 1780,
        reasoning: 'LDR (Loan to Deposit Ratio) normalization progressing ahead of RBI targets; historical valuation discount.',
        timeHorizon: '3-6 Months'
      },
      {
        agentId: 'agent-quant',
        agentName: 'Quant-X Engine',
        avatar: '📈',
        role: 'NSE Derivative & Momentum Quant',
        verdict: 'HOLD',
        confidence: 70,
        priceTarget: 1670,
        reasoning: 'Rangebound in ₹1620 - ₹1680 consolidation. Wait for Bank Nifty trend breakout confirmation.',
        timeHorizon: '1-3 Days'
      }
    ],
    historicalPrices: [
      { date: '2026-07-15', price: 1620.00 },
      { date: '2026-07-22', price: 1640.00 },
      { date: '2026-07-29', price: 1670.00 },
      { date: '2026-08-05', price: 1660.00 },
      { date: '2026-08-12', price: 1655.00 },
      { date: '2026-08-16', price: 1648.75 },
    ],
    candlesticks: generateCandlesticks(1648.75),
    inWatchlist: true,
  },
  {
    id: 'tatamotors',
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Limited',
    exchange: 'NSE',
    sector: 'Automobile & EV Mobility',
    price: 1042.80,
    change: 3.85,
    prediction: 'bullish',
    confidence: 91,
    targetPrice: { bull: 1180.00, base: 1120.00, bear: 960.00 },
    metrics: {
      peRatio: 16.4,
      marketCap: '₹3.85 Lakh Cr',
      volume24h: '72.4 Lakh shares',
      high52w: 1179.00,
      low52w: 593.00,
      beta: 1.34
    },
    signals: {
      rsi: 68.4,
      macd: 'positive',
      bollinger: 'upper',
      ema: 'above',
      sma: 'above',
      vwap: 1028.50,
      adx: 34.2
    },
    sentiment: { score: 93, twitter: 91, youtube: 95, telegram: 89, news: 94 },
    agentDeliberation: [
      {
        agentId: 'agent-quant',
        agentName: 'Quant-X Engine',
        avatar: '📈',
        role: 'NSE Derivative & Momentum Quant',
        verdict: 'STRONG BUY',
        confidence: 94,
        priceTarget: 1150,
        reasoning: 'Bullish flag breakout with heavy volume spike. Nifty Auto outperformance driver.',
        timeHorizon: '1-4 Weeks'
      },
      {
        agentId: 'agent-fund',
        agentName: 'AlphaVal Fundamental',
        avatar: '📊',
        role: 'Chief Indian Equities Valuation Lead',
        verdict: 'STRONG BUY',
        confidence: 90,
        priceTarget: 1160,
        reasoning: 'JLR net cash positive transition + India EV market share dominance (70%+) supports PE re-rating.',
        timeHorizon: '3-6 Months'
      }
    ],
    historicalPrices: [
      { date: '2026-07-15', price: 965.00 },
      { date: '2026-07-22', price: 982.00 },
      { date: '2026-07-29', price: 1005.00 },
      { date: '2026-08-05', price: 1018.00 },
      { date: '2026-08-12', price: 1025.00 },
      { date: '2026-08-16', price: 1042.80 },
    ],
    candlesticks: generateCandlesticks(1042.80),
    inWatchlist: true,
  },
  {
    id: 'sbin',
    symbol: 'SBIN',
    name: 'State Bank of India',
    exchange: 'NSE',
    sector: 'Public Sector Banking',
    price: 818.40,
    change: 1.84,
    prediction: 'bullish',
    confidence: 86,
    targetPrice: { bull: 920.00, base: 875.00, bear: 760.00 },
    metrics: {
      peRatio: 10.8,
      marketCap: '₹7.30 Lakh Cr',
      volume24h: '115.0 Lakh shares',
      high52w: 912.00,
      low52w: 555.00,
      beta: 1.15
    },
    signals: {
      rsi: 61.2,
      macd: 'positive',
      bollinger: 'upper',
      ema: 'above',
      sma: 'above',
      vwap: 812.00,
      adx: 27.8
    },
    sentiment: { score: 85, twitter: 80, youtube: 88, telegram: 82, news: 89 },
    agentDeliberation: [
      {
        agentId: 'agent-quant',
        agentName: 'Quant-X Engine',
        avatar: '📈',
        role: 'NSE Derivative & Momentum Quant',
        verdict: 'STRONG BUY',
        confidence: 88,
        priceTarget: 890,
        reasoning: 'PSU Bank index leader. Fresh open interest addition in ₹820-840 call strikes.',
        timeHorizon: '1-4 Weeks'
      },
      {
        agentId: 'agent-macro',
        agentName: 'MacroSphere',
        avatar: '🌐',
        role: 'India Macro & FX Strategist',
        verdict: 'ACCUMULATE',
        confidence: 85,
        priceTarget: 910,
        reasoning: 'Lowest gross NPA cycle in 12 years (2.2%) combined with robust corporate credit growth in India.',
        timeHorizon: '3-6 Months'
      }
    ],
    historicalPrices: [
      { date: '2026-07-15', price: 775.00 },
      { date: '2026-07-22', price: 788.00 },
      { date: '2026-07-29', price: 796.00 },
      { date: '2026-08-05', price: 804.00 },
      { date: '2026-08-12', price: 810.00 },
      { date: '2026-08-16', price: 818.40 },
    ],
    candlesticks: generateCandlesticks(818.40),
    inWatchlist: true,
  },
  {
    id: 'bhartiartl',
    symbol: 'BHARTIARTL',
    name: 'Bharti Airtel Limited',
    exchange: 'NSE',
    sector: 'Telecommunications',
    price: 1485.60,
    change: 2.10,
    prediction: 'bullish',
    confidence: 88,
    targetPrice: { bull: 1650.00, base: 1560.00, bear: 1390.00 },
    metrics: {
      peRatio: 52.4,
      marketCap: '₹8.72 Lakh Cr',
      volume24h: '38.0 Lakh shares',
      high52w: 1530.00,
      low52w: 850.00,
      beta: 0.68
    },
    signals: {
      rsi: 65.5,
      macd: 'positive',
      bollinger: 'upper',
      ema: 'above',
      sma: 'above',
      vwap: 1472.00,
      adx: 31.0
    },
    sentiment: { score: 89, twitter: 85, youtube: 90, telegram: 84, news: 92 },
    agentDeliberation: [
      {
        agentId: 'agent-fund',
        agentName: 'AlphaVal Fundamental',
        avatar: '📊',
        role: 'Chief Indian Equities Valuation Lead',
        verdict: 'STRONG BUY',
        confidence: 91,
        priceTarget: 1620,
        reasoning: 'Industry-leading ARPU at ₹235+ with accelerating free cash flow conversion and Africa business growth.',
        timeHorizon: '3-6 Months'
      }
    ],
    historicalPrices: [
      { date: '2026-07-15', price: 1410.00 },
      { date: '2026-07-22', price: 1430.00 },
      { date: '2026-07-29', price: 1450.00 },
      { date: '2026-08-05', price: 1465.00 },
      { date: '2026-08-12', price: 1472.00 },
      { date: '2026-08-16', price: 1485.60 },
    ],
    candlesticks: generateCandlesticks(1485.60),
    inWatchlist: false,
  },
  {
    id: 'zomato',
    symbol: 'ZOMATO',
    name: 'Zomato Limited',
    exchange: 'NSE',
    sector: 'Consumer Tech & Quick Commerce',
    price: 262.40,
    change: 4.65,
    prediction: 'bullish',
    confidence: 92,
    targetPrice: { bull: 310.00, base: 290.00, bear: 225.00 },
    metrics: {
      peRatio: 98.2,
      marketCap: '₹2.31 Lakh Cr',
      volume24h: '340.0 Lakh shares',
      high52w: 280.00,
      low52w: 88.00,
      beta: 1.45
    },
    signals: {
      rsi: 72.1,
      macd: 'positive',
      bollinger: 'upper',
      ema: 'above',
      sma: 'above',
      vwap: 256.80,
      adx: 38.4
    },
    sentiment: { score: 94, twitter: 96, youtube: 92, telegram: 95, news: 94 },
    agentDeliberation: [
      {
        agentId: 'agent-quant',
        agentName: 'Quant-X Engine',
        avatar: '📈',
        role: 'NSE Derivative & Momentum Quant',
        verdict: 'STRONG BUY',
        confidence: 95,
        priceTarget: 300,
        reasoning: 'Momentum powerhouse in Nifty Next 50. Blinkit dark store expansion driving hyper-growth.',
        timeHorizon: '1-4 Weeks'
      }
    ],
    historicalPrices: [
      { date: '2026-07-15', price: 228.00 },
      { date: '2026-07-22', price: 236.00 },
      { date: '2026-07-29', price: 245.00 },
      { date: '2026-08-05', price: 252.00 },
      { date: '2026-08-12', price: 258.00 },
      { date: '2026-08-16', price: 262.40 },
    ],
    candlesticks: generateCandlesticks(262.40),
    inWatchlist: true,
  },
  {
    id: 'infosys',
    symbol: 'INFY',
    name: 'Infosys Limited',
    exchange: 'NSE',
    sector: 'Information Technology',
    price: 1845.30,
    change: -1.45,
    prediction: 'bearish',
    confidence: 74,
    targetPrice: { bull: 1950.00, base: 1810.00, bear: 1720.00 },
    metrics: {
      peRatio: 28.5,
      marketCap: '₹7.68 Lakh Cr',
      volume24h: '31.0 Lakh shares',
      high52w: 1980.00,
      low52w: 1358.00,
      beta: 0.88
    },
    signals: {
      rsi: 41.5,
      macd: 'negative',
      bollinger: 'lower',
      ema: 'below',
      sma: 'below',
      vwap: 1860.20,
      adx: 24.0
    },
    sentiment: { score: 48, twitter: 44, youtube: 52, telegram: 46, news: 50 },
    agentDeliberation: [
      {
        agentId: 'agent-quant',
        agentName: 'Quant-X Engine',
        avatar: '📈',
        role: 'NSE Derivative & Momentum Quant',
        verdict: 'TRIM',
        confidence: 76,
        priceTarget: 1760,
        reasoning: 'Rejection at 50 EMA resistance with bearish MACD divergence on daily candle.',
        timeHorizon: '1-4 Weeks'
      },
      {
        agentId: 'agent-risk',
        agentName: 'RiskSentinel Guard',
        avatar: '🛡️',
        role: 'NSE Circuit & Stop Loss Officer',
        verdict: 'EXIT',
        confidence: 80,
        priceTarget: 1740,
        reasoning: 'FII short buildup in IT futures; enforce capital preservation rules.',
        timeHorizon: '1-3 Days'
      }
    ],
    historicalPrices: [
      { date: '2026-07-15', price: 1910.00 },
      { date: '2026-07-22', price: 1895.00 },
      { date: '2026-07-29', price: 1880.00 },
      { date: '2026-08-05', price: 1865.00 },
      { date: '2026-08-12', price: 1855.00 },
      { date: '2026-08-16', price: 1845.30 },
    ],
    candlesticks: generateCandlesticks(1845.30),
    inWatchlist: false,
  }
];

// -------------------------------------------------------------
// VIBE AGENCY: THE 5 INDIAN EQUITIES SPECIALIZED AGENTS
// -------------------------------------------------------------
export const mockAgents: FinancialAgent[] = [
  {
    id: 'agent-quant',
    name: 'Quant-X Algorithmic',
    code: 'QX-900',
    role: 'Chief NSE / BSE Derivative & Quant Lead',
    department: 'Quantitative',
    avatar: '📈',
    status: 'active',
    specialty: 'NIFTY & BANK NIFTY Option Chain PCR, FII/DII Net Cash Inflows, 50/200 EMA & VWAP Breakouts',
    accuracyRate: 92.4,
    recentTasksCount: 540,
    systemPrompt: 'You specialize in Indian equities price action, derivative open interest, and NSE circuit band limits.'
  },
  {
    id: 'agent-fund',
    name: 'AlphaVal Intrinsic',
    code: 'AV-700',
    role: 'Head Indian Equities Valuation Specialist',
    department: 'Fundamental',
    avatar: '📊',
    status: 'active',
    specialty: 'Quarterly Corporate Results (Q1-Q4), GST/Credit Growth Tailwinds, PEG Ratios & India Capex Cycles',
    accuracyRate: 89.8,
    recentTasksCount: 410,
    systemPrompt: 'You analyze BSE/NSE audited balance sheets, EBITDA margins, and industry regulatory moats.'
  },
  {
    id: 'agent-sent',
    name: 'SentimentPulse',
    code: 'SP-500',
    role: 'DII & Indian Social Media NLP Sentinel',
    department: 'Sentiment',
    avatar: '📰',
    status: 'analyzing',
    specialty: 'Moneycontrol, LiveMint, Economic Times Headlines, Block Deals, and Retail Brokerage Sentiment',
    accuracyRate: 87.5,
    recentTasksCount: 780,
    systemPrompt: 'You parse real-time Indian business news, SEBI filings, and domestic institutional buying.'
  },
  {
    id: 'agent-risk',
    name: 'RiskSentinel Guard',
    code: 'RS-300',
    role: 'SEBI & RBI Regulatory Risk Officer',
    department: 'Risk',
    avatar: '🛡️',
    status: 'active',
    specialty: 'RBI Repo Rate Sensitivity, Nifty Max Drawdown Caps, Stop-Loss Rules & Position Sizing Parity',
    accuracyRate: 95.6,
    recentTasksCount: 610,
    systemPrompt: 'You enforce strict risk limits, trailing stop losses, and protect against sudden market gap-downs.'
  },
  {
    id: 'agent-macro',
    name: 'MacroSphere India',
    code: 'MS-800',
    role: 'India Macro & Global Liquidity Strategist',
    department: 'Macro',
    avatar: '🌐',
    status: 'active',
    specialty: 'USD/INR Exchange Rates, Brent Crude Oil Sensitivity, India CPI Inflation & Sovereign Bond Yields',
    accuracyRate: 88.9,
    recentTasksCount: 360,
    systemPrompt: 'You correlate Indian macroeconomic indicators, monsoons, and central bank policy to sectoral rotations.'
  }
];

// -------------------------------------------------------------
// VIBE MEMORY: INDIAN MARKET THESES & ADRs
// -------------------------------------------------------------
export const mockTheses: TradeThesisMemory[] = [
  {
    id: 'thesis-001',
    symbol: 'RELIANCE',
    title: '5G ARPU Hike Cycle & New Energy Gigafactory Monetization',
    hypothesis: 'Consolidation above ₹2950 marks institutional base. Green Hydrogen policy incentives will unlock ₹300/share value.',
    catalysts: ['Q2 Earnings Announcement', 'Cabinet Cleared Solar PLI Schemes', 'Telecom Tariff Revision'],
    invalidationCriteria: 'Daily candle close below ₹2820 on high volume.',
    targetHorizon: '3-6 Months',
    authorAgent: 'AlphaVal Intrinsic',
    dateCreated: '2026-08-10',
    status: 'ACTIVE',
    pnlOutcome: 4.8
  },
  {
    id: 'thesis-002',
    symbol: 'TATAMOTORS',
    title: 'JLR Net Cash Transition & EV Market Leadership',
    hypothesis: 'India passenger vehicle EV market share at 70%+ combined with JLR order book de-leveraging balance sheet.',
    catalysts: ['Monthly Auto Sales Dispatch Numbers', 'Curvv EV Launch Momentum'],
    invalidationCriteria: 'JLR gross margin decline below 7.5% or loss of domestic market share.',
    targetHorizon: '6-12 Months',
    authorAgent: 'Quant-X Algorithmic',
    dateCreated: '2026-08-01',
    status: 'ACTIVE',
    pnlOutcome: 14.2
  }
];

export const mockAdrs: ArchitectureDecision[] = [
  {
    id: 'adr-001',
    code: 'ADR-IND-01',
    title: 'NSE / BSE Market Hours Synchronization',
    summary: 'Platform feeds, intraday candles, and automated agent deliberations synchronize with IST trading session (09:15 AM - 03:30 PM IST).',
    date: '2026-08-12',
    category: 'Data Pipeline'
  },
  {
    id: 'adr-002',
    code: 'ADR-IND-02',
    title: 'SEBI Circuit Filter & Slippage Buffer',
    summary: 'Simulated paper trading applies realistic 0.05% slippage and strictly adheres to NSE 5%/10%/20% upper and lower circuit price bands.',
    date: '2026-08-14',
    category: 'Execution Slippage'
  },
  {
    id: 'adr-003',
    code: 'ADR-IND-03',
    title: 'Indian Rupee (₹) Unified Metric Standard',
    summary: 'All portfolio values, order entries, target corridors, and market cap metrics are natively denominated in INR (₹ Lakh Cr / ₹ Cr).',
    date: '2026-08-16',
    category: 'Model Consensus'
  }
];

// -------------------------------------------------------------
// VIBE SKILLS: 23 STANDARD FINANCIAL & AGENT SKILLS
// -------------------------------------------------------------
export const mockSkills: FinancialSkill[] = [
  {
    id: 'rsi-macd-momentum-scanner',
    name: 'NSE RSI & MACD Momentum Scanner',
    category: 'Quantitative',
    icon: '📊',
    description: 'Computes 14-period RSI, 12/26 MACD exponential signal lines, and divergence triggers on Indian equities.',
    inputsSchema: { symbol: 'NSE Stock Symbol', timeframe: 'Timeframe (1D, 1W)', rsiPeriod: 'RSI Period' },
    defaultParams: { symbol: 'RELIANCE', timeframe: '1D', rsiPeriod: 14 },
    compliance: 'agentskills.io'
  },
  {
    id: 'sentiment-nlp-parser',
    name: 'Indian Financial News NLP Parser',
    category: 'NLP Sentiment',
    icon: '📰',
    description: 'Extracts semantic sentiment polarity from Economic Times, Moneycontrol, LiveMint, and SEBI disclosures.',
    inputsSchema: { textInput: 'News Headline or Text', entityFocus: 'Target Entity' },
    defaultParams: { textInput: 'Company reports 24% net profit growth and declares ₹12/share special dividend.', entityFocus: 'Earnings' },
    compliance: 'agentskills.io'
  },
  {
    id: 'var-drawdown-stress-tester',
    name: 'NIFTY Value at Risk (VaR) Stress Tester',
    category: 'Risk & Stress',
    icon: '🛡️',
    description: 'Simulates 10,000 historical Monte Carlo scenarios calibrated to Nifty 50 volatility distributions.',
    inputsSchema: { portfolioCapital: 'Capital (₹)', confidenceLevel: 'Confidence (%)', shockFactor: 'Shock Stress (%)' },
    defaultParams: { portfolioCapital: 1000000, confidenceLevel: 95, shockFactor: 15 },
    compliance: 'agentskills.io'
  },
  {
    id: 'dcf-valuation-model',
    name: 'Discounted Cash Flow (DCF) Valuation',
    category: 'Valuation',
    icon: '🧮',
    description: 'Calculates intrinsic fair value per share based on projected free cash flows, WACC discount rate, and Indian GDP growth.',
    inputsSchema: { freeCashFlow: 'Base FCF (₹ Cr)', waccRate: 'WACC Discount (%)', terminalGrowth: 'Terminal Growth (%)' },
    defaultParams: { freeCashFlow: 45000, waccRate: 11.0, terminalGrowth: 5.5 },
    compliance: 'agentskills.io'
  },
  {
    id: 'anti-slop-portfolio-audit',
    name: 'Anti-Slop Portfolio & Exposure Auditor',
    category: 'Automation',
    icon: '✨',
    description: 'Audits portfolio weights to eliminate redundant sector overlap across Indian equities.',
    inputsSchema: { maxWeightCap: 'Max Single Asset Cap (%)', sectorDiversification: 'Min Sectors' },
    defaultParams: { maxWeightCap: 20, sectorDiversification: 4 },
    compliance: 'agentskills.io'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'agent',
    title: 'Quant-X: Bullish Breakout on RELIANCE',
    message: 'RELIANCE 50 EMA has crossed above 200 EMA with volume expansion on NSE. Confidence 89%.',
    date: '10m ago',
    read: false,
    stockId: 'reliance',
  },
  {
    id: 'notif-2',
    type: 'trade',
    title: 'Paper Trade Executed',
    message: 'Bought 25 shares of TATAMOTORS at ₹1,042.80. Target set at ₹1,150.00.',
    date: '45m ago',
    read: false,
    stockId: 'tatamotors',
  },
  {
    id: 'notif-3',
    type: 'prediction',
    title: 'Consensus Target Updated: Nifty 50',
    message: 'Multi-Agent War Room raised consensus bull target for Reliance and Tata Motors.',
    date: '2h ago',
    read: true,
    stockId: 'reliance',
  }
];

export const mockUser: User = {
  id: 'user-1',
  name: 'Dalal Street Pro Trader',
  email: 'trader@lakshmiai.in',
  accountBalance: 1000000, // ₹10,00,000 (10 Lakhs INR)
  portfolioValue: 1248500.00,
  watchlist: ['reliance', 'tcs', 'tatamotors', 'sbin', 'zomato'],
  paperTrades: [
    {
      id: 'trade-1',
      stockId: 'reliance',
      stockSymbol: 'RELIANCE',
      stockName: 'Reliance Industries Ltd.',
      type: 'buy',
      price: 2890.00,
      quantity: 50,
      date: '2026-08-10',
      status: 'open',
      stopLoss: 2820.00,
      takeProfit: 3200.00,
      agentRationale: 'Multi-agent consensus STRONG BUY on 5G ARPU catalysts.'
    },
    {
      id: 'trade-2',
      stockId: 'tatamotors',
      stockSymbol: 'TATAMOTORS',
      stockName: 'Tata Motors Limited',
      type: 'buy',
      price: 980.00,
      quantity: 100,
      date: '2026-08-02',
      status: 'open',
      stopLoss: 940.00,
      takeProfit: 1150.00,
      agentRationale: 'Quant breakout with heavy institutional DII mutual fund inflows.'
    },
    {
      id: 'trade-3',
      stockId: 'infosys',
      stockSymbol: 'INFY',
      stockName: 'Infosys Limited',
      type: 'buy',
      price: 1920.00,
      quantity: 50,
      date: '2026-07-20',
      status: 'closed',
      closePrice: 1850.00,
      profitLoss: -3500.00,
      profitLossPercentage: -3.65,
      agentRationale: 'Stopped out at trailing limit as RiskSentinel flagged negative MACD cross.'
    }
  ]
};