import React, { useState, useEffect } from 'react';
import { useTrustStore } from '../hooks/useTrustStore';
import Dashboard from './Dashboard';
import Accounts from './Accounts';
import Insights from './Insights';
import Settings from './Settings';
import GlobalChat from './GlobalChat';
import CalendarPage from './Calendar';
import Auth from '../components/Auth';
import SplashScreen from '../components/SplashScreen';
import { supabase } from '@/lib/supabase';
import { LayoutDashboard, Users, BarChart3, Settings as SettingsIcon, MessageSquare, LogIn, LogOut, User, ShieldCheck, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { showSuccess } from '../utils/toast';
import { getAIResponse } from '../utils/aiAssistant';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QuickLog from '../components/QuickLog';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'accounts' | 'coach' | 'insights' | 'settings' | 'calendar'>('dashboard');
  const [showAuth, setShowAuth] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { state, addTransaction, toggleFavorite, addMessage, updateGoal, resetData, setState } = useTrustStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    if (!user) {
      const richardUser = {
        id: 'richard-id',
        email: 'richard@trustbank.ai',
        user_metadata: { full_name: 'Richard' }
      };
      setUser(richardUser);
      showSuccess('Welcome back, Richard');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    showSuccess('Signed out successfully');
  };

  const handleSendMessage = (accountId: string | 'global', text: string) => {
    addMessage(accountId, 'user', text);
    const transaction = accountId === 'global' ? null : addTransaction(accountId, text);
    
    setTimeout(() => {
      const response = getAIResponse(accountId, text, state.accounts, transaction);
      addMessage(accountId, 'assistant', response, transaction?.id);
      
      if (transaction) {
        showSuccess(`${transaction.type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'} recorded!`);
      }
    }, 1000);
  };

  const handleQuickLog = (accountId: string, text: string) => {
    handleSendMessage(accountId, text);
    setShowQuickLog(false);
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
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'coach', label: 'Coach', icon: MessageSquare },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      </AnimatePresence>

      <div className="aurora-bg">
        <div className="aurora-blob w-[600px] h-[600px] bg-purple-400/40 -top-20 -left-20" />
        <div className="aurora-blob w-[500px] h-[500px] bg-blue-400/40 top-1/4 -right-20" style={{ animationDelay: '-5s' }} />
        <div className="aurora-blob w-[700px] h-[700px] bg-pink-400/30 bottom-0 left-1/4" style={{ animationDelay: '-10s' }} />
        <div className="aurora-blob w-[400px] h-[400px] bg-indigo-400/40 top-1/2 left-1/2" style={{ animationDelay: '-15s' }} />
      </div>

      <header className="relative z-20 max-w-6xl mx-auto px-6 pt-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <span className="text-xl font-black tracking-tight">TrustBank</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => setShowQuickLog(true)}
            className="ios-button rounded-full w-12 h-12 p-0 flex items-center justify-center bg-primary text-white shadow-lg shadow-primary/20"
          >
            <Plus size={24} />
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="ios-button rounded-full gap-2 px-4">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <span className="font-semibold">{user.email?.split('@')[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 rounded-[2rem] glass-effect-heavy p-2 border-none">
                <DropdownMenuLabel className="px-4 py-3">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={() => setActiveTab('settings')} className="rounded-xl px-4 py-3 focus:bg-white/10">
                  <SettingsIcon className="mr-3 h-5 w-5" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={handleSignOut} className="rounded-xl px-4 py-3 text-destructive focus:bg-destructive/10">
                  <LogOut className="mr-3 h-5 w-5" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              onClick={() => setShowAuth(true)}
              className="ios-button rounded-full gap-2 px-6 h-12 font-bold"
            >
              <LogIn size={18} />
              Sign In
            </Button>
          )}
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-32">
        <AnimatePresence mode="wait">
          {!showSplash && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {activeTab === 'dashboard' && (
                <Dashboard 
                  accounts={state.accounts} 
                  onSelectAccount={(id) => setActiveTab('accounts')} 
                  onQuickLog={handleQuickLog}
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
              {activeTab === 'calendar' && <CalendarPage />}
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
          )}
        </AnimatePresence>
      </main>

      <Dialog open={showQuickLog} onOpenChange={setShowQuickLog}>
        <DialogContent className="rounded-[2.5rem] glass-effect-heavy border-none p-8 max-w-lg">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-3xl font-black tracking-tight">Quick Log</DialogTitle>
          </DialogHeader>
          <QuickLog accounts={state.accounts} onLog={handleQuickLog} />
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {showAuth && <Auth onClose={() => setShowAuth(false)} />}
      </AnimatePresence>

      {!showSplash && (
        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg">
          <div className="ios-dock">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={cn(
                    "relative flex flex-col items-center gap-1.5 px-5 py-3 rounded-3xl transition-all duration-500",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-glow"
                      className="absolute inset-0 bg-white/40 dark:bg-white/10 rounded-3xl shadow-inner"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon size={24} className={cn("transition-all duration-500", isActive && "scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]")} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};

export default Index;