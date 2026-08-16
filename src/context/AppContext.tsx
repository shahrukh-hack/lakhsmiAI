import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StockPrediction, Notification, User, PaperTrade } from '../types';
import { StockService, NotificationService, UserService } from '../api/apiService';
import { IndianMarketIndex, FxRate, MarketNewsItem, PublicMarketApi } from '../api/publicMarketApi';
import { sound } from '../lib/sound';
import toast from 'react-hot-toast';

export type ThemeName = 'theme-luxe' | 'theme-cyber' | 'theme-oled' | 'theme-swiss' | 'theme-editorial';

interface AppContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  isMuted: boolean;
  toggleMute: () => void;
  isBeginnerMode: boolean;
  toggleBeginnerMode: () => void;
  stocks: StockPrediction[];
  watchlistStocks: StockPrediction[];
  indianIndices: IndianMarketIndex[];
  forexRates: FxRate | null;
  marketNews: MarketNewsItem[];
  notifications: Notification[];
  unreadNotificationsCount: number;
  user: User | null;
  loading: boolean;
  isCommandOpen: boolean;
  setIsCommandOpen: (open: boolean) => void;
  toggleWatchlist: (id: string) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  addPaperTrade: (trade: Omit<PaperTrade, 'id' | 'date' | 'status'>) => Promise<void>;
  closePaperTrade: (id: string, currentPrice: number) => Promise<void>;
  refreshMarketData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeName>('theme-luxe');
  const [isMuted, setIsMuted] = useState(false);
  const [isBeginnerMode, setIsBeginnerMode] = useState(true); // Default to simple beginner-friendly mode
  const [stocks, setStocks] = useState<StockPrediction[]>([]);
  const [watchlistStocks, setWatchlistStocks] = useState<StockPrediction[]>([]);
  const [indianIndices, setIndianIndices] = useState<IndianMarketIndex[]>([]);
  const [forexRates, setForexRates] = useState<FxRate | null>(null);
  const [marketNews, setMarketNews] = useState<MarketNewsItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // Initialize theme, sound, and mode preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('lakshmi_theme') as ThemeName;
    if (savedTheme) {
      setThemeState(savedTheme);
      document.documentElement.className = savedTheme;
    } else {
      document.documentElement.className = 'theme-luxe';
    }

    const savedMode = localStorage.getItem('lakshmi_beginner_mode');
    if (savedMode !== null) {
      setIsBeginnerMode(savedMode === 'true');
    }

    setIsMuted(sound.getMuted());
  }, []);

  const toggleBeginnerMode = () => {
    const next = !isBeginnerMode;
    setIsBeginnerMode(next);
    localStorage.setItem('lakshmi_beginner_mode', next ? 'true' : 'false');
    sound.playClick();
    if (next) {
      toast.success('Switched to Beginner Mode — Clean & Simple! 🟢');
    } else {
      toast.success('Switched to Pro Mode — Full Quant Analytics! ⚡');
    }
  };

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    localStorage.setItem('lakshmi_theme', newTheme);
    document.documentElement.className = newTheme;
    sound.playClick();
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
    if (!next) sound.playClick();
  };

  // Keyboard shortcut for Command Palette (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const refreshMarketData = async () => {
    try {
      const [stocksData, indicesData, fxData, newsData] = await Promise.all([
        StockService.getAllStocks(),
        PublicMarketApi.fetchIndianIndices(),
        StockService.getLiveForex(),
        StockService.getMarketNews(),
      ]);
      setStocks(stocksData);
      setIndianIndices(indicesData);
      setForexRates(fxData);
      setMarketNews(newsData);
    } catch {
      // ignore
    }
  };

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [
          stocksData,
          watchlistData,
          indicesData,
          fxData,
          newsData,
          notificationsData,
          unreadCount,
          userData
        ] = await Promise.all([
          StockService.getAllStocks(),
          StockService.getWatchlistStocks(),
          PublicMarketApi.fetchIndianIndices(),
          StockService.getLiveForex(),
          StockService.getMarketNews(),
          NotificationService.getAllNotifications(),
          NotificationService.getUnreadCount(),
          UserService.getUserData()
        ]);
        
        setStocks(stocksData);
        setWatchlistStocks(watchlistData);
        setIndianIndices(indicesData);
        setForexRates(fxData);
        setMarketNews(newsData);
        setNotifications(notificationsData);
        setUnreadNotificationsCount(unreadCount);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast.error('Failed to load NSE/BSE market data.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    // 10-second live NSE tick simulation
    const interval = setInterval(() => {
      setStocks(prev => prev.map(s => {
        const delta = (Math.random() - 0.49) * (s.price * 0.0015);
        return {
          ...s,
          price: +(s.price + delta).toFixed(2),
          change: +(s.change + (delta > 0 ? 0.02 : -0.02)).toFixed(2)
        };
      }));

      PublicMarketApi.fetchIndianIndices().then(data => setIndianIndices(data));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Toggle watchlist status
  const toggleWatchlist = async (id: string) => {
    sound.playClick();
    try {
      const updatedStocks = await StockService.toggleWatchlist(id);
      setStocks(updatedStocks);
      
      const updatedWatchlist = await StockService.getWatchlistStocks();
      setWatchlistStocks(updatedWatchlist);
      
      const targetStock = updatedStocks.find(s => s.id === id);
      if (targetStock?.inWatchlist) {
        toast.success(`Added ${targetStock.symbol} to watchlist`);
      } else {
        toast.success(`Removed ${targetStock?.symbol || 'asset'} from watchlist`);
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error);
      toast.error('Failed to update watchlist.');
    }
  };

  // Mark notification as read
  const markNotificationAsRead = async (id: string) => {
    sound.playClick();
    try {
      const updatedNotifications = await NotificationService.markAsRead(id);
      setNotifications(updatedNotifications);
      const unreadCount = await NotificationService.getUnreadCount();
      setUnreadNotificationsCount(unreadCount);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Add paper trade
  const addPaperTrade = async (trade: Omit<PaperTrade, 'id' | 'date' | 'status'>) => {
    try {
      const newTrade = await UserService.addPaperTrade(trade);
      if (user) {
        setUser({
          ...user,
          accountBalance: user.accountBalance - (trade.price * trade.quantity),
          paperTrades: [newTrade, ...user.paperTrades]
        });
      }
      sound.playTradeSuccess();
      toast.success(`${trade.type.toUpperCase()} Order Executed: ${trade.quantity} ${trade.stockSymbol} @ ₹${trade.price}`);
    } catch (error) {
      console.error('Error adding paper trade:', error);
      toast.error('Failed to execute order.');
    }
  };

  // Close paper trade
  const closePaperTrade = async (id: string, currentPrice: number) => {
    try {
      const updatedTrade = await UserService.closePaperTrade(id, currentPrice);
      if (updatedTrade && user) {
        setUser({
          ...user,
          accountBalance: user.accountBalance + (updatedTrade.price * updatedTrade.quantity) + (updatedTrade.profitLoss || 0),
          paperTrades: user.paperTrades.map(trade => 
            trade.id === id ? updatedTrade : trade
          )
        });
        
        sound.playTradeSuccess();
        const pnl = updatedTrade.profitLoss || 0;
        if (pnl >= 0) {
          toast.success(`Position Closed: +₹${pnl.toFixed(2)} Profit! 🚀`);
        } else {
          toast.error(`Position Closed: -₹${Math.abs(pnl).toFixed(2)} Loss`);
        }
      }
    } catch (error) {
      console.error('Error closing paper trade:', error);
      toast.error('Failed to close trade.');
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        isMuted,
        toggleMute,
        isBeginnerMode,
        toggleBeginnerMode,
        stocks,
        watchlistStocks,
        indianIndices,
        forexRates,
        marketNews,
        notifications,
        unreadNotificationsCount,
        user,
        loading,
        isCommandOpen,
        setIsCommandOpen,
        toggleWatchlist,
        markNotificationAsRead,
        addPaperTrade,
        closePaperTrade,
        refreshMarketData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};