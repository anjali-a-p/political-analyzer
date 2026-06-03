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
        url: url,
      });
      setResult(response.data);
    } catch (err) {
      setError("Could not analyze this URL.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="card">
        <h1>Political Content Analyzer</h1>
        <p>Paste an article URL to extract and analyze political content.</p>

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
            <h2>Results</h2>
            <p><strong>Source:</strong> {result.source_domain}</p>
            <p><strong>Word count:</strong> {result.word_count}</p>
            <p><strong>Leaning:</strong> {result.analysis?.leaning}</p>
            <p><strong>Confidence:</strong> {result.analysis?.confidence}</p>
            <p><strong>Summary:</strong> {result.analysis?.summary}</p>
            <p><strong>Explanation:</strong> {result.analysis?.explanation}</p>

            <h3>Preview</h3>
            <p className="preview">{result.preview}</p>
          </section>
        )}
      </section>
    </main>
  );
}

export default App;