import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useSound } from '../contexts/SoundContext';

const NormalTest = () => {
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [mistakes, setMistakes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRef = useRef(null);
  const { playSound } = useSound();

  useEffect(() => {
    generateWords();
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timeLeft === 0) {
      finishTest();
    }
  }, [isActive, timeLeft]);

  const generateWords = () => {
    const wordList = [
      'the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog',
      'hello', 'world', 'typing', 'speed', 'test', 'practice', 'improve',
      'keyboard', 'mouse', 'screen', 'computer', 'programming'
    ];
    const newWords = [];
    for (let i = 0; i < 50; i++) {
      newWords.push(wordList[Math.floor(Math.random() * wordList.length)]);
    }
    setWords(newWords);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (!isActive) {
      setIsActive(true);
    }
    setCurrentInput(value);

    if (value === words[currentWordIndex] + ' ') {
      // Correct word
      playSound('correct');
      setCurrentWordIndex(currentWordIndex + 1);
      setCurrentInput('');
      calculateWPM();
    } else if (value.endsWith(' ')) {
      // Incorrect word
      playSound('mistake');
      setMistakes(mistakes + 1);
      setCurrentInput('');
    }
  };

  const calculateWPM = () => {
    const timeElapsed = timer - timeLeft;
    const wordsTyped = currentWordIndex + 1;
    const wpm = timeElapsed > 0 ? Math.round((wordsTyped / timeElapsed) * 60) : 0;
    setWpm(wpm);
  };

  const calculateAccuracy = () => {
    const totalChars = words.slice(0, currentWordIndex).join(' ').length;
    const correctChars = totalChars - mistakes;
    const acc = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    setAccuracy(acc);
  };

  const finishTest = async () => {
    setIsActive(false);
    setIsFinished(true);
    calculateAccuracy();

    try {
      await axios.post('http://localhost:5000/api/tests/save', {
        type: 'normal',
        wpm,
        accuracy,
        mistakes,
        time: timer
      });
    } catch (error) {
      console.error('Error saving test:', error);
    }
  };

  const restartTest = () => {
    setCurrentWordIndex(0);
    setCurrentInput('');
    setWpm(0);
    setAccuracy(100);
    setMistakes(0);
    setTimeLeft(timer);
    setIsActive(false);
    setIsFinished(false);
    generateWords();
    inputRef.current.focus();
  };

  const setTestTimer = (newTimer) => {
    setTimer(newTimer);
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
};

export default NormalTest;
