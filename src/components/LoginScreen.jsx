import { useState } from 'react';

export default function LoginScreen({ onStart }) {
  const [id, setId] = useState('');

  const handleStart = () => {
    if (id.trim() === '') {
      alert('Please Enter ID');
      return;
    }
    onStart(id.trim());
  };

  return (
    <div>
      <h1 className="cyber-title">無人機知識<br/>闖關問題</h1>
      <div className="cyber-box">
        <p style={{ fontFamily: 'var(--font-text)', fontWeight: 'bold', fontSize: '28px' }}>請填寫登入ID</p>
        <input 
          type="text" 
          className="cyber-input" 
          placeholder="ENTER YOUR ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleStart()}
        />
        <br />
        <button className="cyber-btn" onClick={handleStart}>START ENGINE</button>
      </div>
    </div>
  );
}
