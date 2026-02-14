import React, { useState } from 'react';
import GlassCard from './GlassCard';
import { GraduationCap, CheckCircle2, Clock, ExternalLink, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: 'PENDING' | 'COMPLETED';
}

const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Calculus Problem Set 4', course: 'Advanced Math', dueDate: 'Tomorrow, 11:59 PM', status: 'PENDING' },
  { id: '2', title: 'History Essay: The Industrial Revolution', course: 'World History', dueDate: 'Friday, 3:00 PM', status: 'PENDING' },
  { id: '3', title: 'Physics Lab Report', course: 'Physics II', dueDate: 'Next Monday', status: 'PENDING' },
];

const ClassroomTodo = () => {
  const [isConnected, setIsConnected] = useState(false);

  if (!isConnected) {
    return (
      <GlassCard className="flex flex-col items-center justify-center text-center py-12 bg-blue-500/5 border-blue-500/20">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-4">
          <GraduationCap className="text-blue-400" size={32} />
        </div>
        <h3 className="text-xl font-black tracking-tight mb-2">Google Classroom</h3>
        <p className="text-sm text-foreground/50 max-w-xs mb-6">
          Connect your school account to sync your assignments with your integrity goals.
        </p>
        <Button 
          onClick={() => setIsConnected(true)}
          className="rounded-full bg-blue-600 hover:bg-blue-700 px-8 font-bold gap-2"
        >
          <Lock size={16} />
          Connect Classroom
        </Button>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-sm font-black uppercase tracking-widest text-blue-400 flex items-center gap-2">
          <GraduationCap size={18} /> Classroom Tasks
        </h3>
        <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
          {MOCK_TASKS.length} Active
        </span>
      </div>

      <div className="space-y-3">
        {MOCK_TASKS.map((task) => (
          <GlassCard key={task.id} className="p-4 border-white/10 hover:border-blue-500/30 transition-colors group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{task.course}</span>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink size={14} className="text-foreground/30 hover:text-blue-400" />
              </button>
            </div>
            <h4 className="font-bold text-sm mb-3">{task.title}</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-foreground/40">
                <Clock size={12} />
                {task.dueDate}
              </div>
              <button className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all">
                <CheckCircle2 size={14} className="text-foreground/20 hover:text-emerald-500" />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default ClassroomTodo;