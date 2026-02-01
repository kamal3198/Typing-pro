import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">TypingSpeed Pro</div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/normal-test">Normal Test</Link>
        <Link to="/paragraph-test">Paragraph Test</Link>
        <Link to="/games">Games</Link>
      </div>
    </nav>
  );
}
