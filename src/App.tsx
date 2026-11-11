import GraphCanvas from './components/GraphCanvas';
import { GraphProvider } from './context/GraphContext';

export default function App() {
  return (
    <GraphProvider>
      <div className="flex h-screen">
        <div className="min-w-0 flex-1">
          <GraphCanvas />
        </div>
      </div>
    </GraphProvider>
  );
}
