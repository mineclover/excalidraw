# Custom React Hooks

This directory contains custom React hooks used throughout the application to encapsulate reusable logic, particularly for state management and side effects.

**Contents:**
- `useScenes.ts`: A hook for interacting with the Dexie database (`excalidrawDB`) to manage saved Excalidraw scenes. It provides functions for adding, retrieving, updating, and deleting scenes, leveraging `dexie-react-hooks` for reactivity.

**Usage:**
- Import hooks from this directory into components that require the specific encapsulated logic (e.g., `import { useScenes } from './hooks/useScenes';`).
