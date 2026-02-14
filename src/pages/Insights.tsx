import React from 'react';
import GlassCard from '../components/GlassCard';
import { TrustAccount } from '../types/trust';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Brain, TrendingUp, AlertTriangle, Heart } from 'lucide-react';

interface InsightsProps {
  accounts: TrustAccount[];
}

const Insights = ({ accounts }: InsightsProps) => {
  const selfAccount = accounts.find(a => a.id === 'self')!;
  
  const depositVsWithdrawal = [
    { name: 'Deposits', value: accounts.reduce((a, b) => a + b.totalDeposits, 0), color: '#4ade80' },
    { name: 'Withdrawals', value: accounts.reduce((a, b) => a + b.totalWithdrawals, 0), color: '#f87171' },
  ];

  const relationshipHealth = accounts.map(acc => ({
    name: acc.person,
    score: acc.balance,
    color: acc.balance >= 700 ? '#4ade80' : acc.balance >= 600 ? '#fbbf24' : '#f87171'
  }));

  const topWithdrawals = accounts
    .flatMap(acc => acc.transactions.filter(t => t.type === 'WITHDRAWAL'))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  return (
    <div className="space-y-6 pb-20">
      <header>
        <h1 className="text-3xl font-bold text-white">Insights</h1>
        <p className="text-white/50">Deep dive into your behavioral patterns</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Brain className="text-purple-400" size={20} />
            Deposit vs Withdrawal Ratio
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={depositVsWithdrawal}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {depositVsWithdrawal.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-8 mt-4">
            {depositVsWithdrawal.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-xs text-white/60">{d.name}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Heart className="text-red-400" size={20} />
            Relationship Scores
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={relationshipHealth}>
                <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} />
                <YAxis hide domain={[300, 900]} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {relationshipHealth.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="md:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="text-orange-400" size={20} />
            Critical Areas
          </h3>
          <div className="space-y-4">
            {topWithdrawals.map((t, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-bold">
                  -{t.amount}
                </div>
                <div>
                  <div className="text-white font-medium">{t.action}</div>
                  <p className="text-xs text-white/40">{t.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="bg-purple-600/20 border-purple-500/30">
          <h3 className="text-lg font-semibold text-white mb-4">Daily Reflection</h3>
          <p className="text-sm text-purple-200 leading-relaxed italic">
            "Your self-trust is the foundation for all other relationships. Today, focus on speaking clearly and resisting small impulses. Every small win is a deposit in your future."
          </p>
          <div className="mt-6 pt-6 border-t border-purple-500/20">
            <div className="text-xs text-purple-300 uppercase mb-2">Focus for tomorrow</div>
            <div className="text-white font-bold">Honesty with Mum</div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Insights;