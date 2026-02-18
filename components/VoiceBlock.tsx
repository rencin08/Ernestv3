
import React from 'react';
import { Block } from '../types';
import { Mic, MoreVertical } from 'lucide-react';

const VoiceBlock: React.FC<{ block: Block; onChange: (b: Block) => void; readOnly?: boolean }> = ({ block }) => {
  return (
    <div className="p-4 flex flex-col h-full bg-[#E3F2FD]">
      <div className="flex justify-between items-center mb-4">
        <Mic size={18} className="text-black" />
        <MoreVertical size={16} className="text-neutral-400" />
      </div>
      
      <div className="flex-1 flex items-center justify-center gap-1 mb-4">
        {[2, 4, 3, 6, 2, 5, 3].map((h, i) => (
          <div key={i} className="w-1 bg-black rounded-full" style={{ height: `${h * 4}px` }} />
        ))}
      </div>

      <p className="text-[10px] font-black uppercase tracking-tighter text-black truncate">
        {block.content}
      </p>
    </div>
  );
};

export default VoiceBlock;
