import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

// 1. Create the empty context pipeline
const TodoContext = createContext();

// 2. Create the Provider component that holds the actual state
export function TodoProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) {
      toast.error("Task cannot be empty!");
      return;
    }
    setTasks([
      { id: Date.now().toString(), text: input.trim(), done: false },
      ...tasks,
    ]);
    setInput("");
    toast.success("Task added successfully!");
  };

  const toggleDone = (id) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const removeTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
    toast.info("Task removed.");
  };

  const clearDone = () => {
    const hasDoneTasks = tasks.some((t) => t.done);
    if (!hasDoneTasks) {
      toast.warning("No completed tasks to clear!");
      return;
    }
    setTasks(tasks.filter((t) => !t.done));
    toast.success("Cleared all completed tasks!");
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = (id) => {
    if (!editText.trim()) {
      setEditingId(null);
      return;
    }
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, text: editText.trim() } : t)),
    );
    setEditingId(null);
  };

  const handleEditKeyDown = (e, id) => {
    if (e.key === "Enter") saveEdit(id);
    if (e.key === "Escape") setEditingId(null);
  };

  const filtered = tasks.filter((t) => {
    if (filter === "active") return !t.done;
    if (filter === "done") return t.done;
    return true;
  });

  const activeCount = tasks.filter((t) => !t.done).length;

  // 3. Bundle up EVERYTHING we want our UI components to access
  const value = {
    tasks,
    input,
    setInput,
    filter,
    setFilter,
    editingId,
    setEditingId,
    editText,
    setEditText,
    filtered,
    activeCount,
    addTask,
    toggleDone,
    removeTask,
    clearDone,
    startEdit,
    saveEdit,
    handleEditKeyDown,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

// 4. Create a custom shorthand hook so we don't have to write useContext(TodoContext) everywhere
export function useTodo() {
  return useContext(TodoContext);
}
