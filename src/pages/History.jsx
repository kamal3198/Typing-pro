import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const History = () => {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tests/history');
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const filteredHistory = history.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const deleteEntry = (id) => {
    // In a real app, you'd call an API to delete
    setHistory(prev => prev.filter(item => item._id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="history-page"
    >
      <h1 className="neon-text">Typing History</h1>

      <div className="filter-buttons">
        <button className={`btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
        <button className={`btn ${filter === 'normal' ? 'active' : ''}`} onClick={() => setFilter('normal')}>Normal Tests</button>
        <button className={`btn ${filter === 'paragraph' ? 'active' : ''}`} onClick={() => setFilter('paragraph')}>Paragraph Tests</button>
      </div>

      <div className="history-table">
        <table className="card">
          <thead>
            <tr>
              <th>Type</th>
              <th>WPM</th>
              <th>Accuracy</th>
              <th>Mistakes</th>
              <th>Time</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((entry) => (
              <tr key={entry._id}>
                <td>{entry.type}</td>
                <td>{entry.wpm}</td>
                <td>{entry.accuracy}%</td>
                <td>{entry.mistakes}</td>
                <td>{entry.time}s</td>
                <td>{new Date(entry.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn delete-btn" onClick={() => deleteEntry(entry._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default History;
