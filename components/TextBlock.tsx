
import React, { useState, useRef } from 'react';
import { Block } from '../types';

interface TextBlockProps {
  block: Block;
  onChange: (block: Block) => void;
  readOnly?: boolean;
}

const TextBlock: React.FC<TextBlockProps> = ({ block }) => {
  const images = block.images || [];
  const hasImages = images.length > 0;
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.offsetWidth;
    const index = Math.round(scrollLeft / width);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };
  
  return (
    <div className="flex flex-col h-full w-full">
      {hasImages && (
        <div className="relative group/carousel interactive-item shrink-0 overflow-hidden w-full">
          <div 
            ref={scrollRef}
            className="h-36 w-full overflow-x-auto scroll-smooth flex snap-x snap-mandatory hide-scrollbar bg-neutral-50 touch-pan-x cursor-grab active:cursor-grabbing"
            onScroll={handleScroll}
          >
            {images.map((img, i) => (
              <div key={i} className="min-w-full h-full snap-center overflow-hidden flex-shrink-0">
                <img 
                  src={img} 
                  className="w-full h-full object-cover select-none" 
                  alt={`Note preview ${i}`} 
                  draggable={false}
                />
              </div>
            ))}
          </div>
          
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 p-1.5 bg-black/5 backdrop-blur-sm rounded-full">
              {images.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 rounded-full transition-all duration-300 ${i === activeIndex ? 'bg-white w-4' : 'bg-white/40 w-1'}`} 
                />
              ))}
            </div>
          )}
        </div>
      )}
      <div className={`p-6 flex flex-col gap-2.5 overflow-hidden flex-1 ${hasImages ? 'pt-4' : 'pt-10'}`}>
        <h4 className="font-bold text-[14px] text-neutral-900 leading-[1.3] line-clamp-2">
          {block.content}
        </h4>
        <p className="text-[12px] text-neutral-400 leading-relaxed line-clamp-4 font-medium">
          {block.body || 'No additional details...'}
        </p>
      </div>
    </div>
  );
};

export default TextBlock;
