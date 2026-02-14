import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GlassCard from './GlassCard';
import { Message, TrustAccount } from '../types/trust';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

interface ChatInterfaceProps {
  account: TrustAccount;
  messages: Message[];
  onSendMessage: (text: string) => void;
}

const ChatInterface = ({ account, messages, onSendMessage }: ChatInterfaceProps) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  const suggestions = [
    "I told the truth about...",
    "I lied about...",
    "I hid some food because...",
    "I resisted buying...",
    "I spoke up in class today",
    "I apologized for..."
  ];

  return (
    <div className="flex flex-col h-[600px]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-center py-10 text-white/40"
            >
              <Sparkles className="mx-auto mb-2 opacity-20" size={48} />
              <p>Talk to me about your day with {account.person}.</p>
              <p className="text-sm">I'll help you track your trust balance.</p>
            </motion.div>
          )}
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'user' 
                  ? 'bg-purple-600 text-white rounded-tr-none' 
                  : 'bg-white/10 text-white/90 backdrop-blur-md border border-white/10 rounded-tl-none'
              }`}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <span className="text-[10px] opacity-50 mt-2 block">
                  {format(new Date(msg.timestamp), 'HH:mm')}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="p-4 border-t border-white/10 space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => setInput(s)}
              className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 hover:bg-white/10 hover:text-white transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Message about ${account.person}...`}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl"
          />
          <Button onClick={handleSend} className="bg-purple-600 hover:bg-purple-700 rounded-xl px-6">
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;