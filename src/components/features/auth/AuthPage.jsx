import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../../firebase";
import { toast } from "react-toastify";

// 1. IMPORT YOUR NEW CSS FILE HERE
import "./auth.css";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning("Please enter both email and password.");
      return;
    }

    const loadingToast = toast.loading("Authenticating...");

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.update(loadingToast, {
          render: "Welcome back!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.update(loadingToast, {
          render: "Account created successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      }
      navigate("/");
    } catch (error) {
      console.error(error);
      const friendlyError = error.code.split("/")[1].replace(/-/g, " ");
      toast.update(loadingToast, {
        render: friendlyError.toUpperCase(),
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">{isLogin ? "SIGN IN" : "REGISTER"}</h1>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            className="auth-input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="auth-submit-btn">
            {isLogin ? "LOGIN" : "CREATE ACCOUNT"}
          </button>
        </form>

        <div className="auth-toggle-wrapper">
          <button
            className="auth-toggle-btn"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "NEED AN ACCOUNT? REGISTER"
              : "ALREADY HAVE AN ACCOUNT? SIGN IN"}
          </button>
        </div>
      </div>
    </div>
  );
}
