import TodoItem from "./TodoItem";
import { useTodo } from "../TodoContext";
import { s } from "../styles/todoStyles";

export default function TodoList() {
  const { filtered, filter } = useTodo(); // 👈 Grab directly

  if (filtered.length === 0) {
    return (
      <div style={s.empty}>
        {filter === "done"
          ? "NOTHING DONE YET."
          : filter === "active"
            ? "ALL DONE!"
            : "ADD YOUR FIRST TASK ABOVE."}
      </div>
    );
  }

  return (
    <div style={s.taskList}>
      {filtered.map((task) => (
        <TodoItem key={task.id} task={task} /> // We only pass the specific loop task now
      ))}
    </div>
  );
}