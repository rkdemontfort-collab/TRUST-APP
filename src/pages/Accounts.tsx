import React, { useState, useMemo } from 'react';
import GlassCard from '../components/GlassCard';
import { TrustAccount, Transaction } from '../types/trust';
import TrustBadge from '../components/TrustBadge';
import ChatInterface from '../components/ChatInterface';
import { ArrowLeft, Search, Star, AlertTriangle, Info, MoreHorizontal, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface AccountsProps {
  accounts: TrustAccount[];
  messages: Record<string, any[]>;
  onSendMessage: (accountId: string, text: string) => void;
  onUpdateGoal: (accountId: string, goal: number) => void;
  onToggleFavorite: (accountId: string, transactionId: string) => void;
}

const Accounts = ({ accounts, messages, onSendMessage, onUpdateGoal, onToggleFavorite }: AccountsProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedAccount = accounts.find(a => a.id === selectedId);

  const filteredTransactions = useMemo(() => {
    if (!selectedAccount) return [];
    return selectedAccount.transactions.filter(t => 
      t.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.explanation.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [selectedAccount, searchQuery]);

  // Trello-style grouping
  const columns = [
    { title: 'High Trust', min: 750, max: 1000, color: 'text-emerald-400' },
    { title: 'Stable', min: 650, max: 749, color: 'text-sky-400' },
    { title: 'Needs Work', min: 500, max: 649, color: 'text-amber-400' },
    { title: 'Critical', min: 0, max: 499, color: 'text-rose-400' },
  ];

  if (selectedAccount) {
    const isLowBalance = selectedAccount.balance < 500;

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6 pb-20"
      >
        <Button 
          variant="ghost" 
          onClick={() => setSelectedId(null)}
          className="ios-button rounded-full text-foreground/60 hover:text-foreground"
        >
          <ArrowLeft className="mr-2" size={18} /> Back to Board
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <GlassCard className="text-center p-10">
              <div className="text-7xl mb-6 drop-shadow-2xl">{selectedAccount.emoji}</div>
              <h2 className="text-3xl font-black tracking-tight text-foreground">{selectedAccount.person}</h2>
              <div className="mt-3">
                <TrustBadge balance={selectedAccount.balance} className="text-xs px-4 py-1" />
              </div>
              
              <div className="mt-10 grid grid-cols-2 gap-4">
                <div className="bg-white/10 dark:bg-white/5 rounded-[2rem] p-5 border border-white/10">
                  <div className="text-[10px] text-foreground/40 uppercase font-black tracking-widest mb-1">Balance</div>
                  <div className={cn("text-2xl font-black", isLowBalance ? "text-rose-500" : "text-foreground")}>
                    {selectedAccount.balance}
                  </div>
                </div>
                <div className="bg-white/10 dark:bg-white/5 rounded-[2rem] p-5 border border-white/10">
                  <div className="text-[10px] text-foreground/40 uppercase font-black tracking-widest mb-1">Lies</div>
                  <div className="text-2xl font-black text-rose-500">{selectedAccount.lieCount}</div>
                </div>
              </div>

              <div className="mt-8 text-left space-y-6">
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-2">
                    <span>Goal Progress</span>
                    <span>{selectedAccount.goal}</span>
                  </div>
                  <Progress value={(selectedAccount.balance / selectedAccount.goal) * 100} className="h-2.5 bg-white/10" />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="flex flex-col h-[500px] p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black tracking-tight">Activity Log</h3>
                <div className="relative w-32">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/20" size={14} />
                  <Input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter..."
                    className="h-8 pl-9 text-xs bg-white/5 border-white/10 rounded-full"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-hide">
                {filteredTransactions.map(t => (
                  <div key={t.id} className="p-4 rounded-[1.5rem] bg-white/10 dark:bg-white/5 border border-white/10 group relative hover:bg-white/20 transition-colors">
                    <button 
                      onClick={() => onToggleFavorite(selectedAccount.id, t.id)}
                      className={cn(
                        "absolute top-4 right-4 transition-colors",
                        t.isFavorite ? "text-amber-400" : "text-foreground/10 group-hover:text-foreground/30"
                      )}
                    >
                      <Star size={16} fill={t.isFavorite ? "currentColor" : "none"} />
                    </button>
                    <div className="flex justify-between items-start mb-2 pr-8">
                      <span className="text-sm font-bold">{t.action}</span>
                      <span className={cn("text-xs font-black", t.type === 'DEPOSIT' ? 'text-emerald-500' : 'text-rose-500')}>
                        {t.type === 'DEPOSIT' ? '+' : '-'}{t.amount}
                      </span>
                    </div>
                    <p className="text-xs text-foreground/50 leading-relaxed mb-3">{t.explanation}</p>
                    <div className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest">{format(new Date(t.timestamp), 'MMM d, HH:mm')}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-2">
            <GlassCard className="p-0 overflow-hidden h-full border-none shadow-2xl">
              <div className="p-6 border-b border-white/10 bg-white/10 flex items-center justify-between">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm">
                    {selectedAccount.emoji}
                  </div>
                  Assistant for {selectedAccount.person}
                </h3>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreHorizontal size={20} />
                </Button>
              </div>
              <ChatInterface 
                account={selectedAccount}
                messages={messages[selectedAccount.id] || []}
                onSendMessage={(text) => onSendMessage(selectedAccount.id, text)}
              />
            </GlassCard>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black tracking-tighter">Board</h1>
          <p className="text-lg text-foreground/50 font-medium">Manage your trust portfolio</p>
        </div>
        <Button className="ios-button rounded-full px-6 h-12 font-bold gap-2">
          <Plus size={20} />
          New Account
        </Button>
      </header>

      <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide -mx-6 px-6">
        {columns.map(col => {
          const colAccounts = accounts.filter(a => a.balance >= col.min && a.balance <= col.max);
          return (
            <div key={col.title} className="flex-shrink-0 w-80 space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className={cn("text-sm font-black uppercase tracking-[0.2em]", col.color)}>
                  {col.title} <span className="ml-2 opacity-30">{colAccounts.length}</span>
                </h3>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-30 hover:opacity-100">
                  <MoreHorizontal size={16} />
                </Button>
              </div>
              
              <div className="space-y-4">
                {colAccounts.map(acc => (
                  <GlassCard 
                    key={acc.id} 
                    hover 
                    onClick={() => setSelectedId(acc.id)}
                    className="p-5 rounded-[2rem] border-white/20 hover:border-white/40"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{acc.emoji}</div>
                      <TrustBadge balance={acc.balance} />
                    </div>
                    <h4 className="text-xl font-black tracking-tight mb-1">{acc.person}</h4>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-4">
                      <Star size={10} className={acc.lieCount === 0 ? "text-amber-400" : ""} />
                      {acc.lieCount === 0 ? 'Perfect Record' : `${acc.lieCount} Incidents`}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black text-foreground/40">
                        <span>{acc.balance} pts</span>
                        <span>{Math.round((acc.balance / acc.goal) * 100)}%</span>
                      </div>
                      <Progress value={(acc.balance / acc.goal) * 100} className="h-1.5 bg-white/10" />
                    </div>
                  </GlassCard>
                ))}
                {colAccounts.length === 0 && (
                  <div className="h-32 rounded-[2rem] border-2 border-dashed border-white/10 flex items-center justify-center text-foreground/20 text-xs font-bold uppercase tracking-widest">
                    Empty
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Accounts;