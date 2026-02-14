import { TrustAccount, Transaction, AIStrictness } from '../types/trust';

export const getAIResponse = (
  accountId: string | 'global', 
  text: string, 
  accounts: TrustAccount[], 
  transaction?: Transaction | null
) => {
  const lowerText = text.toLowerCase();
  const account = accountId === 'global' ? null : accounts.find(a => a.id === accountId);
  const overallScore = Math.round(accounts.reduce((acc, curr) => acc + curr.balance, 0) / accounts.length);
  
  // 1. Handle Transaction Results (The most important part)
  if (transaction) {
    const isDeposit = transaction.type === 'DEPOSIT';
    const amount = transaction.amount;
    
    if (accountId === 'global') {
      return `Global System Update: A ${transaction.type} of ${amount} points has been logged. Your overall integrity score is now ${overallScore}. ${isDeposit ? "Keep this momentum." : "This pattern is concerning for your global reputation."}`;
    }

    const responses = isDeposit ? [
      `Excellent work. That's a solid +${amount} deposit. ${account?.person} values this kind of consistency.`,
      `I've logged that. +${amount} points. You're proving that you can be trusted with the small things.`,
      `Nice! Your balance with ${account?.person} is climbing. This is how you build a real foundation.`
    ] : [
      `That's a hit. -${amount} points. ${account?.person}'s trust is fragile right now.`,
      `Withdrawal confirmed. -${amount} points. Remember: trust takes years to build and seconds to break.`,
      `Ouch. This brings your balance down to ${transaction.newBalance}. We need to reverse this trend.`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  // 2. Global Coach Logic (Big Picture)
  if (accountId === 'global') {
    if (lowerText.includes('score') || lowerText.includes('how am i doing')) {
      if (overallScore >= 750) return `Your global standing is Excellent (${overallScore}). You are a person of high integrity. Keep protecting your reputation.`;
      if (overallScore >= 600) return `You're doing okay (${overallScore}), but there's room for improvement. Focus on the accounts below 600.`;
      return `Warning: Your global integrity is low (${overallScore}). You need to prioritize radical honesty immediately.`;
    }
    
    if (lowerText.includes('lie') || lowerText.includes('dishonest')) {
      const totalLies = accounts.reduce((a, b) => a + b.lieCount, 0);
      return `I see ${totalLies} recorded instances of dishonesty across all accounts. Each one creates a 'trust debt' that is expensive to pay back.`;
    }

    return "I am the Integrity Coach. I monitor your behavior across all relationships. Ask me about your overall score or for advice on a specific person.";
  }

  // 3. Specific Account Logic
  if (account) {
    if (lowerText.includes('status') || lowerText.includes('balance')) {
      return `Your current balance with ${account.person} is ${account.balance}. Your goal is ${account.goal}. You are ${Math.max(0, account.goal - account.balance)} points away.`;
    }

    if (lowerText.includes('help') || lowerText.includes('advice')) {
      if (account.balance < 500) return `Priority #1: Stop the withdrawals. Don't make any promises you can't keep for the next 48 hours.`;
      return `To reach your goal with ${account.person}, focus on 'Radical Honesty'—admitting small mistakes before they are found out.`;
    }
  }

  // 4. Fallback Greetings
  const greetings = ["I'm listening.", "How can I help with your integrity today?", "Logged and noted. What else?", "I'm here to help you stay accountable."];
  return greetings[Math.floor(Math.random() * greetings.length)];
};