import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Scoreboard } from './components/Scoreboard';
import { SpectatorView } from './pages/SpectatorView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. The Home Page (localhost:5173/) */}
        <Route path="/" element={<LandingPage />} />
        
        {/* 2. The Host View (localhost:5173/host/123456) */}
        <Route path="/host/:gameCode" element={<Scoreboard />} />
        
        {/* 3. The Spectator View (localhost:5173/watch/123456) */}
        <Route path="/watch/:gameCode" element={<SpectatorView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;