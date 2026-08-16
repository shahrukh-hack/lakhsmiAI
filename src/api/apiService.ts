import { 
  mockStocks, 
  mockNotifications, 
  mockUser, 
  mockAgents, 
  mockTheses, 
  mockAdrs, 
  mockSkills 
} from './mockData';
import { 
  StockPrediction, 
  Notification, 
  PaperTrade, 
  FinancialAgent, 
  TradeThesisMemory, 
  ArchitectureDecision, 
  FinancialSkill 
} from '../types';
import { PublicMarketApi, PublicCryptoQuote, FxRate, MarketNewsItem } from './publicMarketApi';

const simulateDelay = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms));

export const StockService = {
  getAllStocks: async (): Promise<StockPrediction[]> => {
    await simulateDelay();
    return [...mockStocks];
  },
  
  getStockById: async (id: string): Promise<StockPrediction | undefined> => {
    await simulateDelay();
    return mockStocks.find(s => s.id === id || s.symbol.toLowerCase() === id.toLowerCase());
  },
  
  getWatchlistStocks: async (): Promise<StockPrediction[]> => {
    await simulateDelay();
    return mockStocks.filter(s => s.inWatchlist);
  },
  
  toggleWatchlist: async (id: string): Promise<StockPrediction[]> => {
    await simulateDelay(150);
    const stock = mockStocks.find(s => s.id === id);
    if (stock) {
      stock.inWatchlist = !stock.inWatchlist;
    }
    return [...mockStocks];
  },
  
  getPredictions: async (): Promise<StockPrediction[]> => {
    await simulateDelay();
    return [...mockStocks];
  },

  // Free Public APIs integration
  getLiveCrypto: async (): Promise<PublicCryptoQuote[]> => {
    return await PublicMarketApi.fetchLiveCrypto();
  },

  getLiveForex: async (base = 'USD'): Promise<FxRate> => {
    return await PublicMarketApi.fetchLiveForex(base);
  },

  getMarketNews: async (): Promise<MarketNewsItem[]> => {
    return await PublicMarketApi.fetchMarketNews();
  }
};

export const AgencyService = {
  getAgents: async (): Promise<FinancialAgent[]> => {
    await simulateDelay();
    return [...mockAgents];
  },

  runDeliberation: async (stockSymbol: string): Promise<{
    symbol: string;
    consensusVerdict: 'STRONG BUY' | 'ACCUMULATE' | 'HOLD' | 'TRIM' | 'EXIT';
    consensusConfidence: number;
    targetMean: number;
    messages: Array<{ agentName: string; avatar: string; role: string; text: string; verdict: string }>;
  }> => {
    await simulateDelay(800);
    const stock = mockStocks.find(s => s.symbol.toUpperCase() === stockSymbol.toUpperCase()) || mockStocks[0];
    
    return {
      symbol: stock.symbol,
      consensusVerdict: stock.prediction === 'bullish' ? 'STRONG BUY' : stock.prediction === 'bearish' ? 'TRIM' : 'HOLD',
      consensusConfidence: stock.confidence,
      targetMean: stock.targetPrice.base,
      messages: stock.agentDeliberation.map(d => ({
        agentName: d.agentName,
        avatar: d.avatar,
        role: d.role,
        text: d.reasoning,
        verdict: d.verdict
      }))
    };
  }
};

export const MemoryService = {
  getTheses: async (): Promise<TradeThesisMemory[]> => {
    await simulateDelay();
    return [...mockTheses];
  },

  addThesis: async (thesis: Omit<TradeThesisMemory, 'id' | 'dateCreated'>): Promise<TradeThesisMemory> => {
    await simulateDelay();
    const newThesis: TradeThesisMemory = {
      ...thesis,
      id: `thesis-${Date.now()}`,
      dateCreated: new Date().toISOString().split('T')[0]
    };
    mockTheses.unshift(newThesis);
    return newThesis;
  },

  getAdrs: async (): Promise<ArchitectureDecision[]> => {
    await simulateDelay();
    return [...mockAdrs];
  }
};

