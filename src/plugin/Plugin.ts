import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";

/**
 * Base interface for all Excalidraw plugins.
 * Each plugin must implement this interface.
 */
export interface IPlugin {
  // Unique identifier for the plugin
  id: string;
  // Display name for the plugin
  name: string;
  // Optional description
  description?: string;
  // Optional list of plugin IDs this plugin depends on
  dependencies?: string[];

  // Method called when the plugin is initialized, receiving the Excalidraw API instance
  initialize(api: ExcalidrawImperativeAPI): void;

  // Method called when the plugin is activated or enabled
  activate?(): void;

  // Method called when the plugin is deactivated or disabled
  deactivate?(): void;

  // Method called when the Excalidraw scene changes (optional)
  onSceneUpdate?(): void;

  // Method called when the Excalidraw selection changes (optional)
  onSelectionChange?(): void;

  // Add other common lifecycle methods or properties as needed
}

/**
 * Abstract base class providing common functionality for plugins.
 * Plugins can extend this class for convenience.
 */
export abstract class BasePlugin implements IPlugin {
  abstract id: string;
  abstract name: string;
  description?: string;
  dependencies?: string[];
  protected api: ExcalidrawImperativeAPI | null = null;

  initialize(api: ExcalidrawImperativeAPI): void {
    this.api = api;
    console.log(`Plugin initialized: ${this.name} (${this.id})`);
    // Dependency check logic could be added here or in a dedicated manager
    if (this.dependencies) {
      console.log(`Plugin ${this.name} depends on: ${this.dependencies.join(', ')}`);
      // TODO: Implement logic to ensure dependencies are met/loaded
    }
  }

  activate?(): void {
    console.log(`Plugin activated: ${this.name} (${this.id})`);
  }

  deactivate?(): void {
    console.log(`Plugin deactivated: ${this.name} (${this.id})`);
  }

  onSceneUpdate?(): void {
    // Default implementation does nothing
  }

  onSelectionChange?(): void {
    // Default implementation does nothing
  }

  protected ensureApi(): ExcalidrawImperativeAPI {
    if (!this.api) {
      throw new Error(`Plugin ${this.name} (${this.id}) requires initialization before use.`);
    }
    return this.api;
  }
}
