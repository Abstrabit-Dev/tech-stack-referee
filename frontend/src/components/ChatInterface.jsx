import { useState, useRef, useEffect } from 'react';
import { requestComparison } from '../services/api';
import ReactMarkdown from 'react-markdown';

function ChatInterface({ suggestions, onError }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const result = await requestComparison(input);
      const assistantMessage = {
        role: 'assistant',
        content: result.comparison,
        query: result.query,
        execution_time: result.execution_time,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      onError(error);
      const errorMessage = {
        role: 'assistant',
        content: `⚠️ Error: ${error.message}`,
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion.query);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-container">
        {/* Welcome message */}
        {messages.length === 0 && (
          <div className="welcome-message">
            <h2>👋 Hi! I'm your Tech Stack Referee</h2>
            <p>Ask me anything about technology comparisons and I'll help you make informed decisions!</p>
            <div className="example-queries">
              <p><strong>Try asking:</strong></p>
              <ul>
                <li>"Compare React vs Vue for a dashboard"</li>
                <li>"Should I use PostgreSQL or MongoDB for an e-commerce site?"</li>
                <li>"AWS vs GCP vs Azure for a startup"</li>
                <li>"Node.js or Django for building APIs?"</li>
              </ul>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="messages-list">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}${message.isError ? ' isError' : ''}`}>
              <div className="message-avatar">
                {message.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-content">
                {message.role === 'assistant' ? (
                  <div className="assistant-response-card">
                    {message.execution_time && (
                      <div className="assistant-response-header">
                        <span className="message-time">⚡ {message.execution_time.toFixed(2)}s</span>
                      </div>
                    )}
                    <div className="assistant-response-body">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <p>{message.content}</p>
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="message assistant loading">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <p>Analyzing and comparing your options...</p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input area - using div instead of form */}
        <div className="chat-input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about technology comparisons..."
            disabled={loading}
          />
          <button 
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
          >
            Send
          </button>
        </div>

        {/* Quick suggestions (show if no messages) */}
        {messages.length === 0 && suggestions.length > 0 && (
          <div className="chat-suggestions">
            <p>Or try one of these:</p>
            <div className="suggestion-chips">
              {suggestions.slice(0, 4).map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="suggestion-chip"
                >
                  {suggestion.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatInterface;