import { useTodo } from "../TodoContext";
import { s } from "../styles/todoStyles";

export default function TodoForm() {
  const { input, setInput, addTask } = useTodo(); // 👈 Grab directly

  return (
    <form onSubmit={addTask} style={s.inputRow}>
      <input
        style={s.input}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a new task..."
      />
      <button type="submit" style={s.addBtn}>ADD</button>
    </form>
  );
}