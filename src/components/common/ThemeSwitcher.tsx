import React, { useState, useRef, useEffect } from 'react';
import { useAppContext, ThemeName } from '../../context/AppContext';
import { Palette, Check } from 'lucide-react';
import { sound } from '../../lib/sound';

const THEMES: Array<{ id: ThemeName; name: string; desc: string; previewColor: string }> = [
  { id: 'theme-luxe', name: 'Tactile Obsidian', desc: 'Deep Charcoal & Emerald Alpha', previewColor: '#10B981' },
  { id: 'theme-cyber', name: 'Kinetic Cyber', desc: 'Forest Slate & Neon Green', previewColor: '#22C55E' },
  { id: 'theme-oled', name: 'True OLED Black', desc: 'Pure Black & Gold Accents', previewColor: '#F7C948' },
  { id: 'theme-swiss', name: 'Swiss Precision', desc: 'Minimalist Light & Cobalt Blue', previewColor: '#2563EB' },
  { id: 'theme-editorial', name: 'Editorial Warm', desc: 'Warm Cream & Terracotta', previewColor: '#CE5A1B' },
];

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          sound.playClick();
          setIsOpen(prev => !prev);
        }}
        className="p-2 rounded-lg bg-card/80 border border-border hover:border-primary/50 text-foreground transition-all flex items-center gap-1.5 shadow-tactile-sm text-xs font-medium"
        title="Switch Design Theme"
      >
        <Palette className="w-4 h-4 text-primary" />
        <span className="hidden sm:inline">Theme</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 p-2 rounded-xl bg-card border border-border shadow-tactile-lg z-50 animate-in fade-in zoom-in-95 backdrop-blur-xl">
          <div className="text-xs font-bold text-muted-foreground uppercase px-2 py-1 tracking-wider border-b border-border/50 mb-1">
            Design Aesthetic
          </div>
          <div className="space-y-1">
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all text-xs ${
                  theme === t.id
                    ? 'bg-primary/10 text-primary font-bold border border-primary/20'
                    : 'text-foreground hover:bg-surface-subtle border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: t.previewColor }}
                  />
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-[10px] text-muted-foreground">{t.desc}</div>
                  </div>
                </div>
                {theme === t.id && <Check className="w-3.5 h-3.5 text-primary" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
