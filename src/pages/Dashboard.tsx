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
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-primary mb-2">
            <Sun size={24} className="animate-pulse" />
            <span className="text-sm font-black uppercase tracking-[0.2em]">System Active</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-2">Overview</h1>
          <p className="text-lg text-muted-foreground font-medium">Your integrity is your greatest asset.</p>
        </div>
        <GlassCard className="flex items-center gap-8 py-4 px-8 border-none bg-white/40 dark:bg-white/5">
          <TrustLevelCircle score={overallScore} size={90} />
          <div>
            <div className="text-xs text-muted-foreground uppercase font-black tracking-widest mb-1">Global Standing</div>
            <div className="text-2xl font-black">Excellent</div>
          </div>
        </GlassCard>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2 relative overflow-hidden group">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-700" />
          
          <div className="flex justify-between items-start mb-10 relative z-10">
            <div>
              <h3 className="text-2xl font-black flex items-center gap-3">
                <Target className="text-primary" size={28} />
                Self-Trust Growth
              </h3>
              <p className="text-muted-foreground font-medium mt-1">Your internal reliability trend</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black text-primary">{selfAccount.balance}</div>
              <div className="text-sm text-green-500 font-bold mt-1">+12% this week</div>
            </div>
          </div>
          
          <div className="h-64 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={selfAccount.weeklyHistory.map((v, i) => ({ val: v, day: i }))}>
                <Line 
                  type="monotone" 
                  dataKey="val" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={6} 
                  dot={{ r: 6, fill: 'hsl(var(--primary))', strokeWidth: 3, stroke: '#fff' }} 
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
                <YAxis hide domain={[300, 900]} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '2rem', 
                    border: 'none', 
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.1)' 
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <div className="space-y-8">
          <GlassCard className="bg-primary text-primary-foreground border-none shadow-primary/20">
            <h3 className="text-xl font-black mb-4 flex items-center gap-3">
              <Sparkles size={24} />
              Daily Insight
            </h3>
            <p className="text-lg font-medium leading-relaxed italic opacity-90">
              "Trust is built in drops and lost in buckets. Today, focus on the small drops."
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <Award size={24} />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-70">Current Streak</div>
                <div className="text-xl font-black">5 Days Honest</div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="bg-white/20 dark:bg-white/5 border-none">
            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
              <Zap className="text-yellow-500" size={24} />
              Quick Stats
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-bold">Total Lies</span>
                <span className="text-destructive text-xl font-black">{accounts.reduce((a, b) => a + b.lieCount, 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-bold">Goals Met</span>
                <span className="text-green-500 text-xl font-black">{accounts.filter(a => a.balance >= a.goal).length}</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black flex items-center gap-3">
              <History className="text-primary" size={32} />
              Activity
            </h2>
            <button className="text-sm font-black text-primary hover:opacity-70 transition-opacity">View All</button>
          </div>
          <div className="space-y-4">
            {allTransactions.map((t, i) => (
              <GlassCard key={t.id} className="p-5 border-none bg-white/40 dark:bg-white/5" hover>
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-[1.5rem] bg-white/50 dark:bg-white/10 flex items-center justify-center text-3xl shadow-sm">
                    {t.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-black text-lg">{t.action}</span>
                      <span className={cn("text-xl font-black", t.type === 'DEPOSIT' ? 'text-green-500' : 'text-destructive')}>
                        {t.type === 'DEPOSIT' ? '+' : '-'}{t.amount}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium truncate">{t.explanation}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-black mb-8">Relationships</h2>
          <div className="space-y-4">
            {accounts.map(acc => (
              <GlassCard key={acc.id} className="p-6 border-none bg-white/40 dark:bg-white/5" hover onClick={() => onSelectAccount(acc.id)}>
                <div className="flex items-center gap-5 mb-6">
                  <span className="text-4xl">{acc.emoji}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-xl">{acc.person}</span>
                      <TrustBadge balance={acc.balance} />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest text-muted-foreground">
                    <span>Progress to {acc.goal}</span>
                    <span>{acc.balance} / 900</span>
                  </div>
                  <Progress value={((acc.balance - 300) / 600) * 100} className="h-3 bg-white/20 dark:bg-white/5" />
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