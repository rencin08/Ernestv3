
import React, { useState } from 'react';
import { Block, TodoItem } from '../types';
import { X, Plus, Trash2, ImageIcon, Camera, Tag as TagIcon, CheckCircle2, Circle } from 'lucide-react';

interface ExpandedBlockProps {
  block: Block;
  onClose: () => void;
  onChange: (block: Block) => void;
}

const ExpandedBlock: React.FC<ExpandedBlockProps> = ({ block, onClose, onChange }) => {
  const [newTag, setNewTag] = useState('');

  const handleFileSelection = (capture?: boolean) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    if (capture) {
      input.setAttribute('capture', 'environment');
    }
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (re) => {
          const newImages = [...(block.images || []), re.target?.result as string];
          onChange({ ...block, images: newImages });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const removeImage = (index: number) => {
    const newImages = (block.images || []).filter((_, i) => i !== index);
    onChange({ ...block, images: newImages });
  };

  const addTag = () => {
    if (!newTag.trim()) return;
    const currentTags = block.tags || [];
    if (!currentTags.includes(newTag.trim())) {
      onChange({ ...block, tags: [...currentTags, newTag.trim()] });
    }
    setNewTag('');
  };

  const removeTag = (tag: string) => {
    const currentTags = block.tags || [];
    onChange({ ...block, tags: currentTags.filter(t => t !== tag) });
  };

  const toggleTodo = (id: string) => {
    const newTodos = (block.todos || []).map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    onChange({ ...block, todos: newTodos });
  };

  const addTodo = () => {
    const newTodo: TodoItem = { id: Math.random().toString(36).substr(2, 9), text: '', completed: false };
    onChange({ ...block, todos: [...(block.todos || []), newTodo] });
  };

  const updateTodoText = (id: string, text: string) => {
    const newTodos = (block.todos || []).map(t => t.id === id ? { ...t, text } : t);
    onChange({ ...block, todos: newTodos });
  };

  const removeTodo = (id: string) => {
    const newTodos = (block.todos || []).filter(t => t.id !== id);
    onChange({ ...block, todos: newTodos });
  };

  return (
    <div className="absolute inset-0 z-[200] bg-white flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-6 shrink-0 bg-white border-b border-neutral-100">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center border border-neutral-100 rounded-full hover:bg-neutral-50 active:scale-95 transition-all"
          >
            <X size={20} className="text-neutral-400" />
          </button>
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase text-neutral-300 tracking-[0.2em] leading-none mb-1">{block.type === 'todo' ? 'TASKS' : 'ENTRY'}</span>
            <input 
              type="text" 
              value={block.content} 
              onChange={(e) => onChange({ ...block, content: e.target.value })}
              placeholder="TITLE"
              className="text-base font-bold text-neutral-800 bg-transparent border-none outline-none p-0 w-full placeholder:text-neutral-200"
            />
          </div>
        </div>
        <button 
          onClick={onClose}
          className="px-6 py-2 bg-neutral-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95"
        >
          SAVE
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 iphone-content space-y-10 pb-20">
        
        {/* Template: Todo List specific UI */}
        {block.type === 'todo' && (
          <section className="bg-neutral-50/50 rounded-[32px] p-6 border border-neutral-100/50">
            <label className="text-[10px] font-black uppercase text-neutral-300 block tracking-[0.2em] mb-6">CHECKLIST</label>
            <div className="space-y-4">
              {(block.todos || []).map((todo) => (
                <div key={todo.id} className="flex items-center gap-4 group">
                  <button onClick={() => toggleTodo(todo.id)} className="text-neutral-200 hover:text-neutral-800 transition-colors">
                    {todo.completed ? <CheckCircle2 size={24} className="text-neutral-800" /> : <Circle size={24} />}
                  </button>
                  <input 
                    type="text"
                    value={todo.text}
                    onChange={(e) => updateTodoText(todo.id, e.target.value)}
                    placeholder="Action item..."
                    className={`flex-1 bg-transparent border-none outline-none text-sm font-medium transition-all ${todo.completed ? 'text-neutral-300 line-through' : 'text-neutral-700'}`}
                  />
                  <button onClick={() => removeTodo(todo.id)} className="opacity-0 group-hover:opacity-100 text-neutral-200 hover:text-red-400 transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button 
                onClick={addTodo}
                className="flex items-center gap-4 text-neutral-300 hover:text-neutral-500 transition-colors pt-2 pl-1"
              >
                <Plus size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">New task</span>
              </button>
            </div>
          </section>
        )}

        {/* Thoughts Section */}
        {block.type !== 'image' && (
          <section>
            <label className="text-[10px] font-black uppercase text-neutral-300 block mb-3 tracking-[0.2em]">
              {block.type === 'todo' ? 'NOTES' : 'CONTENT'}
            </label>
            <textarea 
              value={block.body}
              onChange={(e) => onChange({ ...block, body: e.target.value })}
              placeholder="Start writing..."
              className="w-full min-h-[160px] bg-transparent border-none p-0 text-base font-medium text-neutral-700 focus:outline-none placeholder:text-neutral-100 resize-none transition-all"
            />
          </section>
        )}

        {/* Universal: Gallery Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <label className="text-[10px] font-black uppercase text-neutral-300 tracking-[0.2em]">GALLERY</label>
            <div className="flex gap-2">
              <button 
                onClick={() => handleFileSelection(true)} 
                className="text-[8px] font-black uppercase flex items-center gap-2 text-neutral-400 bg-neutral-50 border border-neutral-100 px-3 py-2 rounded-xl hover:text-neutral-800 transition-all"
              >
                <Camera size={14} />
              </button>
              <button 
                onClick={() => handleFileSelection(false)} 
                className="text-[8px] font-black uppercase flex items-center gap-2 text-neutral-400 bg-neutral-50 border border-neutral-100 px-3 py-2 rounded-xl hover:text-neutral-800 transition-all"
              >
                <ImageIcon size={14} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {(block.images || []).map((img, i) => (
              <div key={i} className="relative aspect-square border border-neutral-100 rounded-[32px] overflow-hidden group">
                <img src={img} className="w-full h-full object-cover" />
                <button 
                  onClick={() => removeImage(i)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-full text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button 
              onClick={() => handleFileSelection(false)}
              className="aspect-square flex flex-col items-center justify-center gap-3 border border-neutral-100 border-dashed rounded-[32px] bg-neutral-50/30 text-neutral-200 hover:text-neutral-300 transition-all"
            >
              <Plus size={28} strokeWidth={1.5} />
            </button>
          </div>
        </section>

        {/* Universal: Tags */}
        <section className="pt-4 border-t border-neutral-100">
          <label className="text-[10px] font-black uppercase text-neutral-300 block mb-4 tracking-[0.2em]">COLLECTIONS</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {(block.tags || []).map(tag => (
              <span key={tag} className="px-3 py-1.5 bg-neutral-50 border border-neutral-100 text-neutral-500 text-[9px] font-black uppercase rounded-full flex items-center gap-2">
                {tag}
                <button onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center bg-neutral-50/50 border border-neutral-100 rounded-2xl px-4 py-2 focus-within:bg-neutral-50 transition-all">
              <TagIcon className="text-neutral-200 mr-2" size={14} />
              <input 
                type="text" 
                placeholder="Assign to collection..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag()}
                className="w-full bg-transparent border-none outline-none text-xs font-bold text-neutral-600 placeholder:text-neutral-200"
              />
            </div>
            <button onClick={addTag} className="px-5 text-[9px] font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-800 transition-all">
              ADD
            </button>
          </div>
        </section>
      </div>

      <div className="h-10 shrink-0 bg-white" />
    </div>
  );
};

export default ExpandedBlock;
