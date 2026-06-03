import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function analyzeUrl(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await axios.post("http://127.0.0.1:8000/analyze", {
        url,
      });
      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Could not analyze this URL."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="card">
        <h1>Political Content Analyzer</h1>
        <p className="subtitle">
          Paste an article URL to extract and analyze political content.
        </p>

        <form onSubmit={analyzeUrl}>
          <input
            type="url"
            placeholder="https://example.com/article"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {result && (
          <section className="results">
            <h2>Analysis Results</h2>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Source</div>
                <div className="stat-value">{result.source_domain}</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Word Count</div>
                <div className="stat-value">{result.word_count}</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Result</div>
                <div className="stat-value">{result.analysis?.leaning}</div>
              </div>
            </div>

            <h3 className="section-title">Political Leaning Scores</h3>

            {Object.entries(result.analysis?.leaning_scores || {}).map(
              ([label, score]) => (
                <div key={label} className="score-row">
                  <div className="score-header">
                    <span>{label}</span>
                    <span>{Math.round(score * 100)}%</span>
                  </div>

                  <div className="score-bar-container">
                    <div
                      className="score-bar"
                      style={{ width: `${score * 100}%` }}
                    />
                  </div>
                </div>
              )
            )}

            <h3 className="section-title">Bias Indicators</h3>

            <div className="badges">
              {result.analysis?.bias_indicators?.length > 0 ? (
                result.analysis.bias_indicators.map((word) => (
                  <span key={word} className="badge">
                    {word}
                  </span>
                ))
              ) : (
                <span>No loaded language detected</span>
              )}
            </div>

            <h3 className="section-title">Extracted Article Preview</h3>

            <div className="preview">{result.preview}</div>
          </section>
        )}
      </section>
    </main>
  );
}

export default App;