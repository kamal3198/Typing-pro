import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [recentTests, setRecentTests] = useState([]);

  useEffect(() => {
    fetchRecentTests();
  }, []);

  const fetchRecentTests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tests/history');
      setRecentTests(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching recent tests:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="home-page"
    >
      <div className="hero-section">
        <h1 className="neon-text">TypingSpeed Pro</h1>
        <p>Master your typing skills with our interactive platform</p>
      </div>

      <div className="action-buttons">
        <Link to="/normal-test">
          <motion.button
            className="btn large-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Normal Test
          </motion.button>
        </Link>
        <Link to="/paragraph-test">
          <motion.button
            className="btn large-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Paragraph Test
          </motion.button>
        </Link>
        <Link to="/games">
          <motion.button
            className="btn large-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Games
          </motion.button>
        </Link>
        <Link to="/history">
          <motion.button
            className="btn large-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            History
          </motion.button>
        </Link>
        <Link to="/settings">
          <motion.button
            className="btn large-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Settings
          </motion.button>
        </Link>
      </div>

      {recentTests.length > 0 && (
        <div className="recent-tests card">
          <h2>Recent Tests</h2>
          {recentTests.map((test, index) => (
            <div key={index} className="recent-test-item">
              <span>{test.type} Test</span>
              <span>WPM: {test.wpm}</span>
              <span>Accuracy: {test.accuracy}%</span>
              <span>{new Date(test.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}

      <div className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-item card">
            <h3>Real-time Feedback</h3>
            <p>Get instant feedback on your typing speed and accuracy</p>
          </div>
          <div className="feature-item card">
            <h3>Interactive Games</h3>
            <p>Learn typing through fun, engaging games</p>
          </div>
          <div className="feature-item card">
            <h3>Progress Tracking</h3>
            <p>Monitor your improvement over time with detailed analytics</p>
          </div>
          <div className="feature-item card">
            <h3>Customizable Settings</h3>
            <p>Adjust themes, sounds, and fonts to your preference</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
