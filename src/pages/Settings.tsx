import React from 'react';
import GlassCard from '../components/GlassCard';
import { AppSettings } from '../types/trust';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Download, Upload, Trash2, Bell, Moon, Percent } from 'lucide-react';

interface SettingsProps {
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onReset: () => void;
  onExport: () => void;
}

const Settings = ({ settings, onUpdateSettings, onReset, onExport }: SettingsProps) => {
  return (
    <div className="space-y-6 pb-20">
      <header>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-white/50">Configure your Trust Bank experience</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <p className="text-[10px] text-white/30">Passive trust growth for consistent good behavior.</p>
          </div>
        </GlassCard>

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
              className="w-full bg-white/5 hover:bg-white/10 border-white/10 text-white justify-start"
              onClick={() => alert('Import feature coming soon!')}
            >
              <Upload className="mr-2" size={18} /> Import Data
            </Button>

            <div className="pt-6">
              <Button 
                variant="destructive" 
                onClick={onReset}
                className="w-full bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-400 justify-start"
              >
                <Trash2 className="mr-2" size={18} /> Reset All Data
              </Button>
              <p className="text-[10px] text-red-400/50 mt-2 text-center">This action is permanent and cannot be undone.</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="text-center py-10">
        <div className="text-4xl mb-4">🏦</div>
        <h3 className="text-xl font-bold text-white">Trust Bank v1.0</h3>
        <p className="text-white/40 text-sm max-w-md mx-auto mt-2">
          Designed to help you build integrity, one honest conversation at a time. 
          Your data is stored locally on this device.
        </p>
      </GlassCard>
    </div>
  );
};

export default Settings;