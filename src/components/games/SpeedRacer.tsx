import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useSound } from '../../contexts/SoundContext';

const SpeedRacer = () => {
  const [carPosition, setCarPosition] = useState(50);
  const [words, setWords] = useState<{ id: number; text: string; x: number }[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const { playSound } = useSound();

  const wordList = ['speed', 'race', 'car', 'fast', 'drive', 'road', 'track'];

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
    setWords([]);
    setCurrentInput('');
    setScore(0);
    setSpeed(1);
    setIsGameOver(false);
    setTimeLeft(60);
    setCarPosition(50);
    spawnWord();
  };

  const spawnWord = () => {
    const newWord = {
      id: Date.now(),
      text: wordList[Math.floor(Math.random() * wordList.length)],
      x: Math.random() * 80 + 10
    };
    setWords(prev => [...prev, newWord]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentInput(value);

    const matchingWord = words.find(word => word.text === value);
    if (matchingWord) {
      playSound('correct');
      setWords(prev => prev.filter(word => word.id !== matchingWord.id));
      setScore(prev => prev + 10);
      setSpeed(prev => prev + 0.1);
      setCarPosition(prev => Math.min(90, prev + 5));
      setCurrentInput('');
      spawnWord();
    }
  };

  const endGame = async () => {
    setIsGameOver(true);
    try {
      await axios.post('http://localhost:5000/api/games/save', {
        gameName: 'Speed Racer',
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
      className="speed-racer-game"
    >
      <div className="game-header">
        <h2 className="neon-text">Speed Racer</h2>
        <div className="game-stats">
          <span>Score: {score}</span>
          <span>Speed: {speed.toFixed(1)}x</span>
          <span>Time: {timeLeft}s</span>
        </div>
      </div>

      <div className="race-track">
        <div className="car" style={{ left: `${carPosition}%` }}>
          🚗
        </div>
        {words.map(word => (
          <div key={word.id} className="track-word" style={{ left: `${word.x}%` }}>
            {word.text}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={currentInput}
        onChange={handleInputChange}
        className="game-input"
        placeholder="Type to accelerate!"
        disabled={isGameOver}
      />

      {isGameOver && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="game-over card"
        >
          <h3>Race Finished!</h3>
          <p>Final Score: {score}</p>
          <button className="btn" onClick={startGame}>Race Again</button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SpeedRacer;
