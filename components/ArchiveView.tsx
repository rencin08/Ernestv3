
import React from 'react';
import { Canvas } from '../types';
import { ChevronRight, FileText, CheckCircle2, Image as ImageIcon } from 'lucide-react';

interface ArchiveViewProps {
  archive: Canvas[];
  onSelectDate: (date: string) => void;
}

const ArchiveView: React.FC<ArchiveViewProps> = ({ archive, onSelectDate }) => {
  const sortedArchive = [...archive].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="h-full w-full overflow-y-auto bg-white flex flex-col items-center pt-8 pb-12 px-5 iphone-content">
      <div className="w-full">
        <h2 className="text-3xl font-black uppercase tracking-tight text-neutral-900 mb-1">HISTORY</h2>
        <p className="text-[10px] font-bold text-neutral-400 mb-8 uppercase">ARCHIVED MOMENTS</p>

        <div className="space-y-4">
          {sortedArchive.length === 0 ? (
            <div className="text-center py-20 text-neutral-300">
              <p className="font-bold text-xs">No archives yet.</p>
            </div>
          ) : (
            sortedArchive.map(canvas => (
              <button
                key={canvas.date}
                onClick={() => onSelectDate(canvas.date)}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#fcfcfc] border-2 border-black hover:bg-neutral-50 transition-all group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
              >
                <div className="flex flex-col items-start">
                  <span className="text-sm font-black text-black uppercase">
                    {new Date(canvas.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[9px] font-bold text-neutral-400">{canvas.blocks.length} ITEMS</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-black" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ArchiveView;
