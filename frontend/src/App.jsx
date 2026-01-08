import { useState, useEffect } from 'react';
import ComparisonForm from './components/ComparisonForm';
import ComparisonResult from './components/ComparisonResult';
import ChatInterface from './components/ChatInterface';
import QuickSuggestions from './components/QuickSuggestions';
import { checkHealth, getCategories, getSuggestions } from './services/api';
import './App.css';

function App() {
  const [mode, setMode] = useState('guided'); // 'guided' or 'chat' (renamed from 'form')
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [health, setHealth] = useState(null);
  const [categories, setCategories] = useState({});
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Check backend health on mount
    checkHealth()
      .then(data => setHealth(data))
      .catch(err => console.error('Health check failed:', err));

    // Load categories
    getCategories()
      .then(data => setCategories(data.categories))
      .catch(err => console.error('Failed to load categories:', err));

    // Load suggestions
    getSuggestions()
      .then(data => setSuggestions(data.suggestions))
      .catch(err => console.error('Failed to load suggestions:', err));
  }, []);

  const handleComparisonComplete = (result) => {
    setComparison(result);
    setLoading(false);
    setError(null);
  };

  const handleError = (err) => {
    setError(err.message || 'An error occurred');
    setLoading(false);
  };

  const handleClear = () => {
    setComparison(null);
    setError(null);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1>🤖 Tech Stack Referee</h1>
              <p>Make informed technology decisions with AI-powered comparisons</p>
            </div>
            
            {/* Health indicator - only show if healthy */}
            {health && health.status !== 'degraded' && (
              <div className="health-status">
                <span className={`status-dot ${health.status}`}></span>
                <span className="status-text">{health.status}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="app-main">
        <div className="container">
          <div className="main-card">
            {/* Mode Switcher - Now inside the card as segmented control */}
            <div className="card-header">
              <h2 className="card-title">
                {mode === 'guided' ? '🎯 Guided Compare' : '💬 Ask the Referee'}
              </h2>
              <div className="mode-switcher">
                <button
                  className={`mode-btn ${mode === 'guided' ? 'active' : ''}`}
                  onClick={() => setMode('guided')}
                >
                  🎯 Guided Compare
                </button>
                <button
                  className={`mode-btn ${mode === 'chat' ? 'active' : ''}`}
                  onClick={() => setMode('chat')}
                >
                  💬 Ask the Referee
                </button>
              </div>
            </div>

            {mode === 'guided' ? (
              <div className="guided-mode">
                <div className="main-column">
                  {/* Comparison Form */}
                  <ComparisonForm
                    categories={categories}
                    onSubmit={(query, context) => {
                      setLoading(true);
                      setError(null);
                    }}
                    onComplete={handleComparisonComplete}
                    onError={handleError}
                  />

                  {/* Results */}
                  {loading && (
                    <div className="loading-state">
                      <div className="spinner"></div>
                      <p>🤔 Analyzing options and building comparison...</p>
                    </div>
                  )}

                  {error && (
                    <div className="error-state">
                      <p>⚠️ {error}</p>
                      <button onClick={handleClear}>Try Again</button>
                    </div>
                  )}

                  {comparison && !loading && (
                    <ComparisonResult
                      comparison={comparison}
                      onClear={handleClear}
                    />
                  )}
                </div>

                {/* Optional: Sidebar with suggestions (if you want to keep it) */}
                {/* <div className="sidebar-column">
                  <QuickSuggestions
                    suggestions={suggestions}
                    onSelect={(query) => {
                      setLoading(true);
                      setError(null);
                    }}
                  />
                </div> */}
              </div>
            ) : (
              <div className="chat-mode">
                <ChatInterface
                  suggestions={suggestions}
                  onError={handleError}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="container">
          <p>
            Built with <a href="https://kiro.dev" target="_blank" rel="noopener noreferrer">Kiro CLI</a> • 
            Powered by Claude (Anthropic) • 
            <a href="https://github.com/yourusername/tech-stack-referee" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;