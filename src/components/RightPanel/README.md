# RightPanel Component

This directory contains the `RightPanel` React component and related files.

**Purpose:**
- Provides the user interface for the collapsible right-hand panel in the application.
- Hosts controls for interacting with plugins, managing saved scenes (via Dexie), and potentially displaying plugin-specific UI or data.

**Key Features:**
- **Tabbed Interface:** Uses tabs ("Controls", "Data View") to organize different functionalities.
- **Scene Management:** Includes buttons and lists for saving, loading, and deleting Excalidraw scenes using the `useScenes` hook.
- **Data Display:** Contains an area (`Data View` tab) intended to display data read from the Excalidraw canvas (e.g., elements, state).
- **Plugin Interaction:** Designed to potentially host UI elements or data provided by active plugins in the future.

**Props:**
- Receives props from `App.tsx` to handle interactions like saving/loading scenes, reading elements, and accessing the list of saved scenes.

**Usage:**
- The `RightPanel` component is rendered within `App.tsx` and placed within the split-screen layout.
