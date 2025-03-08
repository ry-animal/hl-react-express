import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ChatInterface from './components/ChatInterface';
import Footer from './components/Footer';
import Header from './components/Header';
import MetricsView from './components/MetricsView';
import MetricsDashboard from './components/MetricsDashboard';
import useStore from './store/useStore';

// Create a styled component for visually hidden elements
const ScreenReaderOnly = styled('h1')({
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  width: '1px',
  whiteSpace: 'nowrap',
  wordWrap: 'normal',
});

function App() {
  const activeView = useStore((state) => state.activeView);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              width: '100vw',
              maxWidth: '100vw',
              backgroundColor: 'background.default',
              overflow: 'hidden',
            }}
          >
            <ScreenReaderOnly>
              Reuben&apos;s Brews Chatbot Application
            </ScreenReaderOnly>

            <Header />

            <Box
              component="main"
              sx={{
                flex: 1,
                display: 'flex',
                width: '100%',
                p: { xs: 1, sm: 2 },
                justifyContent: 'center',
                alignItems: 'flex-start',
                maxWidth: '100vw',
                mx: 'auto',
                overflowY: 'auto',
              }}
            >
              {activeView === 'chat' ? <ChatInterface /> : <MetricsView />}
            </Box>

            <Footer />
          </Box>
        } />
        <Route path="/metrics" element={<MetricsDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
