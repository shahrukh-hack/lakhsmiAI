import React from 'react';
import { useAppContext } from '../context/AppContext';
import StockCard from '../components/common/StockCard';
import { useNavigate } from 'react-router-dom';
import { Star, PlusCircle, Sparkles } from 'lucide-react';
import { sound } from '../lib/sound';

export const Watchlist: React.FC = () => {
  const { watchlistStocks, toggleWatchlist, loading } = useAppContext();
  const navigate = useNavigate();

  const handleStockClick = (id: string) => {
    navigate(`/stock/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-border shadow-tactile-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-tactile-sm">
            <Star className="w-8 h-8 fill-current" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Curated Asset Watchlist
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Live tracking and AI target alerts for your preferred equities & digital assets
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            navigate('/');
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-tactile-sm hover:brightness-110 active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Discover More Assets</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {watchlistStocks.length === 0 ? (
            <div className="rounded-2xl bg-card border border-border p-16 text-center shadow-tactile-sm space-y-4">
              <div className="w-16 h-16 rounded-full bg-surface-subtle flex items-center justify-center text-muted-foreground mx-auto">
                <Star className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Your watchlist is currently empty</h2>
              <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                Star assets from the Dashboard or Market Heatmap to track their multi-agent consensus ratings and live price movements.
              </p>
              <button
                onClick={() => {
                  sound.playClick();
                  navigate('/');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl shadow-tactile-sm hover:brightness-110 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Explore Market Dashboard</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {watchlistStocks.map((stock) => (
                <StockCard 
                  key={stock.id} 
                  stock={stock} 
                  onToggleWatchlist={toggleWatchlist}
                  onClick={handleStockClick}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Watchlist;