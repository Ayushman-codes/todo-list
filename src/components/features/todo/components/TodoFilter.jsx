import { s } from "../styles/todoStyles";

export default function TodoFilter({ filter, setFilter }) {
  return (
    <div style={s.filters}>
      {["all", "active", "done"].map((f) => (
        <button
          key={f}
          style={{
            ...s.filterBtn,
            ...(filter === f ? s.filterActive : {}),
          }}
          onClick={() => setFilter(f)}
        >
          {f.toUpperCase()}
        </button>
      ))}
    </div>
  );
}