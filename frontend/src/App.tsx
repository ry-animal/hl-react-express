import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ChatInterface from './components/ChatInterface';
import MetricsView from './components/MetricsView';
import MetricsDashboard from './components/MetricsDashboard';
import Layout from './components/Layout';
import useStore from './store/useStore';

function App() {
  const activeView = useStore((state) => state.activeView);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Layout title="Reuben's Brews Chatbot Application">
            {activeView === 'chat' ? <ChatInterface /> : <MetricsView />}
          </Layout>
        } />
        <Route path="/metrics" element={
          <Layout title="Metrics Dashboard" fullWidth>
            <MetricsDashboard />
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
