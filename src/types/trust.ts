export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  explanation: string;
  action: string;
  context: string;
  oldBalance: number;
  newBalance: number;
  timestamp: string;
  isFavorite?: boolean;
}

export interface TrustAccount {
  id: string;
  person: string;
  emoji: string;
  balance: number;
  lieCount: number;
  goal: number;
  transactions: Transaction[];
  weeklyHistory: number[];
  totalDeposits: number;
  totalWithdrawals: number;
  lastActive: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  transactionId?: string;
}

export interface AppSettings {
  interestRate: number;
  darkMode: boolean;
  notifications: boolean;
}

export interface TrustState {
  accounts: TrustAccount[];
  messages: Record<string, Message[]>;
  settings: AppSettings;
}