from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List
import uvicorn
import logging

from app.services.kiro_service import KiroService
from app.models import ComparisonRequest, ComparisonResponse, HealthResponse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Tech Stack Referee API",
    description="Backend API for comparing technology options using Kiro CLI",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Kiro service
kiro_service = KiroService()


@app.get("/", response_model=HealthResponse)
async def root():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        message="Tech Stack Referee API is running",
        version="1.0.0"
    )


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Detailed health check with Kiro CLI status"""
    kiro_status = kiro_service.check_kiro_cli()
    agent_status = kiro_service.check_agent_config()
    
    return HealthResponse(
        status="healthy" if kiro_status and agent_status else "degraded",
        message="API is running",
        version="1.0.0",
        kiro_cli_available=kiro_status,
        agent_configured=agent_status
    )


@app.post("/api/compare", response_model=ComparisonResponse)
async def compare_technologies(request: ComparisonRequest):
    """
    Compare technology options using Kiro CLI agent
    
    Args:
        request: ComparisonRequest with query and optional context
        
    Returns:
        ComparisonResponse with formatted comparison
    """
    try:
        logger.info(f"Received comparison request: {request.query}")
        
        # Build query with context if provided
        full_query = kiro_service.build_query(
            query=request.query,
            context=request.context
        )
        
        logger.info(f"Calling Kiro CLI with query: {full_query}")
        
        # Call Kiro CLI agent
        result = kiro_service.call_agent(full_query)
        
        if result["success"]:
            return ComparisonResponse(
                success=True,
                comparison=result["response"],
                query=full_query,
                execution_time=result.get("execution_time", 0)
            )
        else:
            raise HTTPException(
                status_code=500,
                detail=f"Agent error: {result.get('error', 'Unknown error')}"
            )
            
    except Exception as e:
        logger.error(f"Error processing comparison: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/compare/stream")
async def compare_technologies_stream(request: ComparisonRequest):
    """
    Stream comparison response for real-time updates (future enhancement)
    """
    # TODO: Implement streaming response
    raise HTTPException(status_code=501, detail="Streaming not yet implemented")


@app.get("/api/suggestions")
async def get_suggestions():
    """Get popular comparison suggestions"""
    suggestions = [
        {
            "id": 1,
            "title": "React vs Vue",
            "category": "Frontend Frameworks",
            "query": "Compare React vs Vue for a dashboard project"
        },
        {
            "id": 2,
            "title": "PostgreSQL vs MongoDB",
            "category": "Databases",
            "query": "Compare PostgreSQL vs MongoDB for a social media app"
        },
        {
            "id": 3,
            "title": "AWS vs GCP vs Azure",
            "category": "Cloud Services",
            "query": "Compare AWS vs GCP vs Azure for a startup"
        },
        {
            "id": 4,
            "title": "Express vs FastAPI",
            "category": "Backend Frameworks",
            "query": "Compare Express vs FastAPI for building a REST API"
        },
        {
            "id": 5,
            "title": "Vercel vs Netlify",
            "category": "Deployment",
            "query": "Compare Vercel vs Netlify for deploying a Next.js app"
        },
        {
            "id": 6,
            "title": "MySQL vs PostgreSQL",
            "category": "Databases",
            "query": "Compare MySQL vs PostgreSQL for a web application"
        },
        {
            "id": 7,
            "title": "Django vs Flask",
            "category": "Backend Frameworks",
            "query": "Compare Django vs Flask for building an MVP"
        },
        {
            "id": 8,
            "title": "Svelte vs React",
            "category": "Frontend Frameworks",
            "query": "Compare Svelte vs React for a performance-critical application"
        }
    ]
    
    return {"suggestions": suggestions}


@app.get("/api/categories")
async def get_categories():
    """Get available comparison categories"""
    categories = {
        "Frontend Frameworks": ["React", "Vue", "Svelte", "Angular"],
        "Databases": ["PostgreSQL", "MongoDB", "MySQL", "Redis"],
        "Cloud Services": ["AWS", "GCP", "Azure"],
        "Backend Frameworks": ["Express", "FastAPI", "Django", "Flask"],
        "Deployment Platforms": ["Vercel", "Netlify", "AWS", "Railway", "Render"]
    }
    
    return {"categories": categories}


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )