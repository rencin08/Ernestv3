
import React, { useState, useRef } from 'react';
import { Block, BlockType } from '../types';
import BlockWrapper from './BlockWrapper';
import { Plus, Type, CheckSquare, Mic, Shield, Camera, ImageIcon, Send } from 'lucide-react';

interface SpatialCanvasProps {
  blocks: Block[];
  onUpdate: (blocks: Block[]) => void;
  onExpand: (id: string) => void;
  readOnly?: boolean;
}

const SpatialCanvas: React.FC<SpatialCanvasProps> = ({ blocks, onUpdate, onExpand, readOnly = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [quickText, setQuickText] = useState('');

  const addBlock = (type: BlockType, initialContent?: string, initialImage?: string) => {
    if (readOnly) return;
    
    const newBlock: Block = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      x: 0,
      y: 0,
      width: 1,
      // Removed fixed height to allow auto-scaling by default
      content: initialContent || (
        type === 'text' ? 'Untitled' : 
        type === 'todo' ? 'Today\'s Checklist' : 
        type === 'quote' ? 'Daily Wisdom' : 
        type === 'voice' ? 'Audio Memo' :
        type === 'locked' ? 'Private' : ''
      ),
      body: '',
      images: initialImage ? [initialImage] : [],
      tags: [],
      todos: type === 'todo' ? [{ id: '1', text: 'First task', completed: false }] : [],
      color: 'bg-white',
      createdAt: Date.now(),
    };

    onUpdate([newBlock, ...blocks]);
    setIsMenuOpen(false);
    if (!initialContent && !initialImage) {
      onExpand(newBlock.id);
    }
  };

  const handleQuickSubmit = () => {
    if (!quickText.trim()) return;
    addBlock('text', quickText.trim());
    setQuickText('');
  };

  const handleFileSelection = (capture?: boolean) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    if (capture) input.setAttribute('capture', 'environment');
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (re) => {
          addBlock('text', 'Image Capture', re.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleBlockChange = (updatedBlock: Block) => {
    onUpdate(blocks.map(b => b.id === updatedBlock.id ? updatedBlock : b));
  };

  const handleBlockDelete = (id: string) => {
    onUpdate(blocks.filter(b => b.id !== id));
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative overflow-y-auto overflow-x-hidden pb-40 iphone-content"
    >
      {!readOnly && (
        <div className="px-6 pt-2 mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="relative group">
            <div className="absolute inset-0 bg-black/5 rounded-[32px] translate-y-1 opacity-0 group-focus-within:opacity-100 transition-all blur-sm" />
            <div className="relative flex items-center bg-white border border-neutral-100 rounded-[32px] px-6 py-4 shadow-[0_4px_25px_rgba(0,0,0,0.02)] focus-within:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all">
               <input 
                type="text" 
                placeholder="What are you thinking? Type..."
                value={quickText}
                onChange={(e) => setQuickText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuickSubmit()}
                className="flex-1 bg-transparent border-none outline-none text-[15px] font-medium text-neutral-800 placeholder:text-neutral-300"
              />
              <button 
                onClick={handleQuickSubmit}
                className={`p-2.5 rounded-2xl transition-all duration-300 ${quickText.trim() ? 'bg-black text-white scale-100 shadow-lg' : 'bg-neutral-50 text-neutral-200 scale-90'}`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid-style Layout */}
      <div className="px-6 grid grid-cols-2 gap-5 auto-rows-min">
        {blocks.map(block => (
          <BlockWrapper 
            key={block.id}
            block={block} 
            onChange={handleBlockChange} 
            onDelete={() => handleBlockDelete(block.id)}
            onExpand={() => onExpand(block.id)}
            readOnly={readOnly}
          />
        ))}
        
        {blocks.length === 0 && (
          <div className="col-span-2 flex flex-col items-center justify-center p-12 text-center pointer-events-none opacity-40 mt-16">
             <div className="w-20 h-20 bg-neutral-50 rounded-[40px] flex items-center justify-center mb-6">
                <Plus size={32} className="text-neutral-200" />
             </div>
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-neutral-300">Clean canvas. Pure focus.</p>
          </div>
        )}
      </div>

      {!readOnly && (
        <div className="fixed bottom-10 right-8 z-[80] flex flex-col items-end gap-3">
          {isMenuOpen && (
            <div className="bg-white border border-neutral-100 p-2.5 rounded-[40px] shadow-[0_30px_90px_rgba(0,0,0,0.2)] flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-300 origin-bottom-right">
              <button onClick={() => addBlock('text')} className="flex items-center gap-5 px-6 py-4 hover:bg-neutral-50 rounded-[30px] transition-all group active:scale-95">
                <Type size={20} className="text-neutral-300 group-hover:text-neutral-800" /> 
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-800">Note</span>
              </button>
              <button onClick={() => addBlock('todo')} className="flex items-center gap-5 px-6 py-4 hover:bg-neutral-50 rounded-[30px] transition-all group active:scale-95">
                <CheckSquare size={20} className="text-neutral-300 group-hover:text-neutral-800" /> 
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-800">Task</span>
              </button>
              <button onClick={() => handleFileSelection(true)} className="flex items-center gap-5 px-6 py-4 hover:bg-neutral-50 rounded-[30px] transition-all group active:scale-95">
                <Camera size={20} className="text-neutral-300 group-hover:text-neutral-800" /> 
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-800">Camera</span>
              </button>
              <button onClick={() => handleFileSelection(false)} className="flex items-center gap-5 px-6 py-4 hover:bg-neutral-50 rounded-[30px] transition-all group active:scale-95">
                <ImageIcon size={20} className="text-neutral-300 group-hover:text-neutral-800" /> 
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-800">Photo</span>
              </button>
              <button onClick={() => addBlock('voice')} className="flex items-center gap-5 px-6 py-4 hover:bg-neutral-50 rounded-[30px] transition-all group active:scale-95">
                <Mic size={20} className="text-neutral-300 group-hover:text-neutral-800" /> 
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-800">Audio</span>
              </button>
              <button onClick={() => addBlock('locked')} className="flex items-center gap-5 px-6 py-4 hover:bg-neutral-50 rounded-[30px] transition-all group active:scale-95">
                <Shield size={20} className="text-neutral-300 group-hover:text-neutral-800" /> 
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-800">Lock</span>
              </button>
            </div>
          )}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`w-16 h-16 rounded-[28px] flex items-center justify-center border-none shadow-[0_15px_40px_rgba(0,0,0,0.25)] active:scale-90 transition-all duration-500 ${isMenuOpen ? 'bg-white text-neutral-800 rotate-90' : 'bg-neutral-900 text-white'}`}
          >
            <Plus size={32} className={`transition-transform duration-500 ${isMenuOpen ? 'rotate-45' : ''}`} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SpatialCanvas;