export const SkillsService = {
  getSkills: async (): Promise<FinancialSkill[]> => {
    await simulateDelay();
    return [...mockSkills];
  },

  executeSkill: async (skillId: string, params: Record<string, unknown>): Promise<{
    skillId: string;
    executionTimeMs: number;
    status: 'SUCCESS' | 'ERROR';
    output: Record<string, unknown>;
  }> => {
    await simulateDelay(600);
    const startTime = Date.now();

    if (skillId === 'rsi-macd-momentum-scanner') {
      const rsi = 62.4;
      return {
        skillId,
        executionTimeMs: Date.now() - startTime + 120,
        status: 'SUCCESS',
        output: {
          symbol: params.symbol || 'RELIANCE',
          rsiValue: rsi,
          rsiCondition: rsi > 70 ? 'OVERBOUGHT' : rsi < 30 ? 'OVERSOLD' : 'BULLISH_MOMENTUM',
          macdLine: 14.8,
          signalLine: 8.2,
          histogram: '+6.6 (Bullish Divergence)',
          recommendation: 'ACCUMULATE_ON_DIPS'
        }
      };
    }

    if (skillId === 'var-drawdown-stress-tester') {
      const capital = Number(params.portfolioCapital) || 100000;
      return {
        skillId,
        executionTimeMs: Date.now() - startTime + 210,
        status: 'SUCCESS',
        output: {
          testedPortfolioCapital: `$${capital.toLocaleString()}`,
          var95_1Day: `$${(capital * 0.018).toFixed(2)} (1.80%)`,
          var99_1Day: `$${(capital * 0.029).toFixed(2)} (2.90%)`,
          historicalMaxDrawdownStress: `-14.2% (Simulated 2020 Flash Crash)`,
          stressStatus: 'WITHIN_RISK_TOLERANCE_CAP'
        }
      };
    }

    if (skillId === 'sentiment-nlp-parser') {
      return {
        skillId,
        executionTimeMs: Date.now() - startTime + 90,
        status: 'SUCCESS',
        output: {
          polarityScore: 0.91,
          sentimentLabel: 'STRONGLY_BULLISH',
          entitiesDetected: ['Net Profit', 'Special Dividend', 'Margin Expansion'],
          institutionalImpact: 'HIGH_ACCUMULATION_SIGNAL'
        }
      };
    }

    return {
      skillId,
      executionTimeMs: Date.now() - startTime + 150,
      status: 'SUCCESS',
      output: {
        message: `Execution complete for ${skillId}`,
        paramsProvided: params,
        status: 'OPTIMAL'
      }
    };
  }
};

export const NotificationService = {
  getAllNotifications: async (): Promise<Notification[]> => {
    await simulateDelay();
    return [...mockNotifications];
  },
  
  getUnreadCount: async (): Promise<number> => {
    await simulateDelay();
    return mockNotifications.filter(n => !n.read).length;
  },
  
  markAsRead: async (id: string): Promise<Notification[]> => {
    await simulateDelay();
    const notif = mockNotifications.find(n => n.id === id);
    if (notif) notif.read = true;
    return [...mockNotifications];
  }
};

export const UserService = {
  getUserData: async () => {
    await simulateDelay();
    return { ...mockUser };
  },
  
  addPaperTrade: async (trade: Omit<PaperTrade, 'id' | 'date' | 'status'>): Promise<PaperTrade> => {
    await simulateDelay(200);
    const newTrade: PaperTrade = {
      ...trade,
      id: `trade-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'open',
    };
    mockUser.paperTrades.unshift(newTrade);
    return newTrade;
  },
  
  closePaperTrade: async (id: string, currentPrice: number): Promise<PaperTrade | undefined> => {
    await simulateDelay(200);
    const trade = mockUser.paperTrades.find(t => t.id === id);
    if (trade && trade.status === 'open') {
      trade.status = 'closed';
      trade.closePrice = currentPrice;
      const multiplier = trade.type === 'buy' ? 1 : -1;
      trade.profitLoss = (currentPrice - trade.price) * trade.quantity * multiplier;
      trade.profitLossPercentage = +(((currentPrice - trade.price) / trade.price) * 100 * multiplier).toFixed(2);
      mockUser.accountBalance += (trade.price * trade.quantity) + (trade.profitLoss || 0);
    }
    return trade;
  }
};