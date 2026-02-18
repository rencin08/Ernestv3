
export type BlockType = 'text' | 'todo' | 'image' | 'voice' | 'quote' | 'locked';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Block {
  id: string;
  type: BlockType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  content: string; // Title or primary text
  body?: string;   // Detailed notes
  images?: string[]; // Multiple images support
  todos?: TodoItem[];
  tags?: string[];   // For auto-sorting into collections
  color?: string;
  createdAt: number;
}

export interface Canvas {
  id: string;
  date: string;
  blocks: Block[];
}

export interface AppState {
  currentCanvasId: string;
  archive: Canvas[];
}
