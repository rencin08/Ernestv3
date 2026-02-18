
import React, { useMemo } from 'react';
import { Block, Canvas } from '../types';
import { Heart, Settings, Plus, Package, Tag, DollarSign, Utensils, Shirt, Activity, Lightbulb } from 'lucide-react';
import CalendarView from './CalendarView';

interface CollectionsViewProps {
  allBlocks: Block[];
  archive: Canvas[];
  onSelectDate: (date: string) => void;
  onSelectCollection: (collection: string) => void;
  activeDate: string;
}

const CollectionsView: React.FC<CollectionsViewProps> = ({ allBlocks, archive, onSelectDate, onSelectCollection, activeDate }) => {
  const collections = useMemo(() => {
    const map: Record<string, Block[]> = {};
    allBlocks.forEach(block => {
      if (block.tags && block.tags.length > 0) {
        block.tags.forEach(tag => {
          const lowerTag = tag.toLowerCase();
          if (!map[lowerTag]) map[lowerTag] = [];
          map[lowerTag].push(block);
        });
      }
    });
    return map;
  }, [allBlocks]);

  const getIconForTag = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('love')) return <Heart size={28} strokeWidth={2} fill="#FFCDD2" className="text-[#E57373]" />;
    if (n.includes('project')) return <Settings size={28} strokeWidth={2} className="text-[#90A4AE]" />;
    if (n.includes('health')) return <Activity size={28} strokeWidth={2} className="text-[#81C784]" />;
    if (n.includes('idea')) return <Lightbulb size={28} strokeWidth={2} className="text-[#FFF176]" />;
    if (n.includes('archive')) return <Package size={28} strokeWidth={2} className="text-[#BDBDBD]" />;
    if (n.includes('finance') || n.includes('money')) return <DollarSign size={28} strokeWidth={2} className="text-[#FFF176]" />;
    if (n.includes('food') || n.includes('eat')) return <Utensils size={28} strokeWidth={2} className="text-[#FF8A65]" />;
    if (n.includes('fashion') || n.includes('style')) return <Shirt size={28} strokeWidth={2} className="text-[#F06292]" />;
    return <Tag size={28} strokeWidth={2} className="text-neutral-300" />;
  };

  const defaultFolderNames = ['LOVE', 'PROJECTS', 'HEALTH', 'IDEAS', 'ARCHIVE'];
  
  const allFolderNames = useMemo(() => {
    const tagsFromNotes = Object.keys(collections).map(t => t.toUpperCase());
    const combined = Array.from(new Set([...defaultFolderNames, ...tagsFromNotes]));
    return combined;
  }, [collections]);

  return (
    <div className="px-6 py-2 iphone-content h-full overflow-y-auto pb-32">
      <CalendarView archive={archive} onSelectDate={onSelectDate} activeDate={activeDate} />

      <div className="mb-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-300 mb-4 px-2">YOUR SYSTEMS</h3>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
        {allFolderNames.map((folder) => (
          <button 
            key={folder}
            onClick={() => onSelectCollection(folder)}
            className="aspect-square bg-white border border-neutral-100 rounded-[32px] p-5 flex flex-col items-center justify-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all relative group overflow-hidden active:scale-95"
          >
            <div className="absolute top-4 left-4 text-neutral-200 group-hover:text-yellow-400 transition-colors">
              <span className="text-[12px]">★</span>
            </div>
            
            <div className="mb-1">
              {getIconForTag(folder)}
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-800">{folder}</span>
              {collections[folder.toLowerCase()] && (
                <span className="text-[7px] font-black text-neutral-300 uppercase tracking-widest mt-0.5">
                  {collections[folder.toLowerCase()].length} RECORDS
                </span>
              )}
            </div>
          </button>
        ))}

        <button 
          className="col-span-2 h-14 bg-neutral-50/50 border border-dashed border-neutral-200 rounded-[20px] flex items-center justify-center gap-3 text-neutral-300 hover:text-neutral-500 hover:border-neutral-300 transition-all active:scale-[0.98]"
        >
          <Plus size={18} />
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">ADD NEW SYSTEM</span>
        </button>
      </div>
    </div>
  );
};

export default CollectionsView;
