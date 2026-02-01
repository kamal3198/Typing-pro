import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FallingWords from '../components/games/FallingWords';
import SpeedRacer from '../components/games/SpeedRacer';
import BalloonPop from '../components/games/BalloonPop';
import EnemyShooter from '../components/games/EnemyShooter';
import TypeAdventure from '../components/games/TypeAdventure';

const Games = () => {
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    { id: 'falling-words', name: 'Falling Words', component: FallingWords },
    { id: 'speed-racer', name: 'Speed Racer', component: SpeedRacer },
    { id: 'balloon-pop', name: 'Balloon Pop', component: BalloonPop },
    { id: 'enemy-shooter', name: 'Enemy Shooter', component: EnemyShooter },
    { id: 'type-adventure', name: 'Type Adventure', component: TypeAdventure },
  ];

  if (selectedGame) {
    const GameComponent = selectedGame.component;
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <button className="btn back-btn" onClick={() => setSelectedGame(null)}>
          ← Back to Games
        </button>
        <GameComponent />
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
        {games.map((game) => (
          <motion.div
            key={game.id}
            className="game-card card"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedGame(game)}
          >
            <h3>{game.name}</h3>
            <p>Click to play!</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Games;
