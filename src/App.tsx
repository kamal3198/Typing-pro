import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { SoundProvider } from './contexts/SoundContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import NormalTest from './pages/NormalTest';
import ParagraphTest from './pages/ParagraphTest';
import Games from './pages/Games';
import History from './pages/History';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <SoundProvider>
        <Router>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/normal-test" element={<NormalTest />} />
                <Route path="/paragraph-test" element={<ParagraphTest />} />
                <Route path="/games" element={<Games />} />
                <Route path="/history" element={<History />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
        </Router>
      </SoundProvider>
    </ThemeProvider>
  );
}

export default App;
