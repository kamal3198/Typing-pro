import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import './Home.css';

const Home = () => {
  type Test = { type: string; wpm: number; accuracy: number; mistakes: number; createdAt: string };
  const [recentTests, setRecentTests] = useState<Test[]>([]);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      className="home"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="hero-section">
        <motion.h1
          className="hero-title"
          variants={itemVariants}
        >
          Welcome to <span className="highlight">TypingSpeed Pro</span>
        </motion.h1>
        <motion.p
          className="hero-subtitle"
          variants={itemVariants}
        >
          Master your typing skills with our interactive platform featuring tests, games, and analytics.
        </motion.p>

        <motion.div
          className="action-buttons"
          variants={itemVariants}
        >
          <Link to="/normal-test" className="btn btn-primary">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Normal Test
            </motion.span>
          </Link>
          <Link to="/paragraph-test" className="btn btn-secondary">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Paragraph Test
            </motion.span>
          </Link>
          <Link to="/games" className="btn btn-accent">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Play Games
            </motion.span>
          </Link>
        </motion.div>
      </div>

      {recentTests.length > 0 && (
        <motion.div
          className="recent-tests"
          variants={itemVariants}
        >
          <h2>Recent Tests</h2>
          <div className="tests-grid">
            {recentTests.map((test, index) => (
              <motion.div
                key={index}
                className="test-card"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="test-type">{test.type}</div>
                <div className="test-stats">
                  <div className="stat">
                    <span className="stat-label">WPM:</span>
                    <span className="stat-value">{test.wpm}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Accuracy:</span>
                    <span className="stat-value">{test.accuracy}%</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Mistakes:</span>
                    <span className="stat-value">{test.mistakes}</span>
                  </div>
                </div>
                <div className="test-date">
                  {new Date(test.createdAt).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        className="features-section"
        variants={itemVariants}
      >
        <h2>Features</h2>
        <div className="features-grid">
          <motion.div
            className="feature-card"
            whileHover={{ scale: 1.05 }}
          >
            <div className="feature-icon">⚡</div>
            <h3>Real-time Analytics</h3>
            <p>Track your WPM, accuracy, and mistakes in real-time</p>
          </motion.div>
          <motion.div
            className="feature-card"
            whileHover={{ scale: 1.05 }}
          >
            <div className="feature-icon">🎮</div>
            <h3>Interactive Games</h3>
            <p>5 fun typing games to improve your skills</p>
          </motion.div>
          <motion.div
            className="feature-card"
            whileHover={{ scale: 1.05 }}
          >
            <div className="feature-icon">📊</div>
            <h3>Progress Charts</h3>
            <p>Visualize your improvement over time</p>
          </motion.div>
          <motion.div
            className="feature-card"
            whileHover={{ scale: 1.05 }}
          >
            <div className="feature-icon">🎨</div>
            <h3>Customizable</h3>
            <p>Dark/light themes and sound controls</p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Home;
