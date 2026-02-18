
import React, { useState, useRef, useEffect } from 'react';
import { Block } from '../types';
import TextBlock from './TextBlock';
import TodoBlock from './TodoBlock';
import ImageBlock from './ImageBlock';
import VoiceBlock from './VoiceBlock';
import QuoteBlock from './QuoteBlock';
import LockedBlock from './LockedBlock';
import { MoreVertical, Pin, Maximize2, Minimize2, MoveVertical } from 'lucide-react';

interface BlockWrapperProps {
  block: Block;
  onChange: (block: Block) => void;
  onDelete: () => void;
  onExpand: () => void;
  readOnly?: boolean;
}

const BlockWrapper: React.FC<BlockWrapperProps> = ({ block, onChange, onDelete, onExpand, readOnly }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const blockRef = useRef<HTMLDivElement>(null);

  const renderContent = () => {
    switch (block.type) {
      case 'text': return <TextBlock block={block} onChange={onChange} readOnly={readOnly} />;
      case 'todo': return <TodoBlock block={block} onChange={onChange} readOnly={readOnly} />;
      case 'image': return <ImageBlock block={block} onChange={onChange} readOnly={readOnly} />;
      case 'voice': return <VoiceBlock block={block} onChange={onChange} readOnly={readOnly} />;
      case 'quote': return <QuoteBlock block={block} onChange={onChange} readOnly={readOnly} />;
      case 'locked': return <LockedBlock block={block} />;
      default: return null;
    }
  };

  const toggleWide = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ ...block, width: block.width === 2 ? 1 : 2 });
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    if (readOnly) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setStartY(e.clientY);
    setStartHeight(blockRef.current?.offsetHeight || 160);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const delta = e.clientY - startY;
        onChange({ ...block, height: Math.max(120, startHeight + delta) });
      }
    };
    const handleMouseUp = () => setIsResizing(false);

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, startY, startHeight, block, onChange]);

  const dateString = new Date(block.createdAt).toLocaleDateString(undefined, { 
    month: 'short', 
    day: 'numeric'
  });

  const widthClass = block.width === 2 ? 'col-span-2' : 'col-span-1';

  return (
    <div 
      ref={blockRef}
      className={`relative group cursor-default transition-all overflow-hidden rounded-[32px] ${block.color || 'bg-white'} border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.1)] active:scale-[0.998] flex flex-col w-full ${widthClass}`}
      style={{ height: block.height ? `${block.height}px` : 'auto', minHeight: '120px' }}
      onClick={(e) => {
        // Only expand if the click didn't happen on an interactive element like a button or carousel
        const target = e.target as HTMLElement;
        if (target.closest('.interactive-item')) return;
        onExpand();
      }}
    >
      <div className="absolute top-5 left-5 z-20 pointer-events-none opacity-20 group-hover:opacity-60 transition-opacity">
        <Pin size={14} className="text-neutral-800 rotate-[-45deg]" />
      </div>

      {!readOnly && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex gap-1 interactive-item">
          <button 
            onClick={toggleWide}
            className="p-1.5 bg-white/80 backdrop-blur-md rounded-full text-neutral-400 hover:text-black transition-all shadow-sm"
          >
            {block.width === 2 ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1.5 bg-white/80 backdrop-blur-md rounded-full text-neutral-400 hover:text-red-500 transition-all shadow-sm"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      )}

      {/* Main card content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderContent()}
      </div>

      {/* Footer Info */}
      {(block.type === 'text' || block.type === 'todo' || block.type === 'voice') && (
        <div className="px-6 pb-5 pt-1 shrink-0 flex flex-col gap-2 bg-gradient-to-t from-white via-white/80 to-transparent">
          {block.tags && block.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {block.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-neutral-50 border border-neutral-100 text-neutral-400 text-[7px] font-black rounded-md uppercase tracking-[0.2em]">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <p className="text-[8px] font-bold text-neutral-300 uppercase tracking-[0.2em]">
            {dateString}
          </p>
        </div>
      )}

      {/* Resize Handle */}
      {!readOnly && (
        <div 
          className="absolute bottom-0 right-0 w-12 h-12 cursor-ns-resize z-30 flex items-end justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity interactive-item"
          onMouseDown={handleResizeStart}
        >
          <div className="w-1.5 h-6 bg-neutral-100 rounded-full" />
        </div>
      )}
    </div>
  );
};

export default BlockWrapper;
