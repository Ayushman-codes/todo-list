import { useState, useEffect } from "react";
import TodoForm from "./components/TodoForm";
import TodoFilter from "./components/TodoFilter";
import TodoList from "./components/TodoList";
import { s } from "./styles/todoStyles";
import { toast } from "react-toastify";

export default function TodoPage() {
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
      toast.error("Task cannot be empty!"); // 🌟 Added error toast
      return;
    }
    setTasks([
      { id: Date.now().toString(), text: input.trim(), done: false },
      ...tasks,
    ]);
    setInput("");
    toast.success("task added successfully");
  };

  const toggleDone = (id) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const removeTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
    toast.info("task removed");
  };
  const clearDone = () => {
    const hasDoneTasks = tasks.some((t) => t.done);
    if (!hasDoneTasks) {
      toast.warning("No completed tasks to clear!");
      return;
    }
    setTasks(tasks.filter((t) => !t.done));
    toast.success("Clear all completed tasks!");
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

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.header}>
          <h1 style={s.title}>TASKS</h1>
          <div style={s.badge}>
            <span style={s.badgeText}>{activeCount} left</span>
          </div>
        </div>

        <TodoForm input={input} setInput={setInput} addTask={addTask} />

        <TodoFilter filter={filter} setFilter={setFilter} />

        <TodoList
          filtered={filtered}
          filter={filter}
          editingId={editingId}
          editText={editText}
          setEditText={setEditText}
          setEditingId={setEditingId}
          startEdit={startEdit}
          saveEdit={saveEdit}
          handleEditKeyDown={handleEditKeyDown}
          toggleDone={toggleDone}
          removeTask={removeTask}
        />

        <div style={s.footer}>
          <span style={s.muted}>
            {tasks.length} TOTAL · {tasks.filter((t) => t.done).length} DONE
          </span>
          <button style={s.clearBtn} onClick={clearDone}>
            CLEAR DONE
          </button>
        </div>
      </div>
    </div>
  );
}
