
import React from 'react';
import { Block } from '../types';
import { Quote } from 'lucide-react';

const QuoteBlock: React.FC<{ block: Block; onChange: (b: Block) => void; readOnly?: boolean }> = ({ block, onChange, readOnly }) => {
  return (
    <div className="p-5 h-full bg-[#FFF9C4] flex flex-col justify-start">
      <Quote size={20} className="text-black mb-4" />
      <textarea
        value={block.content}
        readOnly={readOnly}
        onChange={(e) => onChange({ ...block, content: e.target.value })}
        className="w-full bg-transparent border-none outline-none text-sm font-black italic leading-tight text-black resize-none ignore-drag"
        placeholder="Add quote..."
      />
    </div>
  );
};

export default QuoteBlock;
