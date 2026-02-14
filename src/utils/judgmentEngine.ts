import { TransactionType, AIStrictness } from '../types/trust';

interface JudgmentResult {
  type: TransactionType;
  amount: number;
  action: string;
  explanation: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

const MULTIPLIERS: Record<AIStrictness, number> = {
  LENIENT: 0.5,
  BALANCED: 1.0,
  STRICT: 1.5,
  SAVAGE: 2.5
};

export const judgeAction = (text: string, person: string, strictness: AIStrictness): JudgmentResult | null => {
  const lowerText = text.toLowerCase();
  const multiplier = MULTIPLIERS[strictness];

  // Helper to calculate amount with strictness
  const calc = (base: number) => Math.round(base * multiplier);

  // 1. CRITICAL OFFENSES (Lying/Betrayal)
  if (lowerText.includes('lie') || lowerText.includes('lied') || lowerText.includes('dishonest') || lowerText.includes('cocoa')) {
    const isCocoa = lowerText.includes('cocoa');
    return {
      type: 'WITHDRAWAL',
      amount: calc(isCocoa ? 45 : 35),
      action: isCocoa ? 'The Cocoa Incident' : 'Dishonesty',
      severity: 'CRITICAL',
      explanation: isCocoa 
        ? "This is a major breach of trust. Lying about the small things makes it impossible to trust the big things."
        : "Dishonesty is the fastest way to bankrupt your trust account."
    };
  }

  // 2. HIGH SEVERITY (Hiding/Arguments)
  if (lowerText.includes('hid') || lowerText.includes('secret') || lowerText.includes('argue') || lowerText.includes('yell')) {
    return {
      type: 'WITHDRAWAL',
      amount: calc(25),
      action: 'Defensive Behavior',
      severity: 'HIGH',
      explanation: "Secrecy and aggression create walls between you and others."
    };
  }

  // 3. MEDIUM SEVERITY (Impulse/Procrastination)
  if (lowerText.includes('bought') || lowerText.includes('spent') || lowerText.includes('later') || lowerText.includes('procrastinate')) {
    return {
      type: 'WITHDRAWAL',
      amount: calc(15),
      action: 'Lack of Discipline',
      severity: 'MEDIUM',
      explanation: "Self-trust requires discipline. Giving in to impulses weakens your integrity."
    };
  }

  // 4. POSITIVE: HIGH (Truth/Ownership)
  if (lowerText.includes('truth') || lowerText.includes('admit') || lowerText.includes('sorry') || lowerText.includes('apologize')) {
    return {
      type: 'DEPOSIT',
      amount: calc(30),
      action: 'Radical Honesty',
      severity: 'HIGH',
      explanation: "Owning your mistakes and telling the truth even when it's hard is the best way to build trust."
    };
  }

  // 5. POSITIVE: MEDIUM (Helping/Speaking Up)
  if (lowerText.includes('help') || lowerText.includes('spoke up') || lowerText.includes('clear') || lowerText.includes('kind')) {
    return {
      type: 'DEPOSIT',
      amount: calc(15),
      action: 'Positive Contribution',
      severity: 'MEDIUM',
      explanation: "Small acts of kindness and clear communication are steady deposits."
    };
  }

  // 6. POSITIVE: LOW (Practice/Routine)
  if (lowerText.includes('practice') || lowerText.includes('piano') || lowerText.includes('music') || lowerText.includes('homework')) {
    return {
      type: 'DEPOSIT',
      amount: calc(10),
      action: 'Consistency',
      severity: 'LOW',
      explanation: "Consistency in your daily responsibilities builds a foundation of reliability."
    };
  }

  return null;
};