import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 1000); // Wait for exit animation
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
          transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black"
        >
          {/* Aurora Background for Splash */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative"
            >
              {/* Logo Icon */}
              <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.4)] relative z-10">
                <ShieldCheck size={48} className="text-white" strokeWidth={2.5} />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-8px] border-2 border-white/10 rounded-[3rem]"
                />
              </div>
              
              {/* Sparkle Effects */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-4 -right-4 text-purple-400"
              >
                <Sparkles size={24} />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-8 text-center"
            >
              <h1 className="text-4xl font-black tracking-tighter text-white mb-2">
                TrustBank
              </h1>
              <div className="flex items-center gap-2 justify-center">
                <div className="h-[1px] w-8 bg-white/20" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
                  Integrity Protocol
                </span>
                <div className="h-[1px] w-8 bg-white/20" />
              </div>
            </motion.div>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 200 }}
              transition={{ delay: 0.8, duration: 1.5, ease: "easeInOut" }}
              className="mt-12 h-1 bg-white/10 rounded-full overflow-hidden"
            >
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ delay: 0.8, duration: 1.5, ease: "easeInOut" }}
                className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;