import TodoItem from "./TodoItem";
import { s } from "../styles/todoStyles";

export default function TodoList({ filtered, filter, ...itemProps }) {
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
        <TodoItem key={task.id} task={task} {...itemProps} />
      ))}
    </div>
  );
}