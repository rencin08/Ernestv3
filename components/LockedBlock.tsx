
import React from 'react';
import { Block } from '../types';
import { Shield } from 'lucide-react';

const LockedBlock: React.FC<{ block: Block }> = ({ block }) => {
  return (
    <div className="p-4 h-full bg-white flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center">
        <Shield size={24} className="text-neutral-900" />
      </div>
      <div className="text-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-800">
          Locked
        </p>
        <p className="text-[8px] text-neutral-300 uppercase tracking-widest mt-1">
          Private Record
        </p>
      </div>
    </div>
  );
};

export default LockedBlock;
