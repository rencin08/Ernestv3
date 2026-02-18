
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AppState, Canvas, Block, BlockType } from './types';
import { loadAppState, saveAppState, getTodayDateString, updateCanvas } from './utils/storage';
import SpatialCanvas from './components/SpatialCanvas';
import CollectionsView from './components/CollectionsView';
import ExpandedBlock from './components/ExpandedBlock';
import { Search, MoreHorizontal, Plus, Calendar, Camera, ImageIcon, ListFilter, X } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'today' | 'folders'>('today');
  const [state, setState] = useState<AppState>(loadAppState());
  const [activeDate, setActiveDate] = useState<string>(getTodayDateString());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [expandedBlockId, setExpandedBlockId] = useState<string | null>(null);

  useEffect(() => {
    setState(loadAppState());
  }, []);

  const allBlocks = useMemo(() => {
    return state.archive.flatMap(c => c.blocks);
  }, [state.archive]);

  const currentCanvas = useMemo(() => 
    state.archive.find(c => c.date === activeDate) || {
      id: activeDate,
      date: activeDate,
      blocks: []
    }
  , [state.archive, activeDate]);

  const handleUpdateBlocks = useCallback((blocks: Block[]) => {
    const newState = updateCanvas(activeDate, blocks);
    setState(newState);
  }, [activeDate]);

  // Combined filtering for Search + Collection
  // If a collection is active, we show blocks from ALL archives (global view)
  const filteredBlocks = useMemo(() => {
    let base = activeCollection ? allBlocks : currentCanvas.blocks;
    
    if (activeCollection) {
      base = base.filter(b => b.tags?.some(t => t.toLowerCase() === activeCollection.toLowerCase()));
    }
    
    return base.filter(b => 
      b.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (b.body && b.body.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [currentCanvas.blocks, allBlocks, searchQuery, activeCollection]);

  const expandedBlock = allBlocks.find(b => b.id === expandedBlockId);

  const handleUpdateSpecificBlock = (updated: Block) => {
    const targetCanvas = state.archive.find(c => c.blocks.some(b => b.id === updated.id));
    if (targetCanvas) {
      const newBlocks = targetCanvas.blocks.map(b => b.id === updated.id ? updated : b);
      const newState = updateCanvas(targetCanvas.date, newBlocks);
      setState(newState);
    }
  };

  const handleSelectCalendarDate = (date: string) => {
    setActiveDate(date);
    setActiveCollection(null);
    setActiveTab('today');
  };

  const handleSelectCollection = (collection: string) => {
    setActiveCollection(collection);
    setActiveTab('today');
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen p-4 bg-neutral-100">
      <div className="scale-[0.8] lg:scale-[0.9] origin-center">
        <div className="relative w-[375px] h-[812px] bg-white rounded-[60px] border-[12px] border-neutral-900 shadow-[0_40px_100px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col">
          
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-full z-[100] flex items-center justify-between px-4">
            <div className="w-1.5 h-1.5 bg-[#1a1a1a] rounded-full" />
          </div>

          <div className="flex-1 flex flex-col bg-[#FAFAFA] overflow-hidden relative">
            <div className="h-10 shrink-0" />

            <header className="px-6 pt-4 shrink-0 z-40">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFD54F] overflow-hidden border border-neutral-100 shadow-sm flex items-center justify-center">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=FFD54F" alt="Avatar" className="w-full h-full" />
                  </div>
                  <h1 className="text-xl font-bold text-neutral-800 tracking-tight">My Notes</h1>
                </div>
                <button className="p-2 border border-neutral-100 rounded-full bg-white hover:bg-neutral-50 transition-all shadow-sm active:scale-95">
                  <MoreHorizontal size={20} className="text-neutral-400" />
                </button>
              </div>

              <div className="relative flex items-center gap-3 mb-4">
                <div className="flex-1 relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" />
                  <input 
                    type="text" 
                    placeholder="Search Note..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-neutral-100/50 border border-neutral-100 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium placeholder:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-200 transition-all"
                  />
                </div>
                <button className="p-3 bg-neutral-100/50 border border-neutral-100 rounded-2xl text-neutral-400">
                  <ListFilter size={18} />
                </button>
              </div>

              {activeCollection && (
                <div className="flex items-center gap-2 mb-4 animate-in fade-in slide-in-from-left-2 duration-300">
                  <div className="px-3 py-1.5 bg-black text-white text-[9px] font-black uppercase rounded-full flex items-center gap-2 tracking-widest">
                    {activeCollection}
                    <button onClick={() => setActiveCollection(null)}>
                      <X size={12} />
                    </button>
                  </div>
                </div>
              )}

              <div className="relative flex items-center mb-6">
                <div className="absolute inset-x-0 h-[1px] bg-neutral-100" />
                <div className="relative flex gap-8">
                  <button 
                    onClick={() => setActiveTab('today')}
                    className={`text-[11px] font-black uppercase tracking-widest pb-3 transition-all relative z-10 ${activeTab === 'today' ? 'text-black border-b-2 border-black' : 'text-neutral-300'}`}
                  >
                    CANVAS
                  </button>
                  <button 
                    onClick={() => setActiveTab('folders')}
                    className={`text-[11px] font-black uppercase tracking-widest pb-3 transition-all relative z-10 ${activeTab === 'folders' ? 'text-black border-b-2 border-black' : 'text-neutral-300'}`}
                  >
                    FOLDERS
                  </button>
                </div>
              </div>
            </header>

            <main className="flex-1 relative overflow-hidden iphone-content">
              {activeTab === 'today' ? (
                <div className="flex flex-col h-full animate-in fade-in duration-300">
                  <SpatialCanvas 
                    blocks={filteredBlocks} 
                    onUpdate={handleUpdateBlocks}
                    onExpand={setExpandedBlockId}
                    readOnly={activeDate !== getTodayDateString()}
                  />
                </div>
              ) : (
                <div className="h-full animate-in fade-in duration-300">
                  <CollectionsView 
                    allBlocks={allBlocks} 
                    archive={state.archive}
                    onSelectDate={handleSelectCalendarDate}
                    onSelectCollection={handleSelectCollection}
                    activeDate={activeDate}
                  />
                </div>
              )}
            </main>

            {expandedBlock && (
              <ExpandedBlock 
                block={expandedBlock} 
                onClose={() => setExpandedBlockId(null)}
                onChange={handleUpdateSpecificBlock}
              />
            )}

            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-neutral-200 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
