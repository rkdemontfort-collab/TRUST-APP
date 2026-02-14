import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import ClassroomTodo from '../components/ClassroomTodo';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Star, Zap } from 'lucide-react';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Mock events for the calendar
  const events = [
    { date: new Date(), type: 'DEPOSIT', title: 'Piano Practice' },
    { date: new Date(), type: 'WITHDRAWAL', title: 'Late Homework' },
  ];

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h1 className="text-5xl font-black tracking-tighter">Calendar</h1>
        <p className="text-lg text-foreground/50 font-medium">Track your integrity over time</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-8 border-none bg-white/20 dark:bg-white/5">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <CalendarIcon className="text-primary" size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight">
                    {date ? format(date, 'MMMM yyyy') : 'Select Date'}
                  </h2>
                  <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest">Integrity Timeline</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <CalendarUI
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-[2rem] border-none p-0"
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-4 w-full",
                  caption: "hidden",
                  nav: "hidden",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex justify-between mb-4",
                  head_cell: "text-foreground/30 rounded-md w-12 font-black text-[10px] uppercase tracking-widest",
                  row: "flex w-full mt-2 justify-between",
                  cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                  day: cn(
                    "h-12 w-12 p-0 font-bold aria-selected:opacity-100 rounded-2xl transition-all hover:bg-white/10",
                  ),
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-lg shadow-primary/30",
                  day_today: "bg-white/10 text-foreground",
                  day_outside: "text-foreground/10 opacity-50",
                  day_disabled: "text-foreground/10 opacity-50",
                  day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                  day_hidden: "invisible",
                }}
              />
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-6 bg-emerald-500/5 border-emerald-500/20">
              <h3 className="text-sm font-black uppercase tracking-widest text-emerald-500 mb-4 flex items-center gap-2">
                <Star size={16} /> Daily Wins
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-xs">+15</div>
                  <span className="text-sm font-medium">Piano Practice</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 bg-rose-500/5 border-rose-500/20">
              <h3 className="text-sm font-black uppercase tracking-widest text-rose-500 mb-4 flex items-center gap-2">
                <Zap size={16} /> Areas for Growth
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-500 font-bold text-xs">-10</div>
                  <span className="text-sm font-medium">Late Homework</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        <div className="lg:col-span-1">
          <ClassroomTodo />
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;