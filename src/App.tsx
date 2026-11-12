import GraphCanvas from './components/GraphCanvas';
import ResizeHandle, { SIDEBAR_DEFAULT, SIDEBAR_MAX, SIDEBAR_MIN, SIDEBAR_STORAGE_KEY } from './components/ResizeHandle';
import Sidebar from './components/Sidebar';
import { GraphProvider } from './context/GraphContext';
import { useState } from 'react';

function readWidth() {
  try {
    const raw = Number(localStorage.getItem(SIDEBAR_STORAGE_KEY));
    if (!Number.isFinite(raw) || raw <= 0) return SIDEBAR_DEFAULT;
    return Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, raw));
  } catch {
    return SIDEBAR_DEFAULT;
  }
}

export default function App() {
  const [width, setWidth] = useState(readWidth);
  const persistWidth = (next: number) => {
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
    } catch {
      // Storage may be unavailable in private browsing.
    }
  };

  return (
    <GraphProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-[#fafafa]">
        <div className="min-w-0 flex-1">
          <GraphCanvas />
        </div>
        <ResizeHandle width={width} onResize={setWidth} onResizeEnd={persistWidth} />
        <Sidebar width={width} />
      </div>
    </GraphProvider>
  );
}
