import { useState } from 'react';
import { requestComparison } from '../services/api';

function ComparisonForm({ categories, onSubmit, onComplete, onError }) {
  const [category, setCategory] = useState('Frontend Frameworks');
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [useCase, setUseCase] = useState('');
  const [teamSize, setTeamSize] = useState(3);
  const [timeline, setTimeline] = useState('');
  const [expertise, setExpertise] = useState('');
  const [customQuery, setCustomQuery] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  const availableOptions = categories[category] || [];

  const handleSubmit = async (e) => {
    e.preventDefault();

    let query;
    let context = null;

    if (useCustom) {
      query = customQuery;
    } else {
      if (!option1 || !option2) {
        onError(new Error('Please select both options'));
        return;
      }

      query = `Compare ${option1} vs ${option2}`;
      
      if (useCase) {
        query += ` for ${useCase}`;
      }

      // Build context
      const contextParts = {};
      if (teamSize) contextParts.team_size = teamSize;
      if (timeline) contextParts.timeline = timeline;
      if (expertise) contextParts.expertise = expertise;
      if (useCase) contextParts.use_case = useCase;

      if (Object.keys(contextParts).length > 0) {
        context = contextParts;
      }
    }

    onSubmit(query, context);

    try {
      const result = await requestComparison(query, context);
      onComplete(result);
    } catch (error) {
      onError(error);
    }
  };

  return (
    <div className="comparison-form">
      <div className="form-header">
        <h2>Build Your Comparison</h2>
        <div className="form-mode-toggle">
          <button
            type="button"
            className={!useCustom ? 'active' : ''}
            onClick={() => setUseCustom(false)}
          >
            Guided
          </button>
          <button
            type="button"
            className={useCustom ? 'active' : ''}
            onClick={() => setUseCustom(true)}
          >
            Custom Query
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {!useCustom ? (
          <>
            {/* Guided Mode */}
            <div className="form-section">
              <h3>What to Compare</h3>
              
              <div className="form-group">
                <label>Category</label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setOption1('');
                    setOption2('');
                  }}
                >
                  {Object.keys(categories).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Option 1</label>
                  <select
                    value={option1}
                    onChange={(e) => setOption1(e.target.value)}
                    required
                  >
                    <option value="">Select...</option>
                    {availableOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="vs-divider">vs</div>

                <div className="form-group">
                  <label>Option 2</label>
                  <select
                    value={option2}
                    onChange={(e) => setOption2(e.target.value)}
                    required
                  >
                    <option value="">Select...</option>
                    {availableOptions
                      .filter((opt) => opt !== option1)
                      .map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Use Case (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., e-commerce site, dashboard, API"
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Your Context (Optional)</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Team Size</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={teamSize}
                    onChange={(e) => setTeamSize(parseInt(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label>Timeline</label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                  >
                    <option value="">Select...</option>
                    <option value="1 month">1 month</option>
                    <option value="3 months">3 months</option>
                    <option value="6 months">6 months</option>
                    <option value="1 year">1 year</option>
                    <option value="Long-term">Long-term</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Team Expertise</label>
                <select
                  value={expertise}
                  onChange={(e) => setExpertise(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Custom Query Mode */}
            <div className="form-section">
              <div className="form-group">
                <label>Custom Query</label>
                <textarea
                  rows="4"
                  placeholder="e.g., Compare React vs Vue for a dashboard project, team of 5, 3-month timeline"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  required
                />
              </div>
            </div>
          </>
        )}

        <button type="submit" className="submit-btn">
          🔍 Compare Options
        </button>
      </form>
    </div>
  );
}

export default ComparisonForm;