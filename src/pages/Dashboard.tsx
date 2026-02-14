import React from 'react';
import GlassCard from '../components/GlassCard';
import QuickLog from '../components/QuickLog';
import { TrustAccount } from '../types/trust';
import TrustBadge from '../components/TrustBadge';
import TrustLevelCircle from '../components/TrustLevelCircle';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, History, Target, Zap, Sun, Sparkles, Award, ArrowRight, Plus } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, YAxis, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

interface DashboardProps {
  accounts: TrustAccount[];
  onSelectAccount: (id: string) => void;
  onQuickLog: (accountId: string, text: string) => void;
}

const Dashboard = ({ accounts, onSelectAccount, onQuickLog }: DashboardProps) => {
  const overallScore = Math.round(accounts.reduce((acc, curr) => acc + curr.balance, 0) / accounts.length);
  
  const allTransactions = accounts
    .flatMap(acc => acc.transactions.map(t => ({ ...t, person: acc.person, emoji: acc.emoji })))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const selfAccount = accounts.find(a => a.id === 'self')!;

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <div className="flex items-center gap-2 text-primary mb-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span className="text-xs font-black uppercase tracking-[0.3em]">Integrity Engine v26.4</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter leading-none mb-4">Overview</h1>
          <p className="text-xl text-foreground/50 font-medium max-w-md">Your reputation is the only currency that matters in the long run.</p>
        </div>
        <GlassCard className="flex items-center gap-10 py-6 px-10 border-none bg-white/20 dark:bg-white/5 shadow-2xl">
          <TrustLevelCircle score={overallScore} size={100} />
          <div>
            <div className="text-[10px] text-foreground/40 uppercase font-black tracking-[0.2em] mb-2">Global Standing</div>
            <div className="text-3xl font-black tracking-tight">Excellent</div>
            <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold mt-1">
              <TrendingUp size={14} /> +4.2%
            </div>
          </div>
        </GlassCard>
      </header>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <Zap className="text-primary" size={24} />
          <h2 className="text-2xl font-black tracking-tight">Quick Log</h2>
        </div>
        <GlassCard className="p-8 border-none bg-white/20 dark:bg-white/5">
          <QuickLog accounts={accounts} onLog={onQuickLog} />
        </GlassCard>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2 relative overflow-hidden group p-10">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/20 rounded-full blur-[100px] group-hover:bg-primary/30 transition-colors duration-1000" />
          
          <div className="flex justify-between items-start mb-12 relative z-10">
            <div>
              <h3 className="text-3xl font-black tracking-tight flex items-center gap-4">
                <Target className="text-primary" size={32} />
                Self-Trust
              </h3>
              <p className="text-foreground/50 font-medium mt-2">Internal reliability index</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-black tracking-tighter text-primary">{selfAccount.balance}</div>
              <div className="text-sm text-emerald-500 font-black mt-2 uppercase tracking-widest">Ascending</div>
            </div>
          </div>
          
          <div className="h-72 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={selfAccount.weeklyHistory.map((v, i) => ({ val: v, day: i }))}>
                <Line 
                  type="monotone" 
                  dataKey="val" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={8} 
                  dot={{ r: 8, fill: 'hsl(var(--primary))', strokeWidth: 4, stroke: '#fff' }} 
                  activeDot={{ r: 10, strokeWidth: 0 }}
                />
                <YAxis hide domain={[300, 900]} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '2.5rem', 
                    border: 'none', 
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(30px)',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
                    padding: '20px'
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <div className="space-y-8">
          <GlassCard className="bg-primary text-primary-foreground border-none shadow-2xl shadow-primary/30 p-8">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-4">
              <Sparkles size={28} />
              Daily Insight
            </h3>
            <p className="text-xl font-medium leading-relaxed italic opacity-90">
              "Trust is built in drops and lost in buckets. Today, focus on the small drops."
            </p>
            <div className="mt-10 flex items-center gap-5">
              <div className="w-14 h-14 rounded-[1.5rem] bg-white/20 flex items-center justify-center shadow-inner">
                <Award size={28} />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Current Streak</div>
                <div className="text-2xl font-black tracking-tight">5 Days Honest</div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="bg-white/20 dark:bg-white/5 border-none p-8">
            <h3 className="text-2xl font-black mb-8 flex items-center gap-4">
              <Zap className="text-amber-500" size={28} />
              Quick Stats
            </h3>
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <span className="text-foreground/50 font-bold text-lg">Total Lies</span>
                <span className="text-rose-500 text-3xl font-black tracking-tighter">{accounts.reduce((a, b) => a + b.lieCount, 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground/50 font-bold text-lg">Goals Met</span>
                <span className="text-emerald-500 text-3xl font-black tracking-tighter">{accounts.filter(a => a.balance >= a.goal).length}</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section>
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-black tracking-tighter flex items-center gap-4">
              <History className="text-primary" size={36} />
              Activity
            </h2>
            <button className="text-sm font-black text-primary hover:opacity-70 transition-all flex items-center gap-2 group">
              View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="space-y-5">
            {allTransactions.map((t, i) => (
              <GlassCard key={t.id} className="p-6 border-none bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10" hover>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[2rem] bg-white/50 dark:bg-white/10 flex items-center justify-center text-4xl shadow-sm">
                    {t.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-black text-xl tracking-tight">{t.action}</span>
                      <span className={cn("text-2xl font-black tracking-tighter", t.type === 'DEPOSIT' ? 'text-emerald-500' : 'text-rose-500')}>
                        {t.type === 'DEPOSIT' ? '+' : '-'}{t.amount}
                      </span>
                    </div>
                    <p className="text-base text-foreground/50 font-medium truncate">{t.explanation}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-4xl font-black tracking-tighter mb-10">Relationships</h2>
          <div className="space-y-5">
            {accounts.map(acc => (
              <GlassCard key={acc.id} className="p-8 border-none bg-white/40 dark:bg-white/5" hover onClick={() => onSelectAccount(acc.id)}>
                <div className="flex items-center gap-6 mb-8">
                  <span className="text-5xl drop-shadow-lg">{acc.emoji}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-2xl tracking-tight">{acc.person}</span>
                      <TrustBadge balance={acc.balance} />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">
                    <span>Progress to {acc.goal}</span>
                    <span>{acc.balance} / 900</span>
                  </div>
                  <Progress value={((acc.balance - 300) / 600) * 100} className="h-4 bg-white/20 dark:bg-white/5 rounded-full" />
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