// src/components/features/todo/TodoPage.jsx
import TodoForm from "./components/TodoForm";
import TodoFilter from "./components/TodoFilter";
import TodoList from "./components/TodoList";
import { useTodo } from "./TodoContext"; // 👈 Notice TodoProvider is removed from this import
import { s } from "./styles/todoStyles";

function TodoContent() {
  const { activeCount, tasks, clearDone } = useTodo();

  return (
    <div style={s.container}>
      <div style={s.header}>
        <h1 style={s.title}>TASKS</h1>
        <div style={s.badge}>
          <span style={s.badgeText}>{activeCount} left</span>
        </div>
      </div>

      <TodoForm />
      <TodoFilter />
      <TodoList />

      <div style={s.footer}>
        <span style={s.muted}>
          {tasks.length} TOTAL · {tasks.filter((t) => t.done).length} DONE
        </span>
        <button style={s.clearBtn} onClick={clearDone}>
          CLEAR DONE
        </button>
      </div>
    </div>
  );
}

// 💥 REMOVE the <TodoProvider> wrapper here!
export default function TodoPage() {
  return (
    <div style={s.page}>
       <TodoContent /> 
    </div>
  );
}