import React, { useState } from 'react';
import { useTrustStore } from '../hooks/useTrustStore';
import Dashboard from './Dashboard';
import Accounts from './Accounts';
import Insights from './Insights';
import Settings from './Settings';
import GlobalChat from './GlobalChat';
import { LayoutDashboard, Users, BarChart3, Settings as SettingsIcon, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { showSuccess, showError } from '../utils/toast';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'accounts' | 'coach' | 'insights' | 'settings'>('dashboard');
  const { state, addTransaction, toggleFavorite, addMessage, updateGoal, resetData, setState } = useTrustStore();

  const getPersonalityResponse = (accountId: string, text: string, transaction?: any) => {
    const lowerText = text.toLowerCase();
    
    const personalities: Record<string, any> = {
      mum: {
        greetings: ["Hi! I'm Mum's trust assistant. How's the honesty level today?", "Hello! Ready to log some progress with Mum?", "Hey there. I'm keeping an eye on things for Mum. What's up?"],
        deposits: ["That's a fantastic deposit! Mum really values that kind of transparency.", "Great job. Being upfront like that is exactly how you build a solid foundation with Mum.", "Excellent. This kind of honesty goes a long way in Mum's book."],
        withdrawals: ["Ouch. That's a significant withdrawal. Mum is going to be disappointed when she finds out.", "This is a setback. We really need to work on being more consistent with Mum.", "That's going to hurt your standing. Remember, trust is hard to build but easy to lose."],
        casual: ["I'm listening. Mum always says consistency is key.", "Got it. I'll keep this in mind for Mum's records.", "Understood. Every small action counts towards your total trust score."]
      },
      dad: {
        greetings: ["Hey. I'm the trust monitor for Dad. Ready to log some progress?", "Hi! Dad's big on reliability. How are we doing today?", "Hello. Let's see how your standing with Dad is looking."],
        deposits: ["Good work. Dad really respects this kind of responsibility.", "Solid move. Dad likes seeing you take ownership like this.", "Nice. This is exactly the kind of follow-through Dad expects."],
        withdrawals: ["That's a withdrawal. Dad expects better consistency than that.", "Not great. Dad values 'doing what you say you'll do' above all else.", "This is a hit to your credibility with Dad. Let's try to turn it around."],
        casual: ["Understood. Dad's always watching the 'big picture'.", "I've noted that. Reliability is a marathon, not a sprint.", "Got it. Let's keep pushing towards those goals Dad set."]
      },
      teacher: {
        greetings: ["Hello. I'm monitoring your academic integrity for your teacher.", "Hi. Ready to log some classroom progress?", "Greetings. Let's review your professional standing today."],
        deposits: ["Excellent. This builds significant professional trust in the classroom.", "Very good. Your teacher will definitely notice this level of integrity.", "Impressive. This is how you build a reputation as a reliable student."],
        withdrawals: ["This is a setback for your reputation in class.", "Not ideal. Academic trust is very fragile.", "Your teacher expects a higher standard of honesty than this."],
        casual: ["I've recorded your input. Professionalism is built one day at a time.", "Understood. Let's stay focused on your academic goals.", "Noted. Consistency in class is the key to long-term success."]
      },
      self: {
        greetings: ["Welcome back. This is your internal integrity mirror. How are we doing?", "Hi. Ready for some self-reflection today?", "Hello. Let's check in on your personal promises."],
        deposits: ["You're building self-respect. That's the most important currency you have.", "Great job. Keeping promises to yourself is the ultimate win.", "Excellent. This is how you build true confidence from the inside out."],
        withdrawals: ["You let yourself down there. Remember: you can't hide from yourself.", "This hurts your self-trust. You deserve better from yourself.", "Ouch. Breaking a promise to yourself is the fastest way to lose motivation."],
        casual: ["Reflecting... Your self-trust is the foundation of everything else.", "I'm listening. Honesty with yourself is where it all starts.", "Understood. You are your own most important judge."]
      },
      friend: {
        greetings: ["Yo! I'm tracking the vibes and trust for your friend. What's up?", "Hey! How's the friendship bank looking today?", "Hi! Ready to log some social points?"],
        deposits: ["Solid move. That's what real friends do.", "Nice! This kind of loyalty is what keeps friendships strong.", "Great. Being a reliable friend is a huge deposit."],
        withdrawals: ["That's a bit snakey. Trust is hard to build and easy to break.", "Not cool. Friendships rely on mutual respect and honesty.", "This is a hit to your social standing. Let's try to make it right."],
        casual: ["I hear you. Friendship is all about that balance.", "Got it. Vibes are being monitored.", "Understood. Real friends value the truth."]
      },
      global: {
        greetings: ["I am the Integrity Coach. I oversee your entire trust network. How can I help?", "Welcome. I'm analyzing your global patterns. What's on your mind?", "Hello. I see the big picture of your integrity. Ready for an update?"],
        casual: ["I'm analyzing your patterns. Your overall score reflects your total reliability.", "I see progress in some areas, but others need work. Let's stay focused.", "Your global standing is a reflection of every small choice you make."]
      }
    };

    const p = personalities[accountId] || personalities['self'];
    const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    if (transaction) {
      const base = transaction.type === 'DEPOSIT' ? getRandom(p.deposits) : getRandom(p.withdrawals);
      return `${base} (${transaction.type === 'DEPOSIT' ? '+' : '-'}${transaction.amount} points). ${transaction.context}`;
    }

    if (lowerText.includes('hi') || lowerText.includes('hello') || lowerText.includes('hey')) {
      return getRandom(p.greetings);
    }

    if (lowerText.includes('how are you') || lowerText.includes('status')) {
      return `I'm functioning at 100% efficiency. Your current balance for this account is ${state.accounts.find(a => a.id === accountId)?.balance || 'unknown'}.`;
    }

    return getRandom(p.casual);
  };

  const handleSendMessage = (accountId: string | 'global', text: string) => {
    addMessage(accountId, 'user', text);
    
    if (accountId === 'global') {
      setTimeout(() => {
        const response = getPersonalityResponse('global', text);
        addMessage('global', 'assistant', response);
      }, 800);
      return;
    }

    const transaction = addTransaction(accountId, text);
    
    setTimeout(() => {
      const response = getPersonalityResponse(accountId, text, transaction);
      addMessage(accountId, 'assistant', response, transaction?.id);
      
      if (transaction) {
        showSuccess(`${transaction.type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'} recorded!`);
      }
    }, 800);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(state);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `trust-bank-export-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    showSuccess('Data exported successfully!');
  };

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'accounts', label: 'Accounts', icon: Users },
    { id: 'coach', label: 'Coach', icon: MessageSquare },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white selection:bg-purple-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-4 pt-8 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && (
              <Dashboard 
                accounts={state.accounts} 
                onSelectAccount={(id) => {
                  setActiveTab('accounts');
                }} 
              />
            )}
            {activeTab === 'accounts' && (
              <Accounts 
                accounts={state.accounts} 
                messages={state.messages}
                onSendMessage={handleSendMessage}
                onUpdateGoal={updateGoal}
                onToggleFavorite={toggleFavorite}
              />
            )}
            {activeTab === 'coach' && (
              <GlobalChat 
                accounts={state.accounts}
                messages={state.globalMessages}
                onSendMessage={(text) => handleSendMessage('global', text)}
              />
            )}
            {activeTab === 'insights' && <Insights accounts={state.accounts} />}
            {activeTab === 'settings' && (
              <Settings 
                settings={state.settings}
                onUpdateSettings={(newSettings) => setState(prev => ({ ...prev, settings: { ...prev.settings, ...newSettings } }))}
                onReset={resetData}
                onExport={handleExport}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-lg">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 flex justify-around items-center shadow-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={cn(
                  "relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300",
                  isActive ? "text-purple-400" : "text-white/40 hover:text-white/60"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute inset-0 bg-purple-500/10 rounded-xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon size={18} className={cn("transition-transform", isActive && "scale-110")} />
                <span className="text-[9px] font-medium uppercase tracking-wider">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Index;