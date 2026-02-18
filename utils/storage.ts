
import { Canvas, AppState, Block } from '../types';

const STORAGE_KEY = 'spatial_notes_v1';

export const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};

export const loadAppState = (): AppState => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    const today = getTodayDateString();
    return {
      currentCanvasId: today,
      archive: [{ id: today, date: today, blocks: [] }]
    };
  }
  
  const state: AppState = JSON.parse(saved);
  const today = getTodayDateString();
  
  // Check if we need to rotate to a new day
  if (state.currentCanvasId !== today) {
    const existing = state.archive.find(c => c.date === today);
    if (!existing) {
      state.archive.unshift({ id: today, date: today, blocks: [] });
    }
    state.currentCanvasId = today;
  }
  
  return state;
};

export const saveAppState = (state: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const updateCanvas = (date: string, blocks: Block[]): AppState => {
  const state = loadAppState();
  const index = state.archive.findIndex(c => c.date === date);
  if (index !== -1) {
    state.archive[index].blocks = blocks;
  } else {
    state.archive.unshift({ id: date, date, blocks });
  }
  saveAppState(state);
  return state;
};
