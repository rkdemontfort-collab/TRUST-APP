import { useState, useEffect, useCallback } from 'react';
import { TrustAccount, Transaction, Message, AppSettings, TrustState, TransactionType } from '../types/trust';
import { judgeAction } from '../utils/judgmentEngine';
import confetti from 'canvas-confetti';

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
      isFavorite: false
    };

    // Trigger confetti if goal reached
    if (oldBalance < account.goal && newBalance >= account.goal) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#3b82f6', '#10b981']
      });
    }

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

  const toggleFavorite = useCallback((accountId: string, transactionId: string) => {
    setState(prev => ({
      ...prev,
      accounts: prev.accounts.map(acc => {
        if (acc.id === accountId) {
          return {
            ...acc,
            transactions: acc.transactions.map(t => 
              t.id === transactionId ? { ...t, isFavorite: !t.isFavorite } : t
            )
          };
        }
        return acc;
      })
    }));
  }, []);

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
    toggleFavorite,
    addMessage,
    updateGoal,
    resetData,
    setState
  };
};