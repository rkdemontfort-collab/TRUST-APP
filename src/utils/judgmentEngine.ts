import { TransactionType, Transaction } from '../types/trust';

interface JudgmentResult {
  type: TransactionType;
  amount: number;
  action: string;
  explanation: string;
}

const RULES = {
  LYING: { keywords: ['lie', 'lied', 'lying', 'dishonest', 'fabricated', 'made up', 'false', 'untruth'], base: 30, range: [25, 40] },
  TRUTH: { keywords: ['truth', 'told truth', 'admitted', 'confessed', 'honest', 'came clean', 'owned up'], base: 25, range: [20, 30] },
  HIDING: { keywords: ['hid', 'hide', 'hidden', 'concealed', 'kept from', 'secretly'], base: 22, range: [20, 25] },
  SHOPPING_IMPULSE: { keywords: ['shopping', 'bought', 'purchased', 'spent', 'impulse', 'online order'], base: 15, range: [10, 20] },
  SHOPPING_RESIST: { keywords: ['resisted', "didn't buy", 'saved money'], base: 15, range: [15, 15] },
  MUMBLE: { keywords: ['mumble', 'mumbled', 'quiet', 'stayed quiet'], base: 8, range: [5, 10] },
  SPEAK_UP: { keywords: ['spoke clearly', 'spoke up', 'expressed', 'shared'], base: 12, range: [10, 15] },
  PUBLIC_SPEAKING: { keywords: ['assembly', 'public', 'presentation'], base: 20, range: [20, 20] },
  ARGUE: { keywords: ['argued', 'argument', 'shouted', 'yelled', 'fought', 'disagreed'], base: 15, range: [15, 15] },
  APOLOGY: { keywords: ['sorry', 'apologized', 'apology', 'regret', 'remorse'], base: 12, range: [10, 15] },
  HELPING: { keywords: ['helped', 'assisted', 'supported'], base: 12, range: [12, 12] },
  LISTENING: { keywords: ['listened', 'understood'], base: 10, range: [10, 10] },
  PROCRASTINATE: { keywords: ['procrastinated', 'delayed', 'put off'], base: 8, range: [8, 8] },
  MUSIC: { keywords: ['practiced', 'music', 'piano', 'instrument'], base: 8, range: [8, 8] },
  KINDNESS: { keywords: ['kind', 'nice', 'thoughtful'], base: 10, range: [10, 10] },
};

export const judgeAction = (text: string, person: string): JudgmentResult | null => {
  const lowerText = text.toLowerCase();
  
  // Special case: Cocoa incident
  if (lowerText.includes('cocoa') || lowerText.includes('chocolate milk')) {
    return {
      type: 'WITHDRAWAL',
      amount: 40,
      action: 'Lying (Cocoa Incident)',
      explanation: `This reminds me of the cocoa incident. Lying about obvious things carries a heavy penalty.`
    };
  }

  // Check rules
  if (RULES.LYING.keywords.some(k => lowerText.includes(k))) {
    const amount = Math.floor(Math.random() * (RULES.LYING.range[1] - RULES.LYING.range[0] + 1)) + RULES.LYING.range[0];
    return { type: 'WITHDRAWAL', amount, action: 'Lying', explanation: 'Dishonesty breaks trust quickly.' };
  }

  if (RULES.TRUTH.keywords.some(k => lowerText.includes(k))) {
    const amount = Math.floor(Math.random() * (RULES.TRUTH.range[1] - RULES.TRUTH.range[0] + 1)) + RULES.TRUTH.range[0];
    return { type: 'DEPOSIT', amount, action: 'Telling the Truth', explanation: 'Honesty is the foundation of trust.' };
  }

  if (RULES.HIDING.keywords.some(k => lowerText.includes(k))) {
    const amount = person === 'Mum' ? 25 : 20;
    return { type: 'WITHDRAWAL', amount, action: 'Hiding Food/Items', explanation: `Hiding things creates distance, especially with ${person}.` };
  }

  if (RULES.SHOPPING_RESIST.keywords.some(k => lowerText.includes(k))) {
    return { type: 'DEPOSIT', amount: 15, action: 'Resisted Impulse', explanation: 'Great job controlling the urge to shop!' };
  }

  if (RULES.SHOPPING_IMPULSE.keywords.some(k => lowerText.includes(k))) {
    return { type: 'WITHDRAWAL', amount: 15, action: 'Impulse Shopping', explanation: 'Financial discipline is part of self-trust.' };
  }

  if (RULES.SPEAK_UP.keywords.some(k => lowerText.includes(k))) {
    const isPublic = RULES.PUBLIC_SPEAKING.keywords.some(k => lowerText.includes(k));
    return { type: 'DEPOSIT', amount: isPublic ? 20 : 12, action: 'Speaking Up', explanation: 'Your voice matters. Well done for speaking clearly.' };
  }

  if (RULES.MUMBLE.keywords.some(k => lowerText.includes(k))) {
    return { type: 'WITHDRAWAL', amount: 8, action: 'Mumbling/Quiet', explanation: 'Communication is key to being understood.' };
  }

  if (RULES.APOLOGY.keywords.some(k => lowerText.includes(k))) {
    return { type: 'DEPOSIT', amount: 12, action: 'Sincere Apology', explanation: 'Owning your mistakes builds respect.' };
  }

  if (RULES.ARGUE.keywords.some(k => lowerText.includes(k))) {
    return { type: 'WITHDRAWAL', amount: 15, action: 'Defensive Arguing', explanation: 'Try to listen before reacting defensively.' };
  }

  if (RULES.HELPING.keywords.some(k => lowerText.includes(k))) return { type: 'DEPOSIT', amount: 12, action: 'Helping', explanation: 'Being helpful strengthens bonds.' };
  if (RULES.KINDNESS.keywords.some(k => lowerText.includes(k))) return { type: 'DEPOSIT', amount: 10, action: 'Kindness', explanation: 'Small acts of kindness go a long way.' };
  if (RULES.MUSIC.keywords.some(k => lowerText.includes(k))) return { type: 'DEPOSIT', amount: 8, action: 'Practice', explanation: 'Consistency in your hobbies builds self-discipline.' };
  if (RULES.PROCRASTINATE.keywords.some(k => lowerText.includes(k))) return { type: 'WITHDRAWAL', amount: 8, action: 'Procrastination', explanation: 'Delaying tasks erodes self-trust.' };

  return null;
};