import { GraphProvider } from './context/GraphContext';
import GraphCanvas from './components/GraphCanvas';
import Sidebar from './components/Sidebar';

export default function App() {
  return (
    <GraphProvider>
      <div style={{ display: 'flex', height: '100vh', background: '#fafafa' }}>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <GraphCanvas />
        </div>
        <Sidebar />
      </div>
    </GraphProvider>
  );
}
