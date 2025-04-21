import React, { useRef, useEffect, useState } from 'react';
import { Excalidraw } from "@excalidraw/excalidraw";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { PanelLeftClose, PanelRightClose, PanelLeftOpen, PanelRightOpen, SplitSquareHorizontal } from 'lucide-react'; // Import icons
import { IPlugin } from './plugin/Plugin';

// --- Placeholder for Plugin Loading/Management ---
// ... (previous placeholder code remains the same)
// --- End Placeholder ---

type ViewMode = 'split' | 'left-full' | 'right-full';

function App() {
  const excalidrawApiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const [initializedPlugins, setInitializedPlugins] = useState<IPlugin[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('split'); // State for view mode

  useEffect(() => {
    if (excalidrawApiRef.current && initializedPlugins.length === 0) {
      console.log("Excalidraw API available, initializing plugins...");
      // --- Plugin Loading Trigger ---
      // ... (previous placeholder code remains the same)
      // --- End Plugin Loading Trigger ---
    }
  }, [initializedPlugins]);

  // --- Dynamic Class Calculation ---
  const getLeftPaneClasses = () => {
    switch (viewMode) {
      case 'split': return "w-1/2 h-full relative"; // Added relative for button positioning
      case 'left-full': return "w-full h-full relative";
      case 'right-full': return "hidden"; // Hide when right is full
      default: return "w-1/2 h-full relative";
    }
  };

  const getRightPaneClasses = () => {
    switch (viewMode) {
      case 'split': return "w-1/2 h-full bg-gray-100 p-4 overflow-auto relative"; // Added relative
      case 'left-full': return "hidden"; // Hide when left is full
      case 'right-full': return "w-full h-full bg-gray-100 p-4 overflow-auto relative";
      default: return "w-1/2 h-full bg-gray-100 p-4 overflow-auto relative";
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden"> {/* Main flex container */}

      {/* Left Pane: Excalidraw */}
      <div className={getLeftPaneClasses()}>
        {/* Collapse/Expand Buttons for Left Pane */}
        <div className="absolute top-2 right-2 z-10 flex space-x-1 bg-white p-1 rounded shadow">
          {viewMode === 'split' && (
            <button onClick={() => setViewMode('right-full')} title="Collapse Left Pane" className="p-1 hover:bg-gray-200 rounded">
              <PanelLeftClose size={18} />
            </button>
          )}
           {viewMode === 'right-full' && (
            <button onClick={() => setViewMode('split')} title="Show Split View" className="p-1 hover:bg-gray-200 rounded">
              <SplitSquareHorizontal size={18} />
            </button>
          )}
           {viewMode === 'split' && (
             <button onClick={() => setViewMode('left-full')} title="Expand Left Pane" className="p-1 hover:bg-gray-200 rounded">
               <PanelRightClose size={18} /> {/* Icon seems reversed, but represents closing the *other* panel */}
             </button>
           )}
           {viewMode === 'left-full' && (
             <button onClick={() => setViewMode('split')} title="Show Split View" className="p-1 hover:bg-gray-200 rounded">
               <SplitSquareHorizontal size={18} />
             </button>
           )}
        </div>

        <Excalidraw
          excalidrawAPI={(api) => {
            if (!excalidrawApiRef.current) {
               excalidrawApiRef.current = api;
               setInitializedPlugins([]);
            }
          }}
          // Force re-render when view mode changes to fix potential layout issues
          key={viewMode}
        >
          {/* UI Customizations can go here */}
        </Excalidraw>
      </div>

      {/* Right Pane: Other Web Interface */}
      <div className={getRightPaneClasses()}>
         {/* Collapse/Expand Buttons for Right Pane */}
         <div className="absolute top-2 right-2 z-10 flex space-x-1 bg-white p-1 rounded shadow">
           {viewMode === 'split' && (
             <button onClick={() => setViewMode('left-full')} title="Collapse Right Pane" className="p-1 hover:bg-gray-200 rounded">
               <PanelRightClose size={18} />
             </button>
           )}
           {viewMode === 'left-full' && (
             <button onClick={() => setViewMode('split')} title="Show Split View" className="p-1 hover:bg-gray-200 rounded">
               <SplitSquareHorizontal size={18} />
             </button>
           )}
           {viewMode === 'split' && (
             <button onClick={() => setViewMode('right-full')} title="Expand Right Pane" className="p-1 hover:bg-gray-200 rounded">
               <PanelLeftClose size={18} /> {/* Icon seems reversed, but represents closing the *other* panel */}
             </button>
           )}
           {viewMode === 'right-full' && (
             <button onClick={() => setViewMode('split')} title="Show Split View" className="p-1 hover:bg-gray-200 rounded">
               <SplitSquareHorizontal size={18} />
             </button>
           )}
         </div>

        <h2 className="text-xl font-semibold mb-4 pt-8">Other Interface Panel</h2> {/* Added padding-top */}
        {/* Placeholder content for the other interface */}
        <p>This area will contain the other web interface components.</p>
        <p>Plugins might interact with or display information here.</p>
        {/* --- Plugin Rendering Area --- */}
        <div id="plugin-host-area" className="mt-4 border-t pt-4">
          <p className="text-sm text-gray-500">Plugin content will appear here.</p>
          {/* Dynamically loaded plugin components will be rendered here */}
        </div>
        {/* --- End Plugin Rendering Area --- */}
      </div>
    </div>
  );
}

export default App;
