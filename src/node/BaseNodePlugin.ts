import { BasePlugin } from "../plugin/Plugin";

/**
 * Base class for Node-style plugins.
 */
export abstract class BaseNodePlugin extends BasePlugin {
  // Add specific properties or methods common to Node plugins
  abstract generateSignal(eventType: string, payload: any): void; // Example method
}
