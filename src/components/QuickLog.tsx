import React, { useState } from 'react';
import { TrustAccount, TransactionType } from '../types/trust';
import GlassCard from './GlassCard';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  XCircle, 
  Music, 
  BookOpen, 
  Heart, 
  AlertCircle, 
  Zap,
  ChevronRight,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickLogProps {
  accounts: TrustAccount[];
  onLog: (accountId: string, text: string) => void;
}

const QUICK_ACTIONS = [
  { label: 'Told the Truth', icon: CheckCircle2, text: 'I told the truth about something hard.', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { label: 'Practiced Piano', icon: Music, text: 'I finished my piano practice session.', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'Did Homework', icon: BookOpen, text: 'I completed my homework on time.', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { label: 'Helped Out', icon: Heart, text: 'I helped without being asked.', color: 'text-pink-500', bg: 'bg-pink-500/10' },
  { label: 'Was Dishonest', icon: XCircle, text: 'I was dishonest about a small detail.', color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { label: 'Procrastinated', icon: AlertCircle, text: 'I put off my responsibilities until later.', color: 'text-amber-500', bg: 'bg-amber-500/10' },
];

const QuickLog = ({ accounts, onLog }: QuickLogProps) => {
  const [selectedAccount, setSelectedAccount] = useState<string>(accounts[0]?.id || '');

  return (
    <div className="space-y-6">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {accounts.map((acc) => (
          <button
            key={acc.id}
            onClick={() => setSelectedAccount(acc.id)}
            className={cn(
              "flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all",
              selectedAccount === acc.id 
                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                : "bg-white/5 border-white/10 text-foreground/60 hover:bg-white/10"
            )}
          >
            <span className="text-lg">{acc.emoji}</span>
            <span className="text-xs font-bold">{acc.person}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={() => onLog(selectedAccount, action.text)}
              className="group flex flex-col items-center justify-center p-4 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all active:scale-95"
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110", action.bg, action.color)}>
                <Icon size={24} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-center">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickLog;