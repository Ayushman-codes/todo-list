import { Routes, Route } from "react-router-dom";

// Notice the added "./components/" at the start of each path!
import TodoPage from "./components/features/todo/TodoPage";
import TodoDashboard from "./components/features/todo/components/TodoDashboard";
import AuthPage from "./components/features/auth/AuthPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<TodoPage />} />
      <Route path="/login" element={<AuthPage />} />

      <Route
        path="/dashboard"
        element={
          <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px" }}>
            <TodoDashboard />
          </div>
        }
      />
    </Routes>
  );
}
