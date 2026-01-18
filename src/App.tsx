import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { GameSetup } from './pages/GameSetup'; // NEW
import { Scoreboard } from './components/Scoreboard';
import { SpectatorView } from './pages/SpectatorView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/setup" element={<GameSetup />} /> {/* NEW ROUTE */}
        <Route path="/host/:gameCode" element={<Scoreboard />} />
        <Route path="/watch/:gameCode" element={<SpectatorView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;