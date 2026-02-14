import React from 'react';
import GlassCard from '../components/GlassCard';
import { TrustAccount } from '../types/trust';
import TrustBadge from '../components/TrustBadge';
import TrustLevelCircle from '../components/TrustLevelCircle';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, History, Target, Zap, Sun, Sparkles, Award } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, YAxis, Tooltip } from 'recharts';

interface DashboardProps {
  accounts: TrustAccount[];
  onSelectAccount: (id: string) => void;
}

const Dashboard = ({ accounts, onSelectAccount }: DashboardProps) => {
  const overallScore = Math.round(accounts.reduce((acc, curr) => acc + curr.balance, 0) / accounts.length);
  
  const allTransactions = accounts
    .flatMap(acc => acc.transactions.map(t => ({ ...t, person: acc.person, emoji: acc.emoji })))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 4);

  const selfAccount = accounts.find(a => a.id === 'self')!;

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
            <Sun size={20} className="animate-spin-slow" />
            <span className="text-xs font-bold uppercase tracking-widest">Good Morning</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">Trust Bank</h1>
          <p className="text-muted-foreground">Your integrity is your greatest asset.</p>
        </div>
        <div className="flex items-center gap-6 bg-primary/5 p-4 rounded-3xl border border-primary/10">
          <TrustLevelCircle score={overallScore} size={80} />
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest">Global Standing</div>
            <div className="text-xl font-bold">Excellent</div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <TrendingUp size={120} />
          </div>
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Target className="text-primary" size={24} />
                Self-Trust Growth
              </h3>
              <p className="text-sm text-muted-foreground">Your internal reliability trend</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-primary">{selfAccount.balance}</div>
              <div className="text-[10px] text-green-500 font-bold">+12% this week</div>
            </div>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={selfAccount.weeklyHistory.map((v, i) => ({ val: v, day: i }))}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Line 
                  type="monotone" 
                  dataKey="val" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <YAxis hide domain={[300, 900]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard className="bg-primary text-primary-foreground">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Sparkles size={20} />
              Daily Motivation
            </h3>
            <p className="text-sm opacity-90 leading-relaxed italic">
              "Trust is built in drops and lost in buckets. Today, focus on the small drops."
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Award size={20} />
              </div>
              <div>
                <div className="text-xs opacity-70">Current Streak</div>
                <div className="font-bold">5 Days Honest</div>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap className="text-yellow-500" size={20} />
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Total Lies</span>
                <span className="text-destructive font-bold">{accounts.reduce((a, b) => a + b.lieCount, 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Goals Met</span>
                <span className="text-green-500 font-bold">{accounts.filter(a => a.balance >= a.goal).length}</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black flex items-center gap-2">
              <History className="text-primary" size={24} />
              Recent Activity
            </h2>
            <button className="text-xs font-bold text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {allTransactions.map((t, i) => (
              <GlassCard key={t.id} className="p-4" hover>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-2xl">
                    {t.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-bold">{t.action}</span>
                      <span className={t.type === 'DEPOSIT' ? 'text-green-500 font-black' : 'text-destructive font-black'}>
                        {t.type === 'DEPOSIT' ? '+' : '-'}{t.amount}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{t.explanation}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black mb-6">Relationship Health</h2>
          <div className="space-y-4">
            {accounts.map(acc => (
              <GlassCard key={acc.id} className="p-5" hover onClick={() => onSelectAccount(acc.id)}>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl">{acc.emoji}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg">{acc.person}</span>
                      <TrustBadge balance={acc.balance} />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold">
                    <span>Progress to {acc.goal}</span>
                    <span>{acc.balance} / 900</span>
                  </div>
                  <Progress value={((acc.balance - 300) / 600) * 100} className="h-2 bg-muted" />
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