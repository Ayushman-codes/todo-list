import { s } from "../styles/todoStyles";

export default function TodoItem({
  task,
  editingId,
  editText,
  setEditText,
  setEditingId,
  startEdit,
  saveEdit,
  handleEditKeyDown,
  toggleDone,
  removeTask,
}) {
  const isEditing = editingId === task.id;

  return (
    <div style={{ ...s.taskItem, ...(task.done ? s.taskDone : {}) }}>
      {isEditing ? (
        <>
          <input
            style={s.editInput}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => handleEditKeyDown(e, task.id)}
            autoFocus
          />
          <button style={s.saveBtn} onClick={() => saveEdit(task.id)}>
            SAVE
          </button>
          <button style={s.cancelBtn} onClick={() => setEditingId(null)}>
            ✕
          </button>
        </>
      ) : (
        <>
          <button style={s.checkBtn} onClick={() => toggleDone(task.id)}>
            {task.done ? "✓" : ""}
          </button>
          <span
            style={{ ...s.taskText, ...(task.done ? s.taskTextDone : {}) }}
            onDoubleClick={() => startEdit(task)}
          >
            {task.text}
          </span>
          <button style={s.iconBtn} onClick={() => startEdit(task)}>
            ✎
          </button>
          <button style={s.iconBtn} onClick={() => removeTask(task.id)}>
            ✕
          </button>
        </>
      )}
    </div>
  );
}
