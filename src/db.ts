import Dexie, { Table } from 'dexie';
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import { AppState } from '@excalidraw/excalidraw/types/types';

export interface Scene {
  id?: number; // Auto-incremented primary key
  name: string;
  createdAt: Date;
  elements: readonly ExcalidrawElement[];
  appState: Partial<AppState>; // Store relevant parts of AppState
}

export class ExcalidrawDexie extends Dexie {
  scenes!: Table<Scene>;

  constructor() {
    super('excalidrawDB');
    this.version(1).stores({
      // Primary key 'id' is auto-incremented. Index 'name' and 'createdAt'.
      scenes: '++id, name, createdAt',
    });
  }
}

export const db = new ExcalidrawDexie();
