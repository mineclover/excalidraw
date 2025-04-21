import React from 'react';
import { PanelLeftClose, PanelRightClose, SplitSquareHorizontal, Save, Upload, Trash2 } from 'lucide-react';
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { Scene } from '../../db'; // Adjust import path if needed
import { ExcalidrawDataReaderPlugin } from '../../plugin/ExcalidrawDataReaderPlugin'; // Adjust import path

// Define types for props
type ViewMode = 'split' | 'left-full' | 'right-full';
type RightPanelTab = 'controls' | 'data';

interface RightPanelProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  activeTab: RightPanelTab;
  setActiveTab: (tab: RightPanelTab) => void;
  excalidrawElements: readonly ExcalidrawElement[] | null;
  // Persistence props
  savedScenes: Scene[] | undefined;
  sceneName: string;
  setSceneName: (name: string) => void;
  selectedSceneId: number | null;
  setSelectedSceneId: (id: number | null) => void;
  handleSaveScene: () => Promise<void>;
  handleLoadScene: () => Promise<void>;
  handleDeleteScene: (id: number | null) => Promise<void>;
  // Data Reader props
  dataReaderPlugin: ExcalidrawDataReaderPlugin | null;
  handleReadElementsClick: () => void;
}

export function RightPanel({
  viewMode,
  setViewMode,
  activeTab,
  setActiveTab,
  excalidrawElements,
  savedScenes,
  sceneName,
  setSceneName,
  selectedSceneId,
  setSelectedSceneId,
  handleSaveScene,
  handleLoadScene,
  handleDeleteScene,
  dataReaderPlugin,
  handleReadElementsClick
}: RightPanelProps) {

  console.log(`[RightPanel render] Rendering RightPanel. Active tab prop: ${activeTab}, Elements prop length: ${excalidrawElements?.length ?? 'null'}`);

  // --- Dynamic Class Calculation ---
  const getRightPaneClasses = () => {
    switch (viewMode) {
      case 'split': return "w-1/2 h-full bg-gray-50 flex flex-col relative";
      case 'left-full': return "hidden";
      case 'right-full': return "w-full h-full bg-gray-50 flex flex-col relative";
      default: return "w-1/2 h-full bg-gray-50 flex flex-col relative";
    }
  };

  const getTabButtonClasses = (tabName: RightPanelTab) => {
    const baseClasses = "py-2 px-4 text-sm font-medium";
    const activeClasses = "border-b-2 border-blue-500 text-blue-600";
    const inactiveClasses = "text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent";
    return `${baseClasses} ${activeTab === tabName ? activeClasses : inactiveClasses}`;
  };

  return (
    <div className={getRightPaneClasses()}>
      {/* Collapse/Expand Buttons for Right Pane */}
      <div className="absolute top-2 right-2 z-10 flex space-x-1 bg-white p-1 rounded shadow border border-gray-200">
        {viewMode === 'split' && (
          <button onClick={() => setViewMode('left-full')} title="Collapse Right Pane" className="p-1 hover:bg-gray-100 rounded">
            <PanelRightClose size={18} />
          </button>
        )}
        {viewMode === 'left-full' && (
          <button onClick={() => setViewMode('split')} title="Show Split View" className="p-1 hover:bg-gray-100 rounded">
            <SplitSquareHorizontal size={18} />
          </button>
        )}
        {viewMode === 'split' && (
          <button onClick={() => setViewMode('right-full')} title="Expand Right Pane" className="p-1 hover:bg-gray-100 rounded">
            <PanelLeftClose size={18} />
          </button>
        )}
        {viewMode === 'right-full' && (
          <button onClick={() => setViewMode('split')} title="Show Split View" className="p-1 hover:bg-gray-100 rounded">
            <SplitSquareHorizontal size={18} />
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-white">
        <nav className="-mb-px flex space-x-4 px-4" aria-label="Tabs">
          <button
            className={getTabButtonClasses('controls')}
            onClick={() => setActiveTab('controls')}
          >
            Controls
          </button>
          <button
            className={getTabButtonClasses('data')}
            onClick={() => setActiveTab('data')}
          >
            Data View
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-grow p-4 overflow-auto space-y-6">
        {activeTab === 'controls' && (
          <div className="space-y-4">
             {console.log("[RightPanel render] Rendering Controls Tab Content")}
            {/* Section: Save Scene */}
            <div className="p-4 border rounded bg-white shadow-sm">
              <h3 className="text-md font-semibold mb-3 border-b pb-2">Save Current Scene</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={sceneName}
                  onChange={(e) => setSceneName(e.target.value)}
                  placeholder="Enter scene name"
                  className="flex-grow p-2 border rounded text-sm"
                />
                <button
                  onClick={handleSaveScene}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded inline-flex items-center text-sm"
                  title="Save Scene"
                >
                  <Save size={16} className="mr-1" /> Save
                </button>
              </div>
            </div>

            {/* Section: Load Scene */}
            <div className="p-4 border rounded bg-white shadow-sm">
              <h3 className="text-md font-semibold mb-3 border-b pb-2">Load Saved Scene</h3>
              {savedScenes && savedScenes.length > 0 ? (
                <div className="space-y-3">
                  <select
                    value={selectedSceneId ?? ''}
                    onChange={(e) => setSelectedSceneId(e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full p-2 border rounded text-sm mb-2"
                  >
                    <option value="">-- Select a scene --</option>
                    {savedScenes.map((scene) => (
                      <option key={scene.id} value={scene.id}>
                        {scene.name} ({scene.createdAt.toLocaleString()})
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleLoadScene}
                      disabled={selectedSceneId === null}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-3 rounded inline-flex items-center text-sm disabled:opacity-50"
                      title="Load Selected Scene"
                    >
                      <Upload size={16} className="mr-1" /> Load
                    </button>
                    <button
                      onClick={() => handleDeleteScene(selectedSceneId)}
                      disabled={selectedSceneId === null}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded inline-flex items-center text-sm disabled:opacity-50"
                      title="Delete Selected Scene"
                    >
                      <Trash2 size={16} className="mr-1" /> Delete
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No saved scenes found.</p>
              )}
            </div>

            {/* Section: Data Reader (Optional) */}
            <div className="p-4 border rounded bg-white shadow-sm">
              <h3 className="text-md font-semibold mb-3 border-b pb-2">Raw Data</h3>
              <button
                onClick={handleReadElementsClick}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded disabled:opacity-50 text-sm"
                disabled={!dataReaderPlugin}
                title="Read current elements and view in Data tab"
              >
                Read Current Elements
              </button>
              <p className="text-xs text-gray-500 mt-2">Reads the current canvas elements and displays them in the 'Data View' tab.</p>
            </div>

            {/* Placeholder for other plugins */}
            <div id="plugin-host-area" className="mt-4 border-t pt-4">
              <p className="text-sm text-gray-500">Other plugin controls might appear here.</p>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div>
            {console.log("[RightPanel render] Rendering Data Tab Content. Elements:", excalidrawElements)}
            <h2 className="text-lg font-semibold mb-4">Excalidraw Element Data</h2>
            {excalidrawElements && excalidrawElements.length > 0 ? (
              <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-auto max-h-[calc(100vh-200px)]">
                 {console.log("[RightPanel render] Data Tab: Rendering PRE tag with elements.")}
                {JSON.stringify(excalidrawElements, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-500">
                {console.log("[RightPanel render] Data Tab: Rendering placeholder text.")}
                {excalidrawElements === null
                  ? 'Click "Read Current Elements" in the Controls tab to view data here.'
                  : 'No elements found on the canvas or data not yet loaded.'}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
