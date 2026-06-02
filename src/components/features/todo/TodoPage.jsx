import TodoForm from "./components/TodoForm";
import TodoFilter from "./components/TodoFilter";
import TodoList from "./components/TodoList";
import { TodoProvider, useTodo } from "./TodoContext";
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
      
      {/* 👈 Add it cleanly right above the footer */}
     

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