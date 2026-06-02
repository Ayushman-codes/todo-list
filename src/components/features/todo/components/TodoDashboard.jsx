import { useTodo } from "../TodoContext";
import "../styles/tododashboard.css"; // 👈 Import your new CSS file here

export default function TodoDashboard() {
  const { aiStats, isLoadingAi, generateMonthlyStats } = useTodo();

  return (
    <div className="dashboard-card">
      <div className="db-header">
        <h3 className="db-title">AI MONTHLY PERFORMANCE</h3>
        <button
          onClick={generateMonthlyStats}
          disabled={isLoadingAi}
          className="refresh-btn"
        >
          {isLoadingAi ? "COMPILING..." : "REFRESH METRICS"}
        </button>
      </div>

      {!aiStats ? (
        // Note: Assuming you created an .empty-state class for s.empty earlier
        <div className="empty-state">
          NO ANALYTICS GENERATED YET. CLICK REFRESH TO RUN THE GEMINI
          EVALUATION.
        </div>
      ) : (
        <div className="db-grid">
          <div className="metric-box">
            <span className="metric-label">PRODUCTIVITY SCORE</span>
            <span className="metric-value">{aiStats.productivityScore}</span>
          </div>

          <div className="metric-box">
            <span className="metric-label">FOCUS FOCUS AREA</span>
            <span className="metric-value">
              <span className="metric-value-text">
                {aiStats.dominantCategory.toUpperCase()}
              </span>
            </span>
          </div>

          {/* Look how clean this is compared to the inline spread operator! */}
          <div className="metric-box full-width">
            <span className="metric-label">MONTHLY OVERVIEW</span>
            <p className="metric-p-text">{aiStats.summary}</p>
          </div>

          <div className="metric-box full-width highlight">
            <span className="metric-label highlight">
              GEMINI INSIGHT
            </span>
            <p className="metric-p-text italic">
              "{aiStats.aiAdvice}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// 👆 Notice how the massive const dbStyles = {...} is completely gone!