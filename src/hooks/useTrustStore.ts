import { useState, useEffect, useCallback } from 'react';
import { TrustAccount, Transaction, Message, AppSettings, TrustState, TransactionType } from '../types/trust';
import { judgeAction } from '../utils/judgmentEngine';

const INITIAL_ACCOUNTS: TrustAccount[] = [
  { id: 'mum', person: 'Mum', emoji: '👩', balance: 600, lieCount: 1, goal: 800, transactions: [], weeklyHistory: [580, 590, 600], totalDeposits: 25, totalWithdrawals: 35, lastActive: new Date().toISOString() },
  { id: 'dad', person: 'Dad', emoji: '👨', balance: 700, lieCount: 0, goal: 800, transactions: [], weeklyHistory: [680, 690, 700], totalDeposits: 0, totalWithdrawals: 0, lastActive: new Date().toISOString() },
  { id: 'teacher', person: 'Teacher', emoji: '👩‍🏫', balance: 750, lieCount: 0, goal: 850, transactions: [], weeklyHistory: [740, 745, 750], totalDeposits: 0, totalWithdrawals: 0, lastActive: new Date().toISOString() },
  { id: 'friend', person: 'Friend', emoji: '🧑', balance: 700, lieCount: 0, goal: 800, transactions: [], weeklyHistory: [690, 695, 700], totalDeposits: 0, totalWithdrawals: 0, lastActive: new Date().toISOString() },
  { id: 'self', person: 'Self', emoji: '🧘', balance: 650, lieCount: 0, goal: 850, transactions: [], weeklyHistory: [640, 645, 650], totalDeposits: 15, totalWithdrawals: 5, lastActive: new Date().toISOString() },
];

const SEED_TRANSACTIONS: Record<string, Transaction[]> = {
  mum: [
    { id: 'm1', type: 'WITHDRAWAL', amount: 35, explanation: 'I lied about the cocoa', action: 'Lying', context: 'Cocoa incident', oldBalance: 635, newBalance: 600, timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: 'm2', type: 'DEPOSIT', amount: 15, explanation: 'I told mum I was sorry', action: 'Apology', context: '', oldBalance: 585, newBalance: 600, timestamp: new Date(Date.now() - 604800000).toISOString() },
  ],
  self: [
    { id: 's1', type: 'DEPOSIT', amount: 15, explanation: 'I resisted buying new shoes', action: 'Resisted Impulse', context: '', oldBalance: 635, newBalance: 650, timestamp: new Date().toISOString() },
    { id: 's2', type: 'WITHDRAWAL', amount: 5, explanation: 'I mumbled when asked about school', action: 'Mumbling', context: '', oldBalance: 655, newBalance: 650, timestamp: new Date(Date.now() - 86400000).toISOString() },
  ]
};

export const useTrustStore = () => {
  const [state, setState] = useState<TrustState>(() => {
    const saved = localStorage.getItem('trust_bank_data');
    if (saved) return JSON.parse(saved);
    
    const accounts = INITIAL_ACCOUNTS.map(acc => ({
      ...acc,
      transactions: SEED_TRANSACTIONS[acc.id] || []
    }));
    
    return {
      accounts,
      messages: {},
      settings: { interestRate: 0.01, darkMode: true, notifications: true }
    };
  });

  useEffect(() => {
    localStorage.setItem('trust_bank_data', JSON.stringify(state));
  }, [state]);

  const addTransaction = useCallback((accountId: string, text: string) => {
    const account = state.accounts.find(a => a.id === accountId);
    if (!account) return null;

    const judgment = judgeAction(text, account.person);
    if (!judgment) return null;

    const oldBalance = account.balance;
    let newBalance = judgment.type === 'DEPOSIT' ? oldBalance + judgment.amount : oldBalance - judgment.amount;
    
    // Clamp balance between 300 and 900
    newBalance = Math.max(300, Math.min(900, newBalance));

    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: judgment.type,
      amount: judgment.amount,
      explanation: text,
      action: judgment.action,
      context: judgment.explanation,
      oldBalance,
      newBalance,
      timestamp: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      accounts: prev.accounts.map(acc => {
        if (acc.id === accountId) {
          const isLie = judgment.action.toLowerCase().includes('lie');
          const isTruth = judgment.action.toLowerCase().includes('truth');
          return {
            ...acc,
            balance: newBalance,
            lieCount: isLie ? acc.lieCount + 1 : (isTruth ? Math.max(0, acc.lieCount - 1) : acc.lieCount),
            transactions: [transaction, ...acc.transactions],
            totalDeposits: judgment.type === 'DEPOSIT' ? acc.totalDeposits + judgment.amount : acc.totalDeposits,
            totalWithdrawals: judgment.type === 'WITHDRAWAL' ? acc.totalWithdrawals + judgment.amount : acc.totalWithdrawals,
            lastActive: new Date().toISOString(),
          };
        }
        return acc;
      })
    }));

    return transaction;
  }, [state.accounts]);

  const addMessage = useCallback((accountId: string, role: 'user' | 'assistant', content: string, transactionId?: string) => {
    setState(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        [accountId]: [
          ...(prev.messages[accountId] || []),
          { id: Math.random().toString(36).substr(2, 9), role, content, timestamp: new Date().toISOString(), transactionId }
        ]
      }
    }));
  }, []);

  const updateGoal = useCallback((accountId: string, newGoal: number) => {
    setState(prev => ({
      ...prev,
      accounts: prev.accounts.map(acc => acc.id === accountId ? { ...acc, goal: newGoal } : acc)
    }));
  }, []);

  const resetData = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      localStorage.removeItem('trust_bank_data');
      window.location.reload();
    }
  }, []);

  return {
    state,
    addTransaction,
    addMessage,
    updateGoal,
    resetData,
    setState
  };
};
</dyad-hook>

<dyad-write path="src/components/GlassCard.tsx" description="A reusable glass-morphism card component.">
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const GlassCard = ({ children, className, hover = false, onClick }: GlassCardProps) => {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, translateY: -4 } : {}}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-2xl",
        hover && "cursor-pointer hover:bg-white/10 transition-colors",
        className
      )}
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default GlassCard;