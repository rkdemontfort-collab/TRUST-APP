import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Message, TrustAccount } from '../types/trust';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ChatInterfaceProps {
  account: TrustAccount;
  messages: Message[];
  onSendMessage: (text: string) => void;
}

const ChatInterface = ({ account, messages, onSendMessage }: ChatInterfaceProps) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
    setIsTyping(true);
    
    // Simulate typing delay
    setTimeout(() => setIsTyping(false), 800);
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
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                <span className="text-3xl">{account.emoji}</span>
              </div>
              <p className="font-medium text-white/60">Chat with {account.person}'s Assistant</p>
              <p className="text-xs mt-1">Log your actions or just say hi.</p>
            </motion.div>
          )}
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn("flex", msg.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              <div className={cn(
                "max-w-[85%] rounded-2xl p-4 shadow-lg",
                msg.role === 'user' 
                  ? 'bg-purple-600 text-white rounded-tr-none' 
                  : 'bg-white/10 text-white/90 backdrop-blur-md border border-white/10 rounded-tl-none'
              )}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <div className="flex items-center justify-between mt-2 opacity-40">
                  <span className="text-[9px]">
                    {format(new Date(msg.timestamp), 'HH:mm')}
                  </span>
                  {msg.transactionId && (
                    <Sparkles size={10} className="text-purple-300" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white/5 rounded-2xl p-3 rounded-tl-none flex gap-1">
                <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 border-t border-white/10 space-y-4 bg-black/20">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => setInput(s)}
              className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/60 hover:bg-white/10 hover:text-white transition-colors"
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
            placeholder={`Message ${account.person}'s bot...`}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl h-11"
          />
          <Button onClick={handleSend} className="bg-purple-600 hover:bg-purple-700 rounded-xl h-11 px-5">
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;