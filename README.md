# ⚖️ Tech Stack Referee

A balanced technology comparison tool that helps developers make informed decisions by presenting pros, cons, and trade-offs rather than declaring winners.

## 🎯 Overview

Tech Stack Referee analyzes technology options based on your project constraints and presents balanced comparisons. Instead of telling you what's "best," it helps you understand trade-offs and make decisions that fit your specific situation.

Built with FastAPI backend and React frontend, powered by Kiro AI agent for intelligent comparisons.

## ✨ Features

- **Dual Interface Modes**:
  - **Guided Compare**: Structured form-based comparisons with context inputs
  - **Ask the Referee**: Natural language chat interface for flexible queries
- **Balanced Comparisons**: Pros and cons for each technology
- **AI-Powered Analysis**: Leverages Kiro CLI and Claude for intelligent insights
- **Markdown-Formatted Responses**: Clean, readable comparison results
- **Quick Suggestions**: Pre-built comparison templates to get started
- **Real-Time Health Monitoring**: Backend status indicator
- **No Winner Declarations**: Helps you decide, doesn't decide for you

## 🛠️ Tech Stack

- **Backend**: FastAPI + Python + Uvicorn
- **Frontend**: React 18 + Vite
- **UI Libraries**: React Markdown for formatted responses
- **AI Agent**: Kiro CLI (powered by Claude/Anthropic)
- **Knowledge Base**: Markdown files

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- Kiro CLI installed and configured

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python -m app.main
```

Backend runs on `http://localhost:8000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure API URL (optional - defaults to localhost:8000)
# Edit .env file if needed:
# VITE_API_URL=http://localhost:8000

# Run development server
npm run dev
```

Frontend runs on `http://localhost:5173`

### Usage

1. Start both backend and frontend servers
2. Open `http://localhost:5173` in your browser
3. Choose your preferred mode:
   - **Guided Compare**: Fill in the form with technologies and context
   - **Ask the Referee**: Chat naturally about technology comparisons
4. Get balanced, AI-powered comparisons instantly

## 📊 Comparison Categories

- **Frontend Frameworks**: React, Vue, Angular, Svelte
- **Databases**: PostgreSQL, MongoDB, MySQL, Redis
- **Cloud Services**: AWS, GCP, Azure
- **Backend Frameworks**: Express, FastAPI, Django, Flask
- **Deployment Platforms**: Vercel, Netlify, AWS, Railway, Render

## �️ Poroject Structure

```
tech-stack-referee/
├── backend/
│   ├── app/
│   │   ├── main.py                    # FastAPI application
│   │   ├── models.py                  # Pydantic models
│   │   └── services/
│   │       └── kiro_service.py        # Kiro CLI integration
│   └── requirements.txt               # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.jsx      # Chat mode UI
│   │   │   ├── ComparisonForm.jsx     # Guided mode form
│   │   │   ├── ComparisonResult.jsx   # Results display
│   │   │   └── QuickSuggestions.jsx   # Suggestion cards
│   │   ├── services/
│   │   │   └── api.js                 # API client
│   │   ├── App.jsx                    # Main app with mode switcher
│   │   └── main.jsx                   # Entry point
│   ├── .env                           # Environment variables
│   ├── package.json                   # Node dependencies
│   └── vite.config.js                 # Vite configuration
├── knowledge/
│   ├── frameworks.md                  # Frontend frameworks
│   ├── databases.md                   # Database systems
│   ├── cloud-services.md              # Cloud providers
│   ├── backend-frameworks.md          # Backend frameworks
│   └── deployment.md                  # Deployment platforms
└── README.md
```

## 🎯 Example Comparisons

### React vs Vue for Dashboard Project

**React Strengths**:
- Larger ecosystem and community
- Better TypeScript support
- More job opportunities
- Flexible architecture

**Vue Strengths**:
- Gentler learning curve
- Better documentation
- Built-in state management
- Smaller bundle size

**Trade-off**: React offers more flexibility and ecosystem maturity, while Vue provides faster onboarding and simpler syntax.

### PostgreSQL vs MongoDB for Social Media App

**PostgreSQL**:
- Strong ACID compliance
- Complex relationship handling
- Mature ecosystem
- Better for structured data

**MongoDB**:
- Flexible schema
- Faster prototyping
- Horizontal scaling
- Better for unstructured data

**Trade-off**: PostgreSQL for data integrity and complex queries vs MongoDB for rapid development and scaling flexibility.

## 📡 API Endpoints

- `GET /` - Health check
- `GET /health` - Detailed health status with Kiro CLI check
- `POST /api/compare` - Submit comparison query
- `GET /api/suggestions` - Get popular comparison templates
- `GET /api/categories` - Get available technology categories

## 🤝 Contributing

Contributions are welcome! You can help by:

1. Adding new technology categories to the knowledge base
2. Updating existing technology information

## 🎉 Kiro Week 6 Challenge

This project fulfills the "Referee" challenge requirements:
- ✅ Compares 2+ options with pros/cons
- ✅ Explains trade-offs based on constraints, helping users choose without declaring winners
- ✅ Complete, working code with documentation

---

*Built for developers, technical managers who want to make informed technology decisions*
