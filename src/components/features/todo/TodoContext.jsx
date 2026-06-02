import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { GoogleGenAI } from "@google/genai";

// 1. IMPORT FIREBASE TOOLS
import { auth, db } from "../../../firebase"; // 👈 Make sure this path is correct!
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const TodoContext = createContext();

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export function TodoProvider({ children }) {
  // --- AUTHENTICATION STATE ---
  const [user, setUser] = useState(null);
  const [isAuthPending, setIsAuthPending] = useState(true);

  // --- TASK STATE (Empty by default, Firebase will fill it) ---
  const [tasks, setTasks] = useState([]);

  // --- UI & AI STATE ---
  const [aiStats, setAiStats] = useState(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // 2. LISTEN FOR LOGIN/LOGOUT
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthPending(false); // Tells the app Firebase is done checking
    });
    return () => unsubscribe();
  }, []);

  // 3. LISTEN TO FIRESTORE (Replaces LocalStorage)
  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }

    const q = query(collection(db, "tasks"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort tasks so the newest ones show up at the top
      dbTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTasks(dbTasks);
    });

    return () => unsubscribe();
  }, [user]);

  // 4. ADD TASK (AI Validation + Firestore)
  const addTask = async (e) => {
    if (e) e.preventDefault();
    const taskText = input.trim();

    if (!taskText) {
      toast.error("Task cannot be empty!");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to add tasks.");
      return;
    }

    const loadingToast = toast.loading("Checking task...");

    try {
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

      if (aiVerdict === "INVALID") {
        toast.update(loadingToast, {
          render: "AI rejected this task as gibberish!",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        return;
      }

      // Add to Firestore database!
      await addDoc(collection(db, "tasks"), {
        text: taskText,
        done: false,
        userId: user.uid,
        createdAt: new Date().toISOString(),
      });
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

      // Fallback: Add to Firestore if AI fails
      await addDoc(collection(db, "tasks"), {
        text: taskText,
        done: false,
        userId: user.uid,
        createdAt: new Date().toISOString(),
      });
      setInput("");
    }
  };

  // 5. UPDATE TASK IN FIRESTORE
  const toggleDone = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    await updateDoc(doc(db, "tasks", id), {
      done: !task.done,
    });
  };

  // 6. DELETE TASK FROM FIRESTORE
  const removeTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
    toast.info("Task removed.");
  };

  // 7. BATCH DELETE FROM FIRESTORE
  const clearDone = () => {
    const doneTasks = tasks.filter((t) => t.done);
    if (doneTasks.length === 0) {
      toast.warning("No completed tasks to clear!");
      return;
    }

    // Loop through and delete each completed task
    doneTasks.forEach(async (t) => {
      await deleteDoc(doc(db, "tasks", t.id));
    });
    toast.success("Cleared all completed tasks!");
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  // 8. SAVE EDITS TO FIRESTORE
  const saveEdit = async (id) => {
    if (!editText.trim()) {
      setEditingId(null);
      return;
    }
    await updateDoc(doc(db, "tasks", id), {
      text: editText.trim(),
    });
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
    user, // 👈 Exported for the Bouncer route!
    isAuthPending, // 👈 Exported for the Bouncer route!
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTodo() {
  return useContext(TodoContext);
}
