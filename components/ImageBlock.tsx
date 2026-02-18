
import React from 'react';
import { Block } from '../types';

interface ImageBlockProps {
  block: Block;
  onChange: (block: Block) => void;
  readOnly?: boolean;
}

const ImageBlock: React.FC<ImageBlockProps> = ({ block, readOnly }) => {
  return (
    <div className="w-full h-full overflow-hidden bg-neutral-100">
      <img 
        src={block.content} 
        alt="User upload" 
        className="w-full h-full object-cover select-none pointer-events-none" 
      />
    </div>
  );
};

export default ImageBlock;
