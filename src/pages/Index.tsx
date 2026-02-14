import React, { useState } from 'react';
import { useTrustStore } from '../hooks/useTrustStore';
import Dashboard from './Dashboard';
import Accounts from './Accounts';
import Insights from './Insights';
import Settings from './Settings';
import { LayoutDashboard, Users, BarChart3, Settings as SettingsIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { showSuccess, showError } from '../utils/toast';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'accounts' | 'insights' | 'settings'>('dashboard');
  const { state, addTransaction, toggleFavorite, addMessage, updateGoal, resetData, setState } = useTrustStore();

  const getPersonalityResponse = (accountId: string, text: string, transaction?: any) => {
    const lowerText = text.toLowerCase();
    
    const personalities: Record<string, any> = {
      mum: {
        greeting: "Hi there. I'm keeping track of things for Mum. How's the honesty level today?",
        deposit: "That's a great deposit. Mum really appreciates when you're upfront like that.",
        withdrawal: "Ouch. That's going to hurt your standing with Mum. We need to work on this.",
        casual: "I'm listening. Mum values consistency above all else."
      },
      dad: {
        greeting: "Hey. I'm the trust monitor for Dad. Ready to log some progress?",
        deposit: "Good work. Dad likes seeing this kind of responsibility.",
        withdrawal: "That's a withdrawal. Dad expects better follow-through than that.",
        casual: "Got it. Dad's big on 'doing what you say you'll do'."
      },
      teacher: {
        greeting: "Hello. I'm monitoring your academic integrity and reliability for your teacher.",
        deposit: "Excellent. This builds significant professional trust.",
        withdrawal: "This is a setback for your reputation in class.",
        casual: "Understood. Let's keep focusing on your goals."
      },
      self: {
        greeting: "Welcome back. This is your internal integrity mirror. How are we doing with ourselves?",
        deposit: "You're building self-respect. That's the most important currency you have.",
        withdrawal: "You let yourself down there. Remember: you can't hide from yourself.",
        casual: "Reflecting... Your self-trust is the foundation of everything else."
      },
      friend: {
        greeting: "Yo! I'm tracking the vibes and trust for your friend. What's up?",
        deposit: "Solid move. That's what real friends do.",
        withdrawal: "That's a bit snakey. Trust is hard to build and easy to break.",
        casual: "I hear you. Friendship is all about that balance."
      }
    };

    const p = personalities[accountId] || personalities['self'];

    if (transaction) {
      const base = transaction.type === 'DEPOSIT' ? p.deposit : p.withdrawal;
      return `${base} (${transaction.type === 'DEPOSIT' ? '+' : '-'}${transaction.amount} points). ${transaction.context}`;
    }

    if (lowerText.includes('hi') || lowerText.includes('hello') || lowerText.includes('hey')) {
      return p.greeting;
    }

    return p.casual;
  };

  const handleSendMessage = (accountId: string, text: string) => {
    const account = state.accounts.find(a => a.id === accountId);
    if (!account) return;

    addMessage(accountId, 'user', text);
    
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

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 flex justify-around items-center shadow-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={cn(
                  "relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300",
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
                <Icon size={20} className={cn("transition-transform", isActive && "scale-110")} />
                <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Index;