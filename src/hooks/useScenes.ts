import { useLiveQuery } from 'dexie-react-hooks';
import { db, Scene } from '../db'; // Assuming db.ts is in src/
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import { AppState } from '@excalidraw/excalidraw/types/types';

export function useScenes() {
  // Fetch all saved scenes, ordered by creation date descending
  const savedScenes = useLiveQuery(
    () => db.scenes.orderBy('createdAt').reverse().toArray(),
    [] // Dependencies array, empty means it runs once initially and updates on DB changes
  );

  // Function to save a scene
  const saveScene = async (
    name: string,
    elements: readonly ExcalidrawElement[],
    appState: Partial<AppState>
  ): Promise<number | undefined> => {
    try {
      const sceneData: Omit<Scene, 'id'> = {
        name,
        elements: JSON.parse(JSON.stringify(elements)), // Deep clone to avoid storing readonly array directly if Dexie modifies it
        appState: JSON.parse(JSON.stringify(appState)), // Deep clone appState
        createdAt: new Date(),
      };
      const id = await db.scenes.add(sceneData);
      console.log(`Scene "${name}" saved with ID: ${id}`);
      return id;
    } catch (error) {
      console.error("Failed to save scene:", error);
      alert(`Error saving scene: ${error}`);
      return undefined;
    }
  };

  // Function to load a scene by ID
  const loadScene = async (id: number): Promise<Scene | undefined> => {
    try {
      const scene = await db.scenes.get(id);
      if (scene) {
        console.log(`Scene "${scene.name}" loaded.`);
        // Ensure elements and appState are proper objects when retrieved
        return {
          ...scene,
          elements: scene.elements as ExcalidrawElement[], // Type assertion
          appState: scene.appState as AppState, // Type assertion
        };
      } else {
        console.warn(`Scene with ID ${id} not found.`);
        alert(`Scene with ID ${id} not found.`);
        return undefined;
      }
    } catch (error) {
      console.error(`Failed to load scene ID ${id}:`, error);
      alert(`Error loading scene: ${error}`);
      return undefined;
    }
  };

  // Function to delete a scene by ID
  const deleteScene = async (id: number): Promise<void> => {
    try {
      await db.scenes.delete(id);
      console.log(`Scene with ID ${id} deleted.`);
    } catch (error) {
      console.error(`Failed to delete scene ID ${id}:`, error);
      alert(`Error deleting scene: ${error}`);
    }
  };

  return { savedScenes, saveScene, loadScene, deleteScene };
}
