const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Make API request with error handling
 */
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * Check backend health
 */
export async function checkHealth() {
  return apiRequest('/health');
}

/**
 * Get comparison categories
 */
export async function getCategories() {
  return apiRequest('/api/categories');
}

/**
 * Get popular suggestions
 */
export async function getSuggestions() {
  return apiRequest('/api/suggestions');
}

/**
 * Request a comparison
 */
export async function requestComparison(query, context = null) {
  return apiRequest('/api/compare', {
    method: 'POST',
    body: JSON.stringify({
      query,
      context,
    }),
  });
}

/**
 * Request a comparison with streaming (future feature)
 */
export async function requestComparisonStream(query, context = null) {
  // TODO: Implement streaming
  throw new Error('Streaming not yet implemented');
}