import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useSound } from '../../contexts/SoundContext';

const EnemyShooter = () => {
  const [enemies, setEnemies] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameOver, setIsGameOver] = useState(false);
  const { playSound } = useSound();

  const enemyList = ['alien', 'robot', 'monster', 'zombie', 'dragon'];

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !isGameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, isGameOver]);

  const startGame = () => {
    setEnemies([]);
    setCurrentInput('');
    setScore(0);
    setTimeLeft(60);
    setIsGameOver(false);
    spawnEnemy();
  };

  const spawnEnemy = () => {
    const newEnemy = {
      id: Date.now(),
      name: enemyList[Math.floor(Math.random() * enemyList.length)],
      x: Math.random() * 80 + 10
    };
    setEnemies(prev => [...prev, newEnemy]);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCurrentInput(value);

    const matchingEnemy = enemies.find(enemy => enemy.name === value);
    if (matchingEnemy) {
      playSound('shoot');
      setEnemies(prev => prev.filter(enemy => enemy.id !== matchingEnemy.id));
      setScore(prev => prev + 30);
      setCurrentInput('');
      spawnEnemy();
    }
  };

  const endGame = async () => {
    setIsGameOver(true);
    try {
      await axios.post('http://localhost:5000/api/games/save', {
        gameName: 'Enemy Shooter',
        score,
        accuracy: 100,
        time: 60 - timeLeft
      });
    } catch (error) {
      console.error('Error saving game:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="enemy-shooter-game"
    >
      <div className="game-header">
        <h2 className="neon-text">Enemy Shooter</h2>
        <div className="game-stats">
          <span>Score: {score}</span>
          <span>Time: {timeLeft}s</span>
        </div>
      </div>

      <div className="battlefield">
        {enemies.map(enemy => (
          <div key={enemy.id} className="enemy" style={{ left: `${enemy.x}%` }}>
            👾 {enemy.name}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={currentInput}
        onChange={handleInputChange}
        className="game-input"
        placeholder="Type to shoot!"
        disabled={isGameOver}
      />

      {isGameOver && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="game-over card"
        >
          <h3>Mission Complete!</h3>
          <p>Final Score: {score}</p>
          <button className="btn" onClick={startGame}>Play Again</button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EnemyShooter;
