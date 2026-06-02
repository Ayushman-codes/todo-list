import { BrowserRouter } from "react-router-dom";
import { TodoProvider } from "./components/features/todo/TodoContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import your new modular files
import NavBar from "./components/features/todo/components/NavBar";
import AppRouter from "./AppRouter";



export default function App() {
  return (
    <BrowserRouter>
      <TodoProvider>
        
        {/* Global UI */}
        <NavBar />
        
        {/* The Page Content */}
        <AppRouter />

        {/* Global Utilities */}
        <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
        
      </TodoProvider>
    </BrowserRouter>
  );
}