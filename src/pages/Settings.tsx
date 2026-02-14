import React from 'react';
import GlassCard from '../components/GlassCard';
import { AppSettings, AIStrictness } from '../types/trust';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Download, Upload, Trash2, Bell, Moon, Percent, Brain, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsProps {
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onReset: () => void;
  onExport: () => void;
}

const Settings = ({ settings, onUpdateSettings, onReset, onExport }: SettingsProps) => {
  const strictnessLevels: { id: AIStrictness; label: string; desc: string; color: string }[] = [
    { id: 'LENIENT', label: 'Lenient', desc: 'Forgiving AI. Small penalties.', color: 'text-green-400' },
    { id: 'BALANCED', label: 'Balanced', desc: 'Fair and consistent judgment.', color: 'text-blue-400' },
    { id: 'STRICT', label: 'Strict', desc: 'High standards. No excuses.', color: 'text-orange-400' },
    { id: 'SAVAGE', label: 'Savage', desc: 'Brutal honesty. Massive penalties.', color: 'text-red-400' },
  ];

  return (
    <div className="space-y-6 pb-20">
      <header>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-white/50">Configure your Trust Bank experience</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="space-y-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Brain className="text-purple-400" size={20} />
            AI Personality
          </h3>
          
          <div className="space-y-4">
            <Label className="text-white/60 text-xs uppercase tracking-widest">Judgment Strictness</Label>
            <div className="grid grid-cols-1 gap-2">
              {strictnessLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => onUpdateSettings({ strictness: level.id })}
                  className={cn(
                    "flex flex-col items-start p-3 rounded-xl border transition-all text-left",
                    settings.strictness === level.id 
                      ? "bg-purple-500/10 border-purple-500/50" 
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  )}
                >
                  <div className="flex justify-between w-full items-center">
                    <span className={cn("font-bold", level.color)}>{level.label}</span>
                    {settings.strictness === level.id && <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />}
                  </div>
                  <span className="text-[10px] text-white/40 mt-1">{level.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </GlassCard>

        <GlassCard className="space-y-6">
          <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white flex items-center gap-2">
                <Moon size={16} className="text-blue-400" /> Dark Mode
              </Label>
              <p className="text-xs text-white/40">Always active in this version</p>
            </div>
            <Switch checked={settings.darkMode} disabled />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white flex items-center gap-2">
                <Bell size={16} className="text-yellow-400" /> Notifications
              </Label>
              <p className="text-xs text-white/40">Daily check-in reminders</p>
            </div>
            <Switch 
              checked={settings.notifications} 
              onCheckedChange={(val) => onUpdateSettings({ notifications: val })}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-white flex items-center gap-2">
              <Percent size={16} className="text-purple-400" /> Interest Rate Modifier
            </Label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="0" 
                max="0.05" 
                step="0.005"
                value={settings.interestRate}
                onChange={(e) => onUpdateSettings({ interestRate: parseFloat(e.target.value) })}
                className="flex-1 accent-purple-500"
              />
              <span className="text-white font-mono">{(settings.interestRate * 100).toFixed(1)}%</span>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="space-y-6">
          <h3 className="text-lg font-semibold text-white mb-4">Data Management</h3>
          <div className="space-y-3">
            <Button 
              onClick={onExport}
              className="w-full bg-white/5 hover:bg-white/10 border-white/10 text-white justify-start"
            >
              <Download className="mr-2" size={18} /> Export Data (JSON)
            </Button>
            <Button 
              variant="destructive" 
              onClick={onReset}
              className="w-full bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-400 justify-start"
            >
              <Trash2 className="mr-2" size={18} /> Reset All Data
            </Button>
          </div>
        </GlassCard>

        <GlassCard className="bg-purple-600/10 border-purple-500/20 flex flex-col items-center justify-center text-center py-10">
          <ShieldAlert className="text-purple-400 mb-4" size={48} />
          <h3 className="text-xl font-bold text-white">Trust Protocol v1.2</h3>
          <p className="text-white/40 text-sm max-w-xs mt-2">
            Your integrity is being monitored by the active judgment engine. 
            Choose your strictness wisely.
          </p>
        </GlassCard>
      </div>
    </div>
  );
};

export default Settings;