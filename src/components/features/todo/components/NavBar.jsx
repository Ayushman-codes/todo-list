import { Link, useNavigate } from "react-router-dom";
import { useTodo } from "../TodoContext";
import { signOut } from "firebase/auth";
import { auth } from "../../../../firebase";
import { toast } from "react-toastify";
import "../styles/todoNav.css";

export default function NavBar() {
  const { user } = useTodo();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.info("Protocol disconnected. Goodbye!");
      navigate("/login");
    } catch (error) {
      toast.error("Error logging out!");
    }
  };

  return (
    <nav className="nav-bar">
      {/* 1. Show Authenticate if logged out, Logout if logged in */}
      {!user ? (
        <Link to="/login" className="nav-link">
          AUTHENTICATE
        </Link>
      ) : (
        <button
          onClick={handleLogout}
          className="nav-link"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          LOGOUT
        </button>
      )}

      {/* 2. ONLY show these links if the user is logged in! */}
      {user && (
        <>
          <Link to="/" className="nav-link">
            TASKS
          </Link>
          <Link to="/dashboard" className="nav-link">
            AI DASHBOARD
          </Link>
        </>
      )}
    </nav>
  );
}
