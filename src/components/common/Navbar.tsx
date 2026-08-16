import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { 
  TrendingUp, 
  Bot, 
  Brain, 
  Sparkles, 
  Briefcase, 
  Star, 
  Bell, 
  Search, 
  Volume2, 
  VolumeX, 
  Menu, 
  X,
  Zap,
  Database
} from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { ApiConfigModal } from './ApiConfigModal';
import { sound } from '../../lib/sound';

const Navbar: React.FC = () => {
  const { 
    unreadNotificationsCount, 
    notifications, 
    markNotificationAsRead, 
    isMuted, 
    toggleMute, 
    isBeginnerMode,
    toggleBeginnerMode,
    setIsCommandOpen,
    user 
  } = useAppContext();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: TrendingUp },
    { name: 'War Room', path: '/agency', icon: Bot, badge: '5 Agents' },
    { name: 'Screener', path: '/screener', icon: Sparkles },
    { name: 'Backtester', path: '/backtest', icon: Briefcase },
    { name: 'Watchlist', path: '/watchlist', icon: Star },
    { name: 'Paper Desk', path: '/paper-trading', icon: Briefcase },
    { name: 'Memory', path: '/memory', icon: Brain },
    { name: 'Skills Hub', path: '/skills', icon: Sparkles },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-card/85 backdrop-blur-xl border-b border-border transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              onClick={() => sound.playClick()} 
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary via-emerald-400 to-accent flex items-center justify-center text-primary-foreground shadow-tactile-sm group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 text-black fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-display font-bold text-lg text-foreground tracking-tight">
                  <span>Lakshmi</span>
                  <span className="text-primary">AI</span>
                </div>
                <div className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground font-semibold -mt-1">
                  Power Suite v2.0
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => sound.playClick()}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-primary/10 text-primary border border-primary/20 shadow-tactile-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-surface-subtle border border-transparent'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 bg-primary/20 text-primary rounded-full font-bold">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2.5">
            
            {/* Beginner vs Pro Mode Toggle Pill */}
            <button
              onClick={toggleBeginnerMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-tactile-sm ${
                isBeginnerMode
                  ? 'bg-bull/15 border-bull/40 text-bull hover:bg-bull/25'
                  : 'bg-primary/15 border-primary/40 text-primary hover:bg-primary/25'
              }`}
              title={isBeginnerMode ? 'Switch to Pro Mode (Advanced Quant Analytics)' : 'Switch to Beginner Mode (Clean & Simple)'}
            >
              <span className={`w-2 h-2 rounded-full ${isBeginnerMode ? 'bg-bull animate-pulse' : 'bg-primary'}`} />
              <span>{isBeginnerMode ? 'Beginner Mode' : 'Pro Mode'}</span>
            </button>

            {/* Quick Search trigger */}
            <button
              onClick={() => {
                sound.playClick();
                setIsCommandOpen(true);
              }}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all text-xs shadow-tactile-sm font-medium"
            >
              <Search className="w-3.5 h-3.5 text-primary" />
              <span>Search assets...</span>
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-card border border-border">⌘K</kbd>
            </button>

            {/* Audio sound toggle */}
            <button
              onClick={toggleMute}
              className={`p-2 rounded-lg border transition-all text-xs ${
                isMuted 
                  ? 'bg-surface-subtle text-muted-foreground border-border' 
                  : 'bg-card text-primary border-border hover:border-primary/40 shadow-tactile-sm'
              }`}
              title={isMuted ? 'Unmute Audio FX' : 'Mute Audio FX'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* API Config Data Sources Button */}
            <button
              onClick={() => {
                sound.playClick();
                setIsApiModalOpen(true);
              }}
              className="p-2 rounded-lg bg-card border border-border hover:border-primary/50 text-foreground transition-all flex items-center gap-1.5 shadow-tactile-sm text-xs font-medium"
              title="Configure Real-World Data APIs"
            >
              <Database className="w-4 h-4 text-primary" />
              <span className="hidden md:inline">Data APIs</span>
            </button>

            {/* Design Theme Switcher */}
            <ThemeSwitcher />

            {/* Notifications Popover */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  sound.playClick();
                  setNotifOpen(prev => !prev);
                }}
                className="relative p-2 rounded-lg bg-card border border-border hover:border-primary/50 text-foreground transition-all shadow-tactile-sm"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-muted-foreground" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground font-mono text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-card border border-border shadow-tactile-lg z-50 p-3 animate-in fade-in zoom-in-95 backdrop-blur-xl">
                  <div className="flex items-center justify-between pb-2 border-b border-border/60 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                      Live AI Alerts ({unreadNotificationsCount})
                    </span>
                    <span className="text-[11px] text-primary cursor-pointer hover:underline">
                      Mark all read
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <div className="py-4 text-center text-xs text-muted-foreground">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-2.5 rounded-xl cursor-pointer transition-all text-xs border ${
                            !n.read 
                              ? 'bg-primary/5 border-primary/20 text-foreground' 
                              : 'bg-surface-subtle/50 border-border/40 text-muted-foreground'
                          }`}
                        >
                          <div className="font-semibold text-foreground flex items-center justify-between">
                            <span>{n.title}</span>
                            <span className="text-[10px] font-mono text-muted-foreground">{n.date}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Paper Trading Balance Chip */}
            {user && (
              <Link
                to="/paper-trading"
                onClick={() => sound.playClick()}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-subtle border border-border hover:border-primary/50 transition-all text-xs shadow-tactile-sm"
              >
                <div className="w-2 h-2 rounded-full bg-bull animate-pulse" />
                <span className="text-muted-foreground font-medium">Paper Fund:</span>
                <span className="font-num font-bold text-foreground">
                  ₹{(user.accountBalance).toLocaleString()}
                </span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="lg:hidden p-2 rounded-lg bg-surface-subtle border border-border text-foreground"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card p-4 space-y-2 animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => {
                  sound.playClick();
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:bg-surface-subtle'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-primary/20 text-primary rounded-full font-bold">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {/* Real-World API Config Modal */}
      <ApiConfigModal isOpen={isApiModalOpen} onClose={() => setIsApiModalOpen(false)} />
    </nav>
  );
};

export default Navbar;