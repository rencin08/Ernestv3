
import React from 'react';
import { Block, TodoItem } from '../types';

interface TodoBlockProps {
  block: Block;
  onChange: (block: Block) => void;
  readOnly?: boolean;
}

const TodoBlock: React.FC<TodoBlockProps> = ({ block, readOnly }) => {
  const todos = block.todos || [];

  return (
    <div className="p-5 flex flex-col h-full gap-3 overflow-hidden">
      <div className="flex flex-col gap-1.5">
        <h4 className="font-bold text-[13px] text-neutral-800 leading-snug line-clamp-2">
          {block.content}
        </h4>
        <p className="text-[10px] text-neutral-400 line-clamp-1">
          {block.body || 'Preparing tasks...'}
        </p>
      </div>

      <div className="space-y-2 mt-1 flex-1 overflow-hidden">
        {todos.slice(0, 4).map(todo => (
          <div key={todo.id} className="flex items-center gap-2.5">
            <div className={`w-4 h-4 rounded-full border border-neutral-200 flex items-center justify-center shrink-0 ${todo.completed ? 'bg-neutral-800 border-neutral-800' : ''}`}>
              {todo.completed && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
            </div>
            <span className={`text-[11px] font-medium truncate ${todo.completed ? 'line-through text-neutral-300' : 'text-neutral-600'}`}>
              {todo.text}
            </span>
          </div>
        ))}
        {todos.length > 4 && (
          <p className="text-[8px] font-black text-neutral-200 uppercase tracking-[0.2em] pt-1">
            + {todos.length - 4} MORE ITEMS
          </p>
        )}
      </div>
    </div>
  );
};

export default TodoBlock;
