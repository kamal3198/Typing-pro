import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { ThemeContext } from '../contexts/ThemeContext';
import { useSound } from '../contexts/SoundContext';

const Settings = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const { isSoundOn, toggleSound } = useSound();
  const [fontFamily, setFontFamily] = useState(localStorage.getItem('fontFamily') || 'monospace');

  const fontOptions = [
    { value: 'monospace', label: 'Monospace' },
    { value: 'serif', label: 'Serif' },
    { value: 'sans-serif', label: 'Sans Serif' },
    { value: 'cursive', label: 'Cursive' }
  ];

  const handleFontChange = (font) => {
    setFontFamily(font);
    localStorage.setItem('fontFamily', font);
    document.documentElement.style.setProperty('--font-family', font);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="settings-page"
    >
      <h1 className="neon-text">Settings</h1>

      <div className="settings-container">
        <div className="setting-item card">
          <h3>Theme</h3>
          <div className="toggle-container">
            <span>Light</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={isDark}
                onChange={toggleTheme}
              />
              <span className="slider"></span>
            </label>
            <span>Dark</span>
          </div>
        </div>

        <div className="setting-item card">
          <h3>Sound Effects</h3>
          <div className="toggle-container">
            <span>Off</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={isSoundOn}
                onChange={toggleSound}
              />
              <span className="slider"></span>
            </label>
            <span>On</span>
          </div>
        </div>

        <div className="setting-item card">
          <h3>Typing Font</h3>
          <select
            value={fontFamily}
            onChange={(e) => handleFontChange(e.target.value)}
            className="font-select"
          >
            {fontOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="setting-item card">
          <h3>Test Timers</h3>
          <p>Default timer settings for typing tests</p>
          <div className="timer-options">
            <button className="btn">15s</button>
            <button className="btn">30s</button>
            <button className="btn">60s</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
