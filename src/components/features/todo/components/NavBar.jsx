import { Link } from "react-router-dom";
import "../styles/todoNav.css";
; // 👈 Make sure this path is correct based on where NavBar is saved!

export default function NavBar() {
  return (
    <nav className="nav-bar">
      <Link to="/" className="nav-link">TASKS</Link>
      <Link to="/dashboard" className="nav-link">AI DASHBOARD</Link>
    </nav>
  );
}
