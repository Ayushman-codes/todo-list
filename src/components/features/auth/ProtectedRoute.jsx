import { Navigate } from "react-router-dom";
import { useTodo } from "../todo/TodoContext";

export default function ProtectedRoute({ children }) {
  const { user, isAuthPending } = useTodo();

  // 1. Wait for Firebase to check their auth status (prevents screen flickering)
  if (isAuthPending) {
    return <div style={{ minHeight: "100vh", backgroundColor: "#0e0e0e" }}></div>; 
  }

  // 2. If Firebase says they are NOT logged in, kick them to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. If they ARE logged in, let them see the page they requested!
  return children;
}