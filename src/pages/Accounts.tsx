import React, { useState, useMemo } from 'react';
import GlassCard from '../components/GlassCard';
import { TrustAccount, Transaction } from '../types/trust';
import TrustBadge from '../components/TrustBadge';
import ChatInterface from '../components/ChatInterface';
import { ArrowLeft, Search, Star, AlertTriangle, Info } from 'lucide-react';
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
          className="text-white/60 hover:text-white hover:bg-white/5"
        >
          <ArrowLeft className="mr-2" size={18} /> Back to Accounts
        </Button>

        {isLowBalance && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 flex items-center gap-4 text-red-200"
          >
            <AlertTriangle className="text-red-400 animate-pulse" size={24} />
            <div>
              <p className="font-bold">Critical Trust Level</p>
              <p className="text-sm opacity-80">Your balance with {selectedAccount.person} is dangerously low. Focus on honesty and consistency.</p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <GlassCard className="text-center">
              <div className="text-6xl mb-4">{selectedAccount.emoji}</div>
              <h2 className="text-2xl font-bold text-white">{selectedAccount.person}</h2>
              <div className="mt-2">
                <TrustBadge balance={selectedAccount.balance} />
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-xs text-white/30 uppercase">Balance</div>
                  <div className={cn("text-xl font-bold", isLowBalance ? "text-red-400" : "text-white")}>
                    {selectedAccount.balance}
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-xs text-white/30 uppercase">Lies</div>
                  <div className="text-xl font-bold text-red-400">{selectedAccount.lieCount}</div>
                </div>
              </div>

              <div className="mt-6 text-left space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-white/40 mb-1">
                    <span>Goal Progress</span>
                    <span>{selectedAccount.goal}</span>
                  </div>
                  <Progress value={(selectedAccount.balance / selectedAccount.goal) * 100} className="h-2 bg-white/5" />
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <span className="text-sm text-white/50">Lifetime Deposits</span>
                  <span className="text-green-400 font-medium">+{selectedAccount.totalDeposits}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/50">Lifetime Withdrawals</span>
                  <span className="text-red-400 font-medium">-{selectedAccount.totalWithdrawals}</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="flex flex-col h-[500px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">History</h3>
                <div className="relative w-32">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-white/20" size={12} />
                  <Input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="h-7 pl-7 text-[10px] bg-white/5 border-white/10"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-hide">
                {filteredTransactions.length === 0 && (
                  <div className="text-center text-white/20 py-10">
                    <Info className="mx-auto mb-2 opacity-20" size={32} />
                    <p className="text-xs">No matching transactions.</p>
                  </div>
                )}
                {filteredTransactions.map(t => (
                  <div key={t.id} className="p-3 rounded-xl bg-white/5 border border-white/5 group relative">
                    <button 
                      onClick={() => onToggleFavorite(selectedAccount.id, t.id)}
                      className={cn(
                        "absolute top-2 right-2 transition-colors",
                        t.isFavorite ? "text-yellow-400" : "text-white/10 group-hover:text-white/30"
                      )}
                    >
                      <Star size={14} fill={t.isFavorite ? "currentColor" : "none"} />
                    </button>
                    <div className="flex justify-between items-start mb-1 pr-6">
                      <span className="text-sm font-medium text-white">{t.action}</span>
                      <span className={cn("text-xs font-bold", t.type === 'DEPOSIT' ? 'text-green-400' : 'text-red-400')}>
                        {t.type === 'DEPOSIT' ? '+' : '-'}{t.amount}
                      </span>
                    </div>
                    <p className="text-[10px] text-white/40 leading-tight mb-2">{t.explanation}</p>
                    <div className="text-[9px] text-white/20">{format(new Date(t.timestamp), 'MMM d, HH:mm')}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-2">
            <GlassCard className="p-0 overflow-hidden h-full">
              <div className="p-4 border-b border-white/10 bg-white/5">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  Chat with {selectedAccount.person}
                </h3>
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
    <div className="space-y-6 pb-20">
      <header>
        <h1 className="text-3xl font-bold text-white">Trust Accounts</h1>
        <p className="text-white/50">Manage your relationships and personal integrity</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map(acc => (
          <GlassCard 
            key={acc.id} 
            hover 
            onClick={() => setSelectedId(acc.id)}
            className={cn("group", acc.balance < 500 && "border-red-500/30")}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="text-4xl group-hover:scale-110 transition-transform">{acc.emoji}</div>
              <div>
                <h3 className="text-xl font-bold text-white">{acc.person}</h3>
                <TrustBadge balance={acc.balance} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div className={cn("text-3xl font-black", acc.balance < 500 ? "text-red-400" : "text-white")}>
                  {acc.balance}
                </div>
                <div className="text-xs text-white/30 uppercase">Current Balance</div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-white/30 uppercase">
                  <span>Goal: {acc.goal}</span>
                  <span>{Math.round((acc.balance / acc.goal) * 100)}%</span>
                </div>
                <Progress value={(acc.balance / acc.goal) * 100} className="h-1.5 bg-white/5" />
              </div>

              <div className="flex justify-between pt-4 border-t border-white/5 text-xs">
                <span className="text-white/40">Last active: {format(new Date(acc.lastActive), 'MMM d')}</span>
                <span className="text-purple-400 font-medium">View Details →</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default Accounts;