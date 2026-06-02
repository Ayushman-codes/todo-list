import { Routes, Route } from "react-router-dom";
import TodoPage from "./components/features/todo/TodoPage";
import TodoDashboard from "./components/features/todo/components/TodoDashboard";
export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<TodoPage />} />
      
      {/* Notice we moved the dashboard styling wrapper here to keep it clean */}
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