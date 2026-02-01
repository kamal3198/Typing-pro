import React, { useState } from 'react';

const BalloonPop = () => {
  const [popped, setPopped] = useState(false);
  return (
    <div className="balloon-pop-game">
      <h2>Balloon Pop</h2>
      <p>Pop the balloon by clicking the button below!</p>
      <div style={{ margin: '20px 0' }}>
        <div
          style={{
            width: 120,
            height: 160,
            borderRadius: '60% 60% 50% 50%',
            background: popped ? '#ddd' : '#ff6b6b',
            display: 'inline-block',
          }}
        />
      </div>
      <button className="btn" onClick={() => setPopped(true)}>
        {popped ? 'Popped!' : 'Pop Balloon'}
      </button>
    </div>
  );
};

export default BalloonPop;
