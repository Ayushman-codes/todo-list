import { Routes, Route, Navigate } from "react-router-dom";
import TodoPage from "./components/features/todo/TodoPage";
import TodoDashboard from "./components/features/todo/components/TodoDashboard";
import AuthPage from "./components/features/auth/AuthPage";
import { useTodo } from "./components/features/todo/TodoContext";

// 1. IMPORT YOUR NEW BOUNCER
import ProtectedRoute from "./components/features/auth/ProtectedRoute";

export default function AppRouter() {
  const { user } = useTodo();

  return (
    <Routes>
      {/* PUBLIC ROUTE: If they are already logged in, they shouldn't see the login page! */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <AuthPage />}
      />

      {/* PROTECTED ROUTE: Wrapped in the bouncer */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <TodoPage />
          </ProtectedRoute>
        }
      />

      {/* PROTECTED ROUTE: Wrapped in the bouncer */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <div
              style={{ maxWidth: "600px", margin: "0 auto", padding: "40px" }}
            >
              <TodoDashboard />
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
