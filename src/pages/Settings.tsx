import React from 'react';
import GlassCard from '../components/GlassCard';
import { AppSettings, AIStrictness } from '../types/trust';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTheme } from 'next-themes';
import { Download, Trash2, Bell, Moon, Sun, Percent, Brain, ShieldAlert, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsProps {
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onReset: () => void;
  onExport: () => void;
}

const Settings = ({ settings, onUpdateSettings, onReset, onExport }: SettingsProps) => {
  const { theme, setTheme } = useTheme();

  const strictnessLevels: { id: AIStrictness; label: string; desc: string; color: string }[] = [
    { id: 'LENIENT', label: 'Lenient', desc: 'Forgiving AI. Small penalties.', color: 'text-green-500' },
    { id: 'BALANCED', label: 'Balanced', desc: 'Fair and consistent judgment.', color: 'text-blue-500' },
    { id: 'STRICT', label: 'Strict', desc: 'High standards. No excuses.', color: 'text-orange-500' },
    { id: 'SAVAGE', label: 'Savage', desc: 'Brutal honesty. Massive penalties.', color: 'text-red-500' },
  ];

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h1 className="text-4xl font-black tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Personalize your Trust Bank experience</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="space-y-8">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Palette className="text-primary" size={24} />
            Appearance
          </h3>
          
          <div className="flex items-center justify-between p-4 rounded-3xl bg-muted/50">
            <div className="space-y-1">
              <Label className="text-base font-bold flex items-center gap-2">
                {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                Theme Mode
              </Label>
              <p className="text-xs text-muted-foreground">Switch between light and dark</p>
            </div>
            <div className="flex bg-muted p-1 rounded-2xl">
              <button 
                onClick={() => setTheme('light')}
                className={cn("px-4 py-2 rounded-xl text-xs font-bold transition-all", theme === 'light' ? "bg-background shadow-sm" : "opacity-50")}
              >
                Light
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={cn("px-4 py-2 rounded-xl text-xs font-bold transition-all", theme === 'dark' ? "bg-background shadow-sm" : "opacity-50")}
              >
                Dark
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-xs font-black uppercase tracking-widest opacity-40">AI Personality</Label>
            <div className="grid grid-cols-1 gap-3">
              {strictnessLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => onUpdateSettings({ strictness: level.id })}
                  className={cn(
                    "flex flex-col items-start p-4 rounded-3xl border-2 transition-all text-left",
                    settings.strictness === level.id 
                      ? "bg-primary/5 border-primary" 
                      : "bg-muted/30 border-transparent hover:bg-muted/50"
                  )}
                >
                  <div className="flex justify-between w-full items-center">
                    <span className={cn("font-black text-lg", level.color)}>{level.label}</span>
                    {settings.strictness === level.id && <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">{level.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard className="space-y-6">
            <h3 className="text-xl font-bold">Preferences</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-bold flex items-center gap-2">
                  <Bell size={18} className="text-yellow-500" /> Notifications
                </Label>
                <p className="text-xs text-muted-foreground">Daily check-in reminders</p>
              </div>
              <Switch 
                checked={settings.notifications} 
                onCheckedChange={(val) => onUpdateSettings({ notifications: val })}
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <Label className="text-base font-bold flex items-center gap-2">
                <Percent size={18} className="text-primary" /> Interest Rate Modifier
              </Label>
              <div className="flex items-center gap-6">
                <input 
                  type="range" 
                  min="0" 
                  max="0.05" 
                  step="0.005"
                  value={settings.interestRate}
                  onChange={(e) => onUpdateSettings({ interestRate: parseFloat(e.target.value) })}
                  className="flex-1 accent-primary h-2 rounded-lg appearance-none bg-muted"
                />
                <span className="text-lg font-black min-w-[3rem]">{(settings.interestRate * 100).toFixed(1)}%</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="space-y-4">
            <h3 className="text-xl font-bold">Data Management</h3>
            <div className="grid grid-cols-1 gap-3">
              <Button 
                onClick={onExport}
                className="w-full h-14 rounded-2xl bg-muted hover:bg-muted/80 text-foreground font-bold justify-start px-6"
              >
                <Download className="mr-3" size={20} /> Export Data (JSON)
              </Button>
              <Button 
                variant="destructive" 
                onClick={onReset}
                className="w-full h-14 rounded-2xl font-bold justify-start px-6"
              >
                <Trash2 className="mr-3" size={20} /> Reset All Data
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>

      <GlassCard className="bg-primary/5 border-primary/20 flex flex-col items-center justify-center text-center py-12">
        <ShieldAlert className="text-primary mb-4" size={64} />
        <h3 className="text-2xl font-black">Trust Protocol v2.0</h3>
        <p className="text-muted-foreground text-sm max-w-md mt-2">
          Your integrity is being monitored by the active judgment engine. 
          Choose your strictness wisely. Every action is recorded.
        </p>
      </GlassCard>
    </div>
  );
};

export default Settings;