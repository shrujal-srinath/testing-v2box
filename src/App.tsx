import { Scoreboard } from './components/Scoreboard';

function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#000', 
      padding: '40px',
      fontFamily: 'system-ui, sans-serif' 
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        color: 'white', 
        marginBottom: '40px',
        letterSpacing: '4px',
        textTransform: 'uppercase'
      }}>
        BOX-V2 Arena
      </h1>
      
      {/* Render the full scoreboard */}
      <Scoreboard />
    </div>
  );
}

export default App;