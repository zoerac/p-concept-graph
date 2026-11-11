import GraphCanvas from './components/GraphCanvas';
import Sidebar from './components/Sidebar';
import { GraphProvider } from './context/GraphContext';

export default function App() {
  return (
    <GraphProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-[#fafafa]">
        <div className="min-w-0 flex-1">
          <GraphCanvas />
        </div>
        <Sidebar />
      </div>
    </GraphProvider>
  );
}
