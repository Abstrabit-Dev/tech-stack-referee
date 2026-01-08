import ReactMarkdown from 'react-markdown';

function ComparisonResult({ comparison, onClear }) {
  const { success, comparison: text, query, execution_time } = comparison;

  if (!success) {
    return (
      <div className="comparison-result error">
        <h3>⚠️ Error</h3>
        <p>{comparison.error || 'An unknown error occurred'}</p>
        <button onClick={onClear}>Try Again</button>
      </div>
    );
  }

  // Parse the markdown to extract sections intelligently
  const parseComparison = (markdown) => {
    const sections = [];
    let summary = '';
    
    // Split by headers
    const parts = markdown.split(/\n## /);
    
    // First part is the summary (everything before first h2)
    if (parts[0]) {
      summary = parts[0].replace(/^#\s+.*\n\n?/, '').trim();
    }
    
    // Remaining parts are sections
    for (let i = 1; i < parts.length; i++) {
      const [title, ...contentLines] = parts[i].split('\n');
      const content = contentLines.join('\n').trim();
      
      sections.push({
        title: title.trim(),
        content,
        isRecommendation: title.toLowerCase().includes('when to choose') || 
                         title.toLowerCase().includes('recommendation') ||
                         title.toLowerCase().includes('verdict')
      });
    }
    
    return { summary, sections };
  };

  const { summary, sections } = parseComparison(text);

  return (
    <div className="result-container">
      {/* Header with query and metadata */}
      <div className="result-header">
        <div className="result-query">
          <h3>📊 Comparison Complete</h3>
          <p className="query-text">{query}</p>
        </div>
        <div className="result-meta">
          {execution_time && (
            <span className="execution-badge">
              ⚡ {execution_time.toFixed(1)}s
            </span>
          )}
          <button onClick={onClear} className="clear-btn">
            ✕ Clear
          </button>
        </div>
      </div>

      {/* Summary Card - High-level overview */}
      {summary && (
        <div className="summary-card">
          <h4>🎯 Quick Summary</h4>
          <ReactMarkdown>{summary}</ReactMarkdown>
        </div>
      )}

      {/* Dimension Cards - Detailed comparisons */}
      <div className="dimensions-grid">
        {sections.map((section, index) => {
          // Different styling for recommendation sections
          if (section.isRecommendation) {
            return (
              <div key={index} className="recommendation-card">
                <h4>💡 {section.title}</h4>
                <div className="recommendation-content">
                  <ReactMarkdown>{section.content}</ReactMarkdown>
                </div>
              </div>
            );
          }

          // Regular dimension cards
          return (
            <div key={index} className="dimension-card">
              <h5>📌 {section.title}</h5>
              <div className="dimension-content">
                <ReactMarkdown>{section.content}</ReactMarkdown>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ComparisonResult;