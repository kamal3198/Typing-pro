import React, { useState, useEffect, useRef, useCallback } from 'react';
import './SpeedRacer.css'; // Assuming a CSS file for styling
import { useTheme } from '../../../src/contexts/ThemeContext'; // Adjust path as necessary
import { useSound } from '../../../src/contexts/SoundContext'; // Adjust path as necessary

const SpeedRacer = () => {
  const { theme } = useTheme();
  const { soundEnabled } = useSound();

  const [words, setWords] = useState([]); // Array of words to type { id, text, x, y, speed }
  const [inputValue, setInputValue] = useState(''); // User input
  const [score, setScore] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isGameOver, setIsGameOver] = useState(false);
  const [level, setLevel] = useState(1); // Game level/difficulty
  const [carPosition, setCarPosition] = useState(0); // Car's horizontal position
  const [combo, setCombo] = useState(0); // Combo multiplier

  const gameContainerRef = useRef(null);
  const inputRef = useRef(null);
  const wordTimerRef = useRef(null);
  const carAnimationRef = useRef(null);
  const gameDurationTimerRef = useRef(null);
  const startTimeRef = useRef(null);

  const GAME_DURATION = 60; // seconds
  const BASE_WORD_SPAWN_INTERVAL = 1200; // milliseconds
  const BASE_WORD_SPEED = 0.8;
  const SPEED_INCREMENT_PER_LEVEL = 0.1;
  const CAR_BASE_SPEED = 5; // pixels per frame
  const COMBO_MULTIPLIER = 1.2; // Speed boost per combo

  // Get random word and its X position
  const generateWord = useCallback(() => {
    const possibleWords = ['race', 'fast', 'speed', 'drive', 'nitro', 'track', 'finish', 'win', 'go', 'fasten']; // Example words
    const wordText = possibleWords[Math.floor(Math.random() * possibleWords.length)];
    const containerWidth = gameContainerRef.current ? gameContainerRef.current.offsetWidth : 600;
    const wordWidth = 80; // Approximate word width for positioning
    const xPosition = Math.random() * (containerWidth - wordWidth);
    const currentSpeed = BASE_WORD_SPEED + (level - 1) * SPEED_INCREMENT_PER_LEVEL;

    return {
      id: Date.now() + Math.random(),
      text: wordText,
      x: xPosition,
      y: 0,
      speed: currentSpeed,
    };
  }, [level]);

  // Start Game Logic
  const startGame = useCallback(() => {
    setScore(0);
    setCorrectChars(0);
    setIncorrectChars(0);
    setWpm(0);
    setAccuracy(100);
    setIsGameOver(false);
    setLevel(1);
    setCarPosition(0);
    setCombo(0);
    setWords([]);
    setInputValue('');
    setTimeLeft(GAME_DURATION);

    inputRef.current?.focus();

    // Reset and start game duration timer
    if (gameDurationTimerRef.current) clearInterval(gameDurationTimerRef.current);
    gameDurationTimerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(gameDurationTimerRef.current);
          setIsGameOver(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Reset and start word generation
    if (wordTimerRef.current) clearInterval(wordTimerRef.current);
    wordTimerRef.current = setInterval(() => {
      setWords(prevWords => [...prevWords, generateWord()]);
    }, BASE_WORD_SPAWN_INTERVAL);

    startTimeRef.current = Date.now();
  }, [generateWord]);

  // Handle User Input
  const handleInputChange = useCallback((e) => {
    if (isGameOver) return;

    const value = e.target.value;
    setInputValue(value);

    const currentInputLower = value.toLowerCase();
    // Find if the current input matches any of the falling words exactly
    const matchedWord = words.find(word => word.text.toLowerCase() === currentInputLower.trim());

    if (value.endsWith(' ') && currentInputLower.trim() !== '') {
        const typedWord = value.trim().toLowerCase();
        const wordObjToMatch = words.find(word => word.text.toLowerCase() === typedWord);

        if (wordObjToMatch) {
            // Word typed correctly
            const points = Math.round(typedWord.length * wordObjToMatch.speed * (1 + combo * 0.1)); // Score based on length, speed, and combo
            setScore(prevScore => prevScore + points);
            setCorrectChars(prev => prev + typedWord.length);
            setCombo(prev => prev + 1); // Increase combo
            
            // Move car forward based on cleared word's length and combo
            const wordLength = typedWord.length;
            const comboBoost = combo * 0.5; // Small boost for combo
            setCarPosition(prevPos => Math.min(prevPos + wordLength * 2 + comboBoost, (gameContainerRef.current?.offsetWidth || 600) - 50)); // Move car, don't let it go off screen

            setWords(prevWords => prevWords.filter(word => word.id !== wordObjToMatch.id));
            setInputValue('');
            if (soundEnabled) playKeySound(); // Assuming playKeySound is available
        } else {
            // Incorrect word typed or word not found
            setIncorrectChars(prev => prev + typedWord.length); // Count all characters as incorrect
            setCombo(0); // Reset combo
            if (soundEnabled) playErrorSound(); // Assuming playErrorSound is available
        }
        // Check for level up condition (e.g., certain score or words cleared)
        // For now, level up can be tied to score or words cleared.
        // Let's simplify and not implement level up for now, but it's a feature to consider.
    }
  }, [words, isGameOver, score, combo, soundEnabled, playKeySound, playErrorSound, startGame]); // Dependencies for useCallback

  // Animate words falling and check for misses
  useEffect(() => {
    const tick = () => {
      if (isGameOver) return;

      setWords(prevWords => {
        const containerHeight = gameContainerRef.current ? gameContainerRef.current.offsetHeight : 600;
        const updatedWords = [];
        let missedWords = 0;

        for (const word of prevWords) {
          const newY = word.y + word.speed;
          if (newY < containerHeight) {
            updatedWords.push({ ...word, y: newY });
          } else {
            // Word missed the bottom
            setIncorrectChars(prev => prev + word.text.length); // Count missed word chars as incorrect
            setCombo(0); // Reset combo on miss
            missedWords++;
            if (soundEnabled) playErrorSound();
          }
        }

        // Optionally adjust difficulty based on missed words
        // if (missedWords > 0) { /* .. adjust speed etc. .. */ }

        return updatedWords;
      });
      carAnimationRef.current = requestAnimationFrame(tick);
    };

    carAnimationRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(carAnimationRef.current);
  }, [isGameOver, gameContainerRef, soundEnabled, playErrorSound]); // Re-run when game state or dimensions change

  // Cleanup intervals and animation frames
  useEffect(() => {
    return () => {
      clearInterval(wordTimerRef.current);
      clearInterval(gameDurationTimerRef.current);
      cancelAnimationFrame(carAnimationRef.current);
    };
  }, []);

  // Update WPM and Accuracy
  useEffect(() => {
    // Recalculate WPM and Accuracy periodically or on relevant state changes
    const typedChars = correctChars + incorrectChars;
    const elapsedTimeInMinutes = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 / 60 : 0;

    if (elapsedTimeInMinutes > 0) {
      const calculatedWpm = Math.round((correctChars / 5) / elapsedTimeInMinutes); // Assuming 5 chars per word
      setWpm(calculatedWpm);

      const calculatedAccuracy = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 100;
      setAccuracy(calculatedAccuracy);
    } else {
      setWpm(0);
      setAccuracy(100);
    }
  }, [correctChars, incorrectChars, score, startGame, timeLeft]); // Recalculate when these states change

  // Game over state handling
  useEffect(() => {
    if (isGameOver) {
      clearInterval(wordTimerRef.current);
      clearInterval(gameDurationTimerRef.current);
      cancelAnimationFrame(carAnimationRef.current);
      inputRef.current?.blur(); // Remove focus from input

      // Final calculations for score, WPM, Accuracy
      const typedChars = correctChars + incorrectChars;
      const totalTimeInMinutes = GAME_DURATION / 60;
      const finalWpm = typedChars > 0 ? Math.round((correctChars / 5) / totalTimeInMinutes) : 0;
      const finalAccuracy = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 100;
      setWpm(finalWpm);
      setAccuracy(finalAccuracy);

      // saveResult({ gameName: 'Speed Racer', score, wpm: finalWpm, accuracy: finalAccuracy, time: GAME_DURATION }); // Placeholder
    }
  }, [isGameOver, score, correctChars, incorrectChars, startGame]);

  // Effect to handle initial focus on input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Mock sound functions
  const playKeySound = useCallback(() => { /* sound logic */ }, []);
  const playErrorSound = useCallback(() => { /* sound logic */ }, []);

  return (
    <div className={`speed-racer-game game-card ${theme.theme}-theme ${soundEnabled ? 'sound-on' : 'sound-off'}`}>
      <h2>Speed Racer</h2>
      <div className="game-info">
        <span>Time Left: {timeLeft}s</span>
        <span>Lvl: {level}</span>
        <span>WPM: {wpm}</span>
        <span>Accuracy: {accuracy}%</span>
        <span>Score: {score}</span>
        <span>Combo: x{combo}</span>
      </div>

      <div className="game-container" ref={gameContainerRef} style={{ height: '400px', position: 'relative', overflow: 'hidden' }}>
        {/* Car */}
        <div
          className="race-car"
          style={{
            position: 'absolute',
            bottom: '10px', // Position at the bottom
            left: carPosition,
            width: '50px', // Example size
            height: '30px', // Example size
            backgroundColor: 'cyan', // Example color
            transition: 'left 0.1s linear', // Smooth movement
            // Add actual car image/component here
          }}
        ></div>

        {/* Words */}
        {words.map(word => (
          <div
            key={word.id}
            className="falling-word"
            style={{
              position: 'absolute',
              left: word.x,
              top: word.y,
              color: word.color,
              fontSize: '20px',
              fontWeight: 'bold',
              textShadow: '0 0 5px rgba(255,255,255,0.7)',
              // Animation for falling words
              transition: `top ${word.speed}s linear`,
            }}
          >
            {word.text}
          </div>
        ))}

        {isGameOver && (
          <div className="game-over-overlay">
            <div className="game-over-message">
              <h2>Race Finished!</h2>
              <p>Final Score: {score}</p>
              <p>Your WPM: {wpm}</p>
              <p>Your Accuracy: {accuracy}%</p>
              <button onClick={startGame}>Race Again</button>
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
          placeholder="Type words to boost speed..."
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

export default SpeedRacer;
