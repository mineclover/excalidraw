import { BasePlugin } from "../plugin/Plugin";

/**
 * Base class for Edge-style plugins.
 */
export abstract class BaseEdgePlugin extends BasePlugin {
  // Add specific properties or methods common to Edge plugins
  abstract visualizeFlow(data: any): void; // Example method
}
