import { BasePlugin } from "../plugin/Plugin";
import { IPlugin } from "../plugin/Plugin"; // Import IPlugin if needed

/**
 * Base class for Orchestration System plugins.
 * These plugins typically manage other plugins.
 */
export abstract class BaseOrchestrationPlugin extends BasePlugin {
  protected managedPlugins: Map<string, IPlugin> = new Map();

  // Example method to register a plugin for management
  registerPlugin(plugin: IPlugin): void {
    if (this.dependencies?.includes(plugin.id)) {
      this.managedPlugins.set(plugin.id, plugin);
      console.log(`Orchestrator ${this.name} registered plugin: ${plugin.name}`);
    } else {
      console.warn(`Orchestrator ${this.name} attempted to register plugin ${plugin.name} which is not listed as a dependency.`);
    }
  }

  // Example method to coordinate actions
  abstract coordinateFlow(): void;

  // Override initialize to potentially load/manage dependent plugins
  initialize(api: import("@excalidraw/excalidraw/types/types").ExcalidrawImperativeAPI): void {
    super.initialize(api);
    console.log(`Orchestrator ${this.name} initialized. Dependencies: ${this.dependencies?.join(', ') || 'None'}`);
    // TODO: Add logic here to find and potentially initialize/register dependent plugins
    // This would likely involve a central plugin registry or discovery mechanism.
  }
}
