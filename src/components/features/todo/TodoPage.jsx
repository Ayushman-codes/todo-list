import TodoForm from "./components/TodoForm";
import TodoFilter from "./components/TodoFilter";
import TodoList from "./components/TodoList";
import { TodoProvider, useTodo } from "./TodoContext"; // 👈 Import our context tools
import { s } from "./styles/todoStyles";

// A small inner component to safely extract context values inside the provider wrapper
function TodoContent() {
  const { activeCount, tasks, clearDone } = useTodo(); // 👈 Pulling straight from context!

  return (
    <div style={s.container}>
      <div style={s.header}>
        <h1 style={s.title}>TASKS</h1>
        <div style={s.badge}>
          <span style={s.badgeText}>{activeCount} left</span>
        </div>
      </div>

      {/* No more prop passing nightmare! */}
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

export default function TodoPage() {
  return (
    <div style={s.page}>
      <TodoProvider>
        <TodoContent />
      </TodoProvider>
    </div>
  );
}