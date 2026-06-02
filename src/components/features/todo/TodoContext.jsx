import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { GoogleGenAI } from "@google/genai";

// 1. Create the empty context pipeline
const TodoContext = createContext();

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

// 2. Create the Provider component that holds the actual state
export function TodoProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [aiStats, setAiStats] = useState(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Update your addTask function to be async
  const addTask = async (e) => {
    if (e) e.preventDefault();
    const taskText = input.trim();

    if (!taskText) {
      toast.error("Task cannot be empty!");
      return;
    }

    // 1. Show a loading message while Gemini thinks
    const loadingToast = toast.loading("Checking task...");

    try {
      // 2. Ask Gemini if the task is real
      const prompt = `
        Evaluate this to-do list task: "${taskText}".
        Is this a real, coherent task, or is it keyboard smash/gibberish?
        If the task input is empty reply with EMPTY FIELD.
        Reply with ONLY the word "VALID" or "INVALID". Nothing else.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const aiVerdict = response.text.trim().toUpperCase();

      // 3. Handle Gemini's response
      if (aiVerdict === "INVALID") {
        toast.update(loadingToast, {
          render: "AI rejected this task as gibberish!",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        return; // Stop the function, don't add the task
      }

      // 4. If VALID, add it to the list!
      setTasks([
        { id: Date.now().toString(), text: taskText, done: false },
        ...tasks,
      ]);
      setInput("");

      toast.update(loadingToast, {
        render: "Task added!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      console.error(error);
      toast.update(loadingToast, {
        render: "API Error. Added task anyway.",
        type: "warning",
        isLoading: false,
        autoClose: 3000,
      });
      // Fallback: If the API fails, just add the task so the app doesn't break
      setTasks([
        { id: Date.now().toString(), text: taskText, done: false },
        ...tasks,
      ]);
      setInput("");
    }
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

  const generateMonthlyStats = async () => {
    if (tasks.length === 0) {
      toast.warning("Add some tasks first to generate statistics!");
      return;
    }

    setIsLoadingAi(true);
    try {
      const prompt = `
        Analyze the following user task list: ${JSON.stringify(tasks)}.
        Generate a monthly performance analysis outputting valid JSON ONLY matching this exact structure:
        {
          "productivityScore": "percentage string (e.g. 85%)",
          "summary": "a brief 2-sentence summary of overall monthly status",
          "dominantCategory": "string describing what kind of work dominates the list",
          "aiAdvice": "one sharp motivational advice sentence tailored to their task patterns"
        }
        Do not wrap the response in markdown code blocks. Just return the raw JSON object.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const data = JSON.parse(response.text.trim());
      setAiStats(data);
      toast.success("Dashboard metrics refreshed!");
    } catch (error) {
      console.error("Gemini Error:", error);
      toast.error("Failed to compile AI analytics.");
    } finally {
      setIsLoadingAi(false);
    }
  };

  // 3. Bundle up EVERYTHING into a single, unified context object
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
    aiStats,
    isLoadingAi,
    generateMonthlyStats,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

// 4. Custom shorthand hook
// eslint-disable-next-line react-refresh/only-export-components
export function useTodo() {
  return useContext(TodoContext);
}
