import { requestComparison } from '../services/api';

function QuickSuggestions({ suggestions, onSelect }) {
  const handleSuggestionClick = async (suggestion) => {
    onSelect(suggestion.query);
    // API call handled by parent
  };

  return (
    <div className="quick-suggestions">
      <h3>💡 Popular Comparisons</h3>
      <div className="suggestions-list">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            className="suggestion-item"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            <span className="suggestion-category">{suggestion.category}</span>
            <span className="suggestion-title">{suggestion.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickSuggestions;