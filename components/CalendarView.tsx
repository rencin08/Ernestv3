
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Canvas } from '../types';

interface CalendarViewProps {
  archive: Canvas[];
  onSelectDate: (date: string) => void;
  activeDate: string;
}

const CalendarView: React.FC<CalendarViewProps> = ({ archive, onSelectDate, activeDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    
    // Fill leading empty days
    const firstDayIndex = date.getDay(); // 0 is Sunday
    // Adjust to Monday start if preferred, but standard is Sunday. Let's stick to Sunday for MVP.
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }

    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [currentMonth]);

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  
  const entriesThisMonth = useMemo(() => {
    const prefix = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
    return archive.filter(c => c.date.startsWith(prefix) && c.blocks.length > 0).length;
  }, [archive, currentMonth]);

  const goal = 20;
  const progress = Math.min(100, (entriesThisMonth / goal) * 100);

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const hasEntries = (date: Date) => {
    const dStr = date.toISOString().split('T')[0];
    return archive.find(c => c.date === dStr && c.blocks.length > 0);
  };

  const isToday = (date: Date) => {
    return date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
  };

  const isSelected = (date: Date) => {
    return date.toISOString().split('T')[0] === activeDate;
  };

  return (
    <div className="bg-white rounded-[40px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-neutral-100 mb-6">
      <div className="flex items-center justify-between mb-2">
        <button onClick={prevMonth} className="p-2 text-neutral-300 hover:text-black transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-300 mb-1">MONTHLY OVERVIEW</p>
          <h2 className="text-xl font-serif text-neutral-800 tracking-tight">{monthName}</h2>
        </div>
        <button onClick={nextMonth} className="p-2 text-neutral-300 hover:text-black transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">MONTHLY PROGRESS</p>
          <p className="text-[10px] font-black uppercase text-[#FF8A65] tracking-widest">{entriesThisMonth}/{goal} ENTRIES</p>
        </div>
        <div className="h-1.5 w-full bg-neutral-50 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#FF8A65] transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        <p className="text-[8px] italic text-neutral-300 mt-2 text-center">Goal: 15 entries to unlock a new sticker!</p>
      </div>

      <div className="grid grid-cols-7 gap-y-4 mb-4">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="text-[10px] font-bold text-neutral-300 text-center">{d}</div>
        ))}
        {daysInMonth.map((date, i) => (
          <div key={i} className="flex flex-col items-center justify-center h-10 relative">
            {date ? (
              <button 
                onClick={() => onSelectDate(date.toISOString().split('T')[0])}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all
                  ${isSelected(date) ? 'bg-[#FF8A65] text-white shadow-lg shadow-[#FF8A65]/30' : 'text-neutral-400 hover:bg-neutral-50'}
                  ${isToday(date) && !isSelected(date) ? 'border border-[#FF8A65]/30' : ''}
                `}
              >
                {date.getDate()}
              </button>
            ) : null}
            {date && hasEntries(date) && (
              <div className={`absolute bottom-0 w-1 h-1 rounded-full ${isSelected(date) ? 'bg-white' : 'bg-[#A7FFEB]'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Mascot Message */}
      <div className="bg-[#FFF8F5] rounded-3xl p-4 flex items-center gap-4 mt-4 border border-[#FF8A65]/10">
        <div className="w-12 h-12 bg-[#A7FFEB] rounded-2xl flex-shrink-0 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
           <img src="https://api.dicebear.com/7.x/bottts/svg?seed=CindyMascot&backgroundColor=A7FFEB" alt="Mascot" className="w-10 h-10" />
        </div>
        <p className="text-[10px] font-medium leading-relaxed text-neutral-600 italic">
          "You've written {entriesThisMonth} times this week, I'm so proud of you! Keep going, Cindy!"
        </p>
      </div>
    </div>
  );
};

export default CalendarView;
