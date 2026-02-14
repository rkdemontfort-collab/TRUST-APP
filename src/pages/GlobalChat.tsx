import React from 'react';
import GlassCard from '../components/GlassCard';
import ChatInterface from '../components/ChatInterface';
import { TrustAccount, Message } from '../types/trust';
import { ShieldCheck, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface GlobalChatProps {
  accounts: TrustAccount[];
  messages: Message[];
  onSendMessage: (text: string) => void;
}

const GlobalChat = ({ accounts, messages, onSendMessage }: GlobalChatProps) => {
  const overallScore = Math.round(accounts.reduce((acc, curr) => acc + curr.balance, 0) / accounts.length);
  const totalLies = accounts.reduce((acc, curr) => acc + curr.lieCount, 0);
  
  const globalBotAccount = {
    id: 'global',
    person: 'Integrity Coach',
    emoji: '🛡️',
    balance: overallScore,
    lieCount: totalLies,
    goal: 850,
    transactions: [],
    weeklyHistory: [],
    totalDeposits: 0,
    totalWithdrawals: 0,
    lastActive: new Date().toISOString()
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Integrity Coach</h1>
          <p className="text-white/50">Global oversight of your trust accounts</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-white/30 uppercase tracking-widest mb-1">Overall Score</div>
          <div className="text-5xl font-black text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            {overallScore}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <GlassCard className="bg-purple-600/10 border-purple-500/20">
            <h3 className="text-sm font-bold text-purple-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldCheck size={16} /> System Status
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Total Integrity</span>
                <span className="text-white font-bold">{overallScore}/900</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Active Lies</span>
                <span className={totalLies > 0 ? "text-red-400 font-bold" : "text-green-400 font-bold"}>
                  {totalLies}
                </span>
              </div>
              <div className="pt-4 border-t border-white/5">
                <p className="text-[10px] text-white/40 leading-relaxed">
                  The Integrity Coach monitors all relationships. Your overall score is a weighted average of your reliability across all accounts.
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-400" /> Quick Tips
            </h3>
            <ul className="text-xs text-white/50 space-y-3">
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                Small lies to Mum affect your global credibility.
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                Self-trust is your strongest asset right now.
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                Consistency is better than intensity.
              </li>
            </ul>
          </GlassCard>
        </div>

        <div className="lg:col-span-2">
          <GlassCard className="p-0 overflow-hidden h-[600px]">
            <ChatInterface 
              account={globalBotAccount as any}
              messages={messages}
              onSendMessage={onSendMessage}
            />
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default GlobalChat;