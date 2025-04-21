import React, { useRef, useEffect, useState } from 'react';
import { Excalidraw } from "@excalidraw/excalidraw";
import { ExcalidrawImperativeAPI, AppState } from "@excalidraw/excalidraw/types/types";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { PanelLeftClose, PanelRightClose, PanelLeftOpen, PanelRightOpen, SplitSquareHorizontal } from 'lucide-react';
import { IPlugin } from './plugin/Plugin';
import { ExcalidrawDataReaderPlugin } from './plugin/ExcalidrawDataReaderPlugin';
import { useScenes } from './hooks/useScenes';
import { RightPanel } from './components/RightPanel/RightPanel'; // Import the new component

type ViewMode = 'split' | 'left-full' | 'right-full';
type RightPanelTab = 'controls' | 'data';

function App() {
  const excalidrawApiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const [initializedPlugins, setInitializedPlugins] = useState<IPlugin[]>([]);
  const [dataReaderPlugin, setDataReaderPlugin] = useState<ExcalidrawDataReaderPlugin | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [activeTab, setActiveTab] = useState<RightPanelTab>('controls');
  const [excalidrawElements, setExcalidrawElements] = useState<readonly ExcalidrawElement[] | null>(null);

  // --- Dexie Hook Integration ---
  const { savedScenes, saveScene, loadScene, deleteScene } = useScenes();
  const [sceneName, setSceneName] = useState<string>('');
  const [selectedSceneId, setSelectedSceneId] = useState<number | null>(null);
  // ---

  useEffect(() => {
    // Initialize DataReader plugin
    if (excalidrawApiRef.current && !dataReaderPlugin) {
      console.log("[App useEffect] Excalidraw API available, initializing DataReader plugin...");
      const readerPlugin = new ExcalidrawDataReaderPlugin();
      try {
        readerPlugin.initialize(excalidrawApiRef.current);
        setDataReaderPlugin(readerPlugin);
        setInitializedPlugins(prevPlugins => [...prevPlugins, readerPlugin]);
        console.log("[App useEffect] DataReader plugin initialized successfully.");
      } catch (error) {
        console.error("[App useEffect] Failed to initialize DataReader plugin:", error);
      }
    }
  }, [excalidrawApiRef.current, dataReaderPlugin]);

  // --- DEBUG: Log state changes ---
  useEffect(() => {
    console.log("[App useEffect] excalidrawElements state updated:", excalidrawElements);
  }, [excalidrawElements]);

  useEffect(() => {
    console.log("[App useEffect] activeTab state updated:", activeTab);
  }, [activeTab]);
  // ---

  const handleReadElementsClick = () => {
    console.log("[handleReadElementsClick] Clicked!");
    if (dataReaderPlugin) {
      console.log("[handleReadElementsClick] DataReader plugin exists.");
      const elements = dataReaderPlugin.readAllElements();
      console.log(`[handleReadElementsClick] Read ${elements?.length ?? 0} elements:`, elements);
      setExcalidrawElements(elements); // State update is async
      setActiveTab('data'); // State update is async
      console.log("[handleReadElementsClick] Called setExcalidrawElements and setActiveTab('data'). State updates will happen shortly.");
    } else {
      console.warn("[handleReadElementsClick] Data Reader Plugin not initialized yet.");
      alert("Data Reader Plugin not ready.");
    }
  };

  const handleSaveScene = async () => {
    const api = excalidrawApiRef.current;
    if (!api) {
      alert("Excalidraw API not available.");
      return;
    }
    if (!sceneName.trim()) {
       alert("Please enter a name for the scene.");
       return;
    }
    const elements = api.getSceneElements();
    const appState = api.getAppState();
    const savedId = await saveScene(sceneName, elements, appState);
    if (savedId) {
      setSceneName('');
      alert(`Scene "${sceneName}" saved successfully!`);
    }
  };

  const handleLoadScene = async () => {
    const api = excalidrawApiRef.current;
    if (!api) {
      alert("Excalidraw API not available.");
      return;
    }
    if (selectedSceneId === null) {
      alert("Please select a scene to load.");
      return;
    }
    const sceneData = await loadScene(selectedSceneId);
    if (sceneData) {
      api.updateScene({
        elements: sceneData.elements,
        appState: sceneData.appState,
        commitToHistory: true
      });
      alert(`Scene "${sceneData.name}" loaded successfully!`);
    }
  };

   const handleDeleteScene = async (id: number | null) => {
    if (id === null) return;
    if (window.confirm(`Are you sure you want to delete scene ID ${id}?`)) {
      await deleteScene(id);
      if (selectedSceneId === id) {
        setSelectedSceneId(null);
      }
      alert(`Scene deleted successfully!`);
    }
  };


  // --- Dynamic Class Calculation for Left Pane ---
  const getLeftPaneClasses = () => {
    switch (viewMode) {
      case 'split': return "w-1/2 h-full relative border-r border-gray-300";
      case 'left-full': return "w-full h-full relative";
      case 'right-full': return "hidden";
      default: return "w-1/2 h-full relative border-r border-gray-300";
    }
  };

  console.log("[App render] Rendering App component. Active tab:", activeTab, "Elements:", excalidrawElements?.length);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">

      {/* Left Pane: Excalidraw */}
      <div className={getLeftPaneClasses()}>
        {/* Collapse/Expand Buttons for Left Pane */}
        <div className="absolute top-2 right-2 z-10 flex space-x-1 bg-white p-1 rounded shadow border border-gray-200">
           {viewMode === 'split' && (
             <button onClick={() => setViewMode('right-full')} title="Collapse Left Pane" className="p-1 hover:bg-gray-100 rounded">
               <PanelLeftClose size={18} />
             </button>
           )}
            {viewMode === 'right-full' && (
             <button onClick={() => setViewMode('split')} title="Show Split View" className="p-1 hover:bg-gray-100 rounded">
               <SplitSquareHorizontal size={18} />
             </button>
           )}
            {viewMode === 'split' && (
              <button onClick={() => setViewMode('left-full')} title="Expand Left Pane" className="p-1 hover:bg-gray-100 rounded">
                <PanelRightClose size={18} />
              </button>
            )}
            {viewMode === 'left-full' && (
              <button onClick={() => setViewMode('split')} title="Show Split View" className="p-1 hover:bg-gray-100 rounded">
                <SplitSquareHorizontal size={18} />
              </button>
            )}
         </div>

        <Excalidraw
          excalidrawAPI={(api) => {
            // Use a functional update to avoid stale closure issues if API changes rapidly
            excalidrawApiRef.current = api;
            if (api) {
              console.log("[Excalidraw onAPI] API received. Resetting plugin state.");
              // Reset plugin state only if the API instance truly changes or was null
              setDataReaderPlugin(null);
              setInitializedPlugins([]);
            } else {
               console.log("[Excalidraw onAPI] API became null.");
            }
          }}
          key={viewMode} // Re-render Excalidraw if view mode changes might be needed depending on layout effects
        >
          {/* UI Customizations can go here */}
        </Excalidraw>
      </div>

      {/* Right Pane: Render the new component */}
      <RightPanel
        viewMode={viewMode}
        setViewMode={setViewMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        excalidrawElements={excalidrawElements}
        savedScenes={savedScenes}
        sceneName={sceneName}
        setSceneName={setSceneName}
        selectedSceneId={selectedSceneId}
        setSelectedSceneId={setSelectedSceneId}
        handleSaveScene={handleSaveScene}
        handleLoadScene={handleLoadScene}
        handleDeleteScene={handleDeleteScene}
        dataReaderPlugin={dataReaderPlugin}
        handleReadElementsClick={handleReadElementsClick}
      />
    </div>
  );
}

export default App;
