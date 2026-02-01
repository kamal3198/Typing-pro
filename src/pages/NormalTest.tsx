import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useSound } from '../contexts/SoundContext';
import './NormalTest.css';

const NormalTest = () => {
  const { soundEnabled } = useSound();

  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [mistakes, setMistakes] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<number | null>(null);

  // Generate random words
  const generateWords = () => {
    const wordList = [
      'the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog',
      'hello', 'world', 'typing', 'speed', 'test', 'practice', 'improve',
      'keyboard', 'computer', 'screen', 'mouse', 'click', 'scroll',
      'window', 'file', 'folder', 'document', 'text', 'word', 'sentence',
      'paragraph', 'page', 'book', 'read', 'write', 'edit', 'save',
      'open', 'close', 'new', 'old', 'fast', 'slow', 'good', 'bad',
      'right', 'wrong', 'correct', 'incorrect', 'easy', 'hard', 'simple',
      'complex', 'short', 'long', 'small', 'large', 'big', 'tiny'
    ];

    const generatedWords = [];
    for (let i = 0; i < 200; i++) {
      generatedWords.push(wordList[Math.floor(Math.random() * wordList.length)]);
    }
    return generatedWords;
  };

  useEffect(() => {
    setWords(generateWords());
  }, []);

  useEffect(() => {
    let interval: number | undefined;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsActive(false);
            setIsFinished(true);
            saveResult();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (isActive && startTimeRef.current) {
      const elapsedTime = (Date.now() - startTimeRef.current) / 1000 / 60; // in minutes
      const typedChars = correctChars + incorrectChars;
      const calculatedWpm = elapsedTime > 0 ? Math.round((typedChars / 5) / elapsedTime) : 0;
      setWpm(calculatedWpm);

      const calculatedAccuracy = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 100;
      setAccuracy(calculatedAccuracy);
    }
  }, [correctChars, incorrectChars, isActive]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!isActive && value.length > 0) {
      setIsActive(true);
      startTimeRef.current = Date.now();
    }

    if (isFinished) return;

    setCurrentInput(value);

    const currentWord = words[currentWordIndex];
    if (value === currentWord + ' ') {
      // Word completed correctly
      setCorrectChars(prev => prev + currentWord.length + 1);
      setCurrentWordIndex(prev => prev + 1);
      setCurrentInput('');
      if (soundEnabled) playKeySound();
    } else if (value.length > currentWord.length && value[currentWord.length] === ' ') {
      // Word completed with mistakes
      const mistakesInWord = value.length - currentWord.length - 1;
      setIncorrectChars(prev => prev + mistakesInWord);
      setMistakes(prev => prev + mistakesInWord);
      setCurrentWordIndex(prev => prev + 1);
      setCurrentInput('');
      if (soundEnabled) playErrorSound();
    } else if (value.length <= currentWord.length) {
      // Typing current word
      let correct = 0;
      let incorrect = 0;
      for (let i = 0; i < value.length; i++) {
        if (value[i] === currentWord[i]) {
          correct++;
        } else {
          incorrect++;
        }
      }
      // Update totals simply
      setCorrectChars(prev => prev + correct);
      setIncorrectChars(prev => prev + incorrect);
    }
  };

  // WebAudio helper sounds
  const playKeySound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 880;
      g.gain.value = 0.02;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      setTimeout(() => { o.stop(); ctx.close(); }, 60);
    } catch (e) {
      // no-op
    }
  };

  const playErrorSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sawtooth';
      o.frequency.value = 220;
      g.gain.value = 0.04;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      setTimeout(() => { o.stop(); ctx.close(); }, 120);
    } catch (e) {
      // no-op
    }
  };

  const saveResult = async () => {
    const timeSpent = startTimeRef.current ? Math.round((Date.now() - startTimeRef.current) / 1000) : 0;
    try {
      await axios.post('http://localhost:5000/api/tests/save', {
        type: 'normal',
        wpm,
        accuracy,
        mistakes,
        time: timeSpent
      });
    } catch (error) {
      console.error('Error saving test:', error);
    }
  };

  const restartTest = () => {
    setWords(generateWords());
    setCurrentWordIndex(0);
    setCurrentInput('');
    setCorrectChars(0);
    setIncorrectChars(0);
    setWpm(0);
    setAccuracy(100);
    setTimeLeft(60);
    setIsActive(false);
    setIsFinished(false);
    setMistakes(0);
    if (inputRef.current) inputRef.current.focus();
  };

  const setTestTimer = (newTimer: number) => {
    setTimeLeft(newTimer);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="normal-test"
    >
      <div className="test-header">
        <h1 className="neon-text">Normal Typing Test</h1>
        <div className="stats">
          <div className="stat">WPM: <span className="neon-text">{wpm}</span></div>
          <div className="stat">Accuracy: <span className="neon-text">{accuracy}%</span></div>
          <div className="stat">Time: <span className="neon-text">{timeLeft}s</span></div>
        </div>
      </div>

      <div className="timer-buttons">
        <button className="btn" onClick={() => setTestTimer(15)}>15s</button>
        <button className="btn" onClick={() => setTestTimer(30)}>30s</button>
        <button className="btn" onClick={() => setTestTimer(60)}>60s</button>
      </div>

      <div className="typing-area">
        {words.map((word, index) => (
          <span
            key={index}
            className={`word ${
              index < currentWordIndex ? 'correct' :
              index === currentWordIndex ? 'current' : ''
            }`}
          >
            {word}{' '}
          </span>
        ))}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={currentInput}
        onChange={handleInputChange}
        disabled={isFinished}
        className="typing-input"
        placeholder="Start typing..."
      />

      {isFinished && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="result-card card"
        >
          <h2>Test Complete!</h2>
          <p>WPM: {wpm}</p>
          <p>Accuracy: {accuracy}%</p>
          <p>Mistakes: {mistakes}</p>
          <button className="btn" onClick={restartTest}>Restart</button>
        </motion.div>
      )}
    </motion.div>
  );
}

export default NormalTest;
