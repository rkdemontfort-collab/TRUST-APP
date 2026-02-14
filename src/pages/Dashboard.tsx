import React from 'react';
import GlassCard from '../components/GlassCard';
import { TrustAccount, Transaction } from '../types/trust';
import TrustBadge from '../components/TrustBadge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, History, Target, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

interface DashboardProps {
  accounts: TrustAccount[];
  onSelectAccount: (id: string) => void;
}

const Dashboard = ({ accounts, onSelectAccount }: DashboardProps) => {
  const overallScore = Math.round(accounts.reduce((acc, curr) => acc + curr.balance, 0) / accounts.length);
  
  const allTransactions = accounts
    .flatMap(acc => acc.transactions.map(t => ({ ...t, person: acc.person, emoji: acc.emoji })))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const selfAccount = accounts.find(a => a.id === 'self')!;

  return (
    <div className="space-y-6 pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Trust Bank</h1>
          <p className="text-white/50">Your personal integrity dashboard</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-black text-purple-400">{overallScore}</div>
          <div className="text-xs text-white/30 uppercase tracking-widest">Overall Trust Score</div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="md:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Target className="text-purple-400" size={20} />
                Self Trust Trend
              </h3>
              <p className="text-sm text-white/40">Tracking your personal growth</p>
            </div>
            <div className="text-2xl font-bold text-white">{selfAccount.balance}</div>
          </div>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={selfAccount.weeklyHistory.map((v, i) => ({ val: v, day: i }))}>
                <Line type="monotone" dataKey="val" stroke="#a855f7" strokeWidth={3} dot={false} />
                <YAxis hide domain={[300, 900]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#a855f7' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="text-yellow-400" size={20} />
            Quick Stats
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white/50 text-sm">Total Lies</span>
              <span className="text-red-400 font-bold">{accounts.reduce((a, b) => a + b.lieCount, 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/50 text-sm">Goals Met</span>
              <span className="text-green-400 font-bold">{accounts.filter(a => a.balance >= a.goal).length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/50 text-sm">Active Accounts</span>
              <span className="text-blue-400 font-bold">{accounts.length}</span>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <History className="text-purple-400" size={20} />
            Recent Activity
          </h2>
          <div className="space-y-3">
            {allTransactions.map((t, i) => (
              <GlassCard key={t.id} className="p-4" hover>
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{t.emoji}</div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-white font-medium">{t.action}</span>
                      <span className={t.type === 'DEPOSIT' ? 'text-green-400' : 'text-red-400'}>
                        {t.type === 'DEPOSIT' ? '+' : '-'}{t.amount}
                      </span>
                    </div>
                    <p className="text-xs text-white/40 truncate">{t.explanation}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">Relationship Health</h2>
          <div className="space-y-4">
            {accounts.map(acc => (
              <GlassCard key={acc.id} className="p-4" hover onClick={() => onSelectAccount(acc.id)}>
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-2xl">{acc.emoji}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">{acc.person}</span>
                      <TrustBadge balance={acc.balance} />
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-white/30 uppercase">
                    <span>Progress to {acc.goal}</span>
                    <span>{acc.balance} / 900</span>
                  </div>
                  <Progress value={((acc.balance - 300) / 600) * 100} className="h-1.5 bg-white/5" />
                </div>
              </GlassCard>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;