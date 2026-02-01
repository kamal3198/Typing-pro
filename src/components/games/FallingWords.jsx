import React, { useState, useEffect, useRef, useCallback } from 'react';
import './FallingWords.css'; // Assuming a CSS file for styling
import { useTheme } from '../../../src/contexts/ThemeContext'; // Adjust path as necessary
import { useSound } from '../../../src/contexts/SoundContext'; // Adjust path as necessary

const FallingWords = () => {
  const { theme } = useTheme();
  const { soundEnabled } = useSound();

  const [words, setWords] = useState([]); // Array of falling words { id, text, x, y, speed, color }
  const [inputValue, setInputValue] = useState(''); // User input
  const [score, setScore] = useState(0);
  const [correctChars, setCorrectChars] = useState(0); // Use for WPM/Accuracy calculation
  const [incorrectChars, setIncorrectChars] = useState(0); // Use for WPM/Accuracy calculation
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // Game duration in seconds

  const gameContainerRef = useRef(null);
  const inputRef = useRef(null);
  const wordIntervalRef = useRef(null);
  const timerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const startTimeRef = useRef(null);

  const GAME_DURATION = 60; // seconds
  const WORD_SPAWN_INTERVAL = 1500; // milliseconds
  const BASE_WORD_SPEED = 1;
  const SPEED_INCREMENT_PER_SECOND = 0.05;

  // Function to generate a new word
  const generateWord = useCallback(() => {
    const possibleWords = [
      'apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew',
      'kiwi', 'lemon', 'mango', 'nectarine', 'orange', 'papaya', 'quince', 'raspberry',
      'strawberry', 'tangerine', 'watermelon', 'apricot', 'blueberry', 'cantaloupe',
      'dragonfruit', 'gooseberry', 'lime', 'melon', 'olive', 'peach', 'pear', 'plum'
    ]; // Example word list
    const wordText = possibleWords[Math.floor(Math.random() * possibleWords.length)];
    const containerWidth = gameContainerRef.current ? gameContainerRef.current.offsetWidth : 500;
    const wordWidth = 100; // Estimate word visual width for positioning
    const xPosition = Math.random() * (containerWidth - wordWidth);
    const currentSpeed = BASE_WORD_SPEED + (GAME_DURATION - timeLeft) * SPEED_INCREMENT_PER_SECOND * 0.1; // Speed increases slightly over time

    return {
      id: Date.now() + Math.random(), // Unique ID
      text: wordText,
      x: xPosition,
      y: 0, // Start at the top
      speed: currentSpeed,
      color: '#' + Math.floor(Math.random()*16777215).toString(16) // Random color
    };
  }, [timeLeft]); // Speed depends on time left which affects difficulty

  // Start game logic
  const startGame = useCallback(() => {
    setScore(0);
    setCorrectChars(0);
    setIncorrectChars(0);
    setWpm(0);
    setAccuracy(100);
    setIsGameOver(false);
    setTimeLeft(GAME_DURATION); // Reset timer
    setInputValue('');
    setWords([]); // Clear existing words

    // Focus input field
    inputRef.current?.focus();

    // Reset and start timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          setIsGameOver(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Reset and start generating words
    if (wordIntervalRef.current) clearInterval(wordIntervalRef.current);
    wordIntervalRef.current = setInterval(() => {
      setWords(prevWords => [...prevWords, generateWord()]);
    }, WORD_SPAWN_INTERVAL);

    startTimeRef.current = Date.now(); // Record the start time
  }, [generateWord]);

  // Handle user input
  const handleInputChange = useCallback((e) => {
    if (isGameOver) return;

    const value = e.target.value;
    setInputValue(value);

    const currentInputLower = value.toLowerCase();
    const currentWordObj = words.find(word => word.text.toLowerCase() === currentInputLower);
    
    // If the user has typed a complete word with a space
    if (value.endsWith(' ') && currentInputLower.trim() !== '') {
      const typedWord = value.trim().toLowerCase();
      const matchedWordObj = words.find(word => word.text.toLowerCase() === typedWord);

      if (matchedWordObj) {
        // Correct word match
        setScore(prevScore => prevScore + Math.round(matchedWordObj.text.length * matchedWordObj.speed));
        setCorrectChars(prev => prev + matchedWordObj.text.length);
        setWords(prevWords => prevWords.filter(word => word.id !== matchedWordObj.id));
        if (soundEnabled) playKeySound(); // Assuming playKeySound is available
      } else {
        // Incorrect word match or word that is not in the list
        // For simplicity, we'll count the typed word as entirely incorrect if it doesn't match precisely.
        // A more complex logic could count character mismatches.
        const incorrectCount = typedWord.length; // Count all typed chars as incorrect if word is wrong
        setIncorrectChars(prev => prev + incorrectCount);
        setWords(prevWords => prevWords.filter(word => word.text.toLowerCase() === typedWord)); // Remove matched word if it happened to be there
        if (soundEnabled) playErrorSound(); // Assuming playErrorSound is available
      }
      setInputValue(''); // Clear input after match/miss
      return;
    }

    // Update accuracy and WPM dynamically as user types (optional, can be performance intensive)
    // For now, we can rely on the final calculation at the end/useEffect.
    // If dynamic update: recalculate based on current input vs current word.

  }, [words, isGameOver, soundEnabled, playKeySound, playErrorSound]); // Dependencies for useCallback

  // Animate word positions and check for misses
  useEffect(() => {
    const tick = () => {
      if (isGameOver) return;

      setWords(prevWords => {
        const containerHeight = gameContainerRef.current ? gameContainerRef.current.offsetHeight : 600;
        const updatedWords = [];
        let missedWordDetected = false;

        for (const word of prevWords) {
          const newY = word.y + word.speed;
          if (newY < containerHeight) {
            updatedWords.push({ ...word, y: newY });
          } else {
            // Word missed the bottom
            setIncorrectChars(prev => prev + word.text.length); // Count missed word chars as incorrect
            missedWordDetected = true;
          }
        }

        if (missedWordDetected) {
          // Optionally play an error sound or update score/UI
          if (soundEnabled) playErrorSound();
        }

        return updatedWords;
      });
      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [isGameOver, gameContainerRef, soundEnabled, playErrorSound]); // Re-run when words, isGameOver, or container dimensions change

  // Cleanup intervals and animation frames on game over or unmount
  useEffect(() => {
    return () => {
      clearInterval(wordIntervalRef.current);
      clearInterval(timerRef.current);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []); // Run only on mount and unmount

  // Update WPM and Accuracy
  useEffect(() => {
    // Recalculate WPM and Accuracy periodically or on relevant state changes
    // Doing it too often can impact performance. Here, we'll do it based on score/chars.
    const typedChars = correctChars + incorrectChars;
    const elapsedTimeInMinutes = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 / 60 : 0;

    if (elapsedTimeInMinutes > 0) {
      const calculatedWpm = Math.round((correctChars / 5) / elapsedTimeInMinutes); // Assuming 5 chars per word
      setWpm(calculatedWpm);

      const calculatedAccuracy = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 100;
      setAccuracy(calculatedAccuracy);
    } else {
        // If timer hasn't started yet or is 0, WPM is 0
        setWpm(0);
        setAccuracy(100);
    }
  }, [correctChars, incorrectChars, score, startGame]); // Recalculate when these states change

  // Game over state handling
  useEffect(() => {
    if (isGameOver) {
      clearInterval(wordIntervalRef.current);
      clearInterval(timerRef.current);
      cancelAnimationFrame(animationFrameRef.current);
      inputRef.current?.blur(); // Remove focus from input
      
      // Calculate final WPM and Accuracy
      const typedChars = correctChars + incorrectChars;
      const totalTimeInMinutes = GAME_DURATION / 60; // Fixed duration
      
      const finalWpm = typedChars > 0 ? Math.round((correctChars / 5) / totalTimeInMinutes) : 0;
      setWpm(finalWpm);
      
      const finalAccuracy = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 100;
      setAccuracy(finalAccuracy);

      // Here you would typically call a saveResult function for the backend
      // saveResult({ gameName: 'Falling Words', score, wpm: finalWpm, accuracy: finalAccuracy, time: GAME_DURATION }); // Placeholder
    }
  }, [isGameOver, score, correctChars, incorrectChars, startGame]); // Dependencies for game over logic

  // Effect to handle initial focus on input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Mock sound functions for now if contexts are not fully available or for testing
  const playKeySound = useCallback(() => { /* sound logic */ }, []);
  const playErrorSound = useCallback(() => { /* sound logic */ }, []);

  return (
    <div className={`falling-words-game game-card ${theme.theme}-theme ${soundEnabled ? 'sound-on' : 'sound-off'}`}>
      <h2>Falling Words</h2>
      <div className="game-info">
        <span>Time Left: {timeLeft}s</span>
        <span>WPM: {wpm}</span>
        <span>Accuracy: {accuracy}%</span>
        <span>Score: {score}</span>
      </div>

      <div className="game-container" ref={gameContainerRef} style={{ height: '400px', position: 'relative', overflow: 'hidden' }}>
        {words.map(word => (
          <div
            key={word.id}
            className="falling-word"
            style={{
              position: 'absolute',
              left: word.x,
              top: word.y,
              color: word.color,
              fontSize: '24px',
              fontWeight: 'bold',
              textShadow: '0 0 5px rgba(255,255,255,0.7)',
              animation: !isGameOver ? `fall ${word.speed * 10}s linear 0s 1 running` : 'none', // Basic animation, needs more control
              // Fallback for animation if CSS doesn't apply well
              transition: !isGameOver ? `top ${word.speed}s linear` : 'none',
            }}
          >
            {word.text}
          </div>
        ))}
        {isGameOver && (
          <div className="game-over-overlay">
            <div className="game-over-message">
              <h2>Game Over!</h2>
              <p>Final Score: {score}</p>
              <p>Your WPM: {wpm}</p>
              <p>Your Accuracy: {accuracy}%</p>
              <button onClick={startGame}>Play Again</button>
            </div>
          </div>
        )}
      </div>

      {!isGameOver && (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type words as they fall..."
          className="game-input"
          disabled={isGameOver}
          autoComplete="off"
          style={{ 
            marginTop: '20px', 
            padding: '10px', 
            fontSize: '18px', 
            width: '80%',
            textAlign: 'center'
          }}
        />
      )}
    </div>
  );
};

export default FallingWords;
