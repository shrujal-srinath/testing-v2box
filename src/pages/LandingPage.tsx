import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState('');

  const handleHost = () => {
    // Generate a random 6-digit code
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    navigate(`/host/${randomCode}`);
  };

  const handleWatch = () => {
    if (joinCode.length === 6) {
      navigate(`/watch/${joinCode}`);
    } else {
      alert("Please enter a valid 6-digit code");
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', background: '#000', color: 'white', 
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: '2rem', fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', letterSpacing: '5px' }}>BOX V2</h1>
      
      {/* HOST SECTION */}
      <div style={{ background: '#222', padding: '2rem', borderRadius: '15px', textAlign: 'center', width: '300px' }}>
        <h2>🎯 Host Game</h2>
        <p style={{ color: '#aaa' }}>Create a new game and control the score.</p>
        <button 
          onClick={handleHost}
          style={{ 
            width: '100%', padding: '15px', marginTop: '10px',
            background: '#EA4335', color: 'white', border: 'none', 
            borderRadius: '8px', fontSize: '1.2rem', cursor: 'pointer' 
          }}
        >
          Create Game
        </button>
      </div>

      {/* WATCH SECTION */}
      <div style={{ background: '#222', padding: '2rem', borderRadius: '15px', textAlign: 'center', width: '300px' }}>
        <h2>👁️ Watch Game</h2>
        <p style={{ color: '#aaa' }}>Enter code to watch live.</p>
        <input 
          type="text" 
          placeholder="123456" 
          maxLength={6}
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          style={{ 
            width: '90%', padding: '15px', margin: '10px 0',
            textAlign: 'center', fontSize: '1.5rem', letterSpacing: '5px',
            borderRadius: '8px', border: 'none'
          }}
        />
        <button 
          onClick={handleWatch}
          style={{ 
            width: '100%', padding: '15px',
            background: '#4285F4', color: 'white', border: 'none', 
            borderRadius: '8px', fontSize: '1.2rem', cursor: 'pointer' 
          }}
        >
          Watch Live
        </button>
      </div>
    </div>
  );
};