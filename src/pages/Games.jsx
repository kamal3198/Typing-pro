import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Games.css';
import FallingWords from '../components/games/FallingWords';
import SpeedRacer from '../components/games/SpeedRacer';
import BalloonPop from '../components/games/BalloonPop';
import EnemyShooter from '../components/games/EnemyShooter';
import TypeAdventure from '../components/games/TypeAdventure';

const Games = () => {
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    { id: 'falling-words', name: 'Falling Words', component: FallingWords, desc: 'Catch and type the falling words.' },
    { id: 'speed-racer', name: 'Speed Racer', component: SpeedRacer, desc: 'Type to boost your car and finish the race.' },
    { id: 'balloon-pop', name: 'Balloon Pop', component: BalloonPop, desc: 'Pop the balloon by clicking the button.' },
    { id: 'enemy-shooter', name: 'Enemy Shooter', component: EnemyShooter, desc: 'Type enemy names to shoot them.' },
    { id: 'type-adventure', name: 'Type Adventure', component: TypeAdventure, desc: 'A light typing adventure placeholder.' },
  ];

  if (selectedGame) {
    const GameComponent = selectedGame.component;
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="games-page"
      >
        <button className="btn back-btn" onClick={() => setSelectedGame(null)}>
          ← Back to Games
        </button>
        <div className="card">
          <GameComponent />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="games-page"
    >
      <h1 className="neon-text">Typing Games</h1>
      <p>Choose a game to improve your typing skills in a fun way!</p>
      
      <div className="games-grid">
        {games.length === 0 && <div className="games-empty">No games available yet.</div>}
        {games.map((game) => (
          <motion.div
            key={game.id}
            className="game-card card"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedGame(game); }}
          >
            <div>
              <h3>{game.name}</h3>
              <p>{game.desc}</p>
            </div>
            <button className="btn play-btn" onClick={() => setSelectedGame(game)}>Play</button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Games;
