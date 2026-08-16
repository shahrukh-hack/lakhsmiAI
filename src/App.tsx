import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Navbar from './components/common/Navbar';
import { CommandPalette } from './components/common/CommandPalette';
import { CopilotDrawer } from './components/common/CopilotDrawer';
import Dashboard from './pages/Dashboard';
import AgencyWarRoom from './pages/AgencyWarRoom';
import Watchlist from './pages/Watchlist';
import StockDetail from './pages/StockDetail';
import PaperTrading from './pages/PaperTrading';
import FinancialMemory from './pages/FinancialMemory';
import SkillsHub from './pages/SkillsHub';
import StrategyBacktester from './pages/StrategyBacktester';
import MarketScreener from './pages/MarketScreener';

function App() {
  return (
    <Router>
      <AppProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-200">
          <Navbar />
          <CommandPalette />
          <CopilotDrawer />
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/agency" element={<AgencyWarRoom />} />
              <Route path="/screener" element={<MarketScreener />} />
              <Route path="/backtest" element={<StrategyBacktester />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/stock/:id" element={<StockDetail />} />
              <Route path="/paper-trading" element={<PaperTrading />} />
              <Route path="/memory" element={<FinancialMemory />} />
              <Route path="/skills" element={<SkillsHub />} />
            </Routes>
          </main>

          {/* Platform Footer */}
          <footer className="border-t border-border bg-card/40 backdrop-blur-md py-6 text-xs text-muted-foreground">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground font-display">Lakshmi AI</span>
                <span>• Autonomous Financial Intelligence Suite v2.0</span>
              </div>
              <div className="flex items-center gap-4 font-mono text-[11px]">
                <span>vibe-superkit</span>
                <span>vibe-agency</span>
                <span>vibe-memory</span>
                <span>vibe-skills</span>
                <span>public-apis</span>
              </div>
              <div>
                Created with intention by <a href="https://github.com/shahrukh-hack" target="_blank" rel="noreferrer" className="text-primary hover:underline font-semibold">@shahrukh-hack</a>
              </div>
            </div>
          </footer>

          <Toaster 
            position="top-right" 
            toastOptions={{ 
              duration: 3000,
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
                fontSize: '12px',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
              }
            }} 
          />
        </div>
      </AppProvider>
    </Router>
  );
}

export default App;