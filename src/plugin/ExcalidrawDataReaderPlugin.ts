import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { BasePlugin } from "./Plugin";

/**
 * A simple plugin to read elements from the Excalidraw canvas.
 */
export class ExcalidrawDataReaderPlugin extends BasePlugin {
  id = "excalidraw-data-reader";
  name = "Excalidraw Data Reader";
  description = "Reads all elements currently on the canvas.";

  // Method to get all elements from the Excalidraw scene
  getAllElements(): readonly ExcalidrawElement[] {
    const api = this.ensureApi(); // Ensure API is initialized
    return api.getSceneElements();
  }

  // Method to read all elements and return them
  readAllElements(): readonly ExcalidrawElement[] {
    const elements = this.getAllElements();
    console.log("Reading Excalidraw Elements:", elements); // Keep console log for debugging
    return elements;
  }

  // Override initialize if specific setup is needed, otherwise BasePlugin's is fine
  // initialize(api: ExcalidrawImperativeAPI): void {
  //   super.initialize(api);
  //   console.log("Data Reader Plugin Initialized");
  // }

  // Override activate/deactivate if needed
  // activate?(): void { ... }
  // deactivate?(): void { ... }
}
