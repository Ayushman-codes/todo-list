import TodoPage from "./components/features/todo/TodoPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
      <TodoPage />
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </>
  );
}
