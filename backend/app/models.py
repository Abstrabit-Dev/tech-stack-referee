from pydantic import BaseModel, Field
from typing import Optional, Dict, Any


class ComparisonContext(BaseModel):
    """Context information for comparison"""
    team_size: Optional[int] = Field(None, description="Size of the team")
    timeline: Optional[str] = Field(None, description="Project timeline (e.g., '3 months')")
    expertise: Optional[str] = Field(None, description="Team expertise level")
    use_case: Optional[str] = Field(None, description="Specific use case or project type")
    budget: Optional[str] = Field(None, description="Budget constraints")
    

class ComparisonRequest(BaseModel):
    """Request model for technology comparison"""
    query: str = Field(..., description="Comparison query (e.g., 'Compare React vs Vue')")
    context: Optional[ComparisonContext] = Field(None, description="Optional context for the comparison")
    
    class Config:
        json_schema_extra = {
            "example": {
                "query": "Compare React vs Vue for a dashboard project",
                "context": {
                    "team_size": 3,
                    "timeline": "3 months",
                    "expertise": "intermediate",
                    "use_case": "admin dashboard"
                }
            }
        }


class ComparisonResponse(BaseModel):
    """Response model for technology comparison"""
    success: bool = Field(..., description="Whether the comparison was successful")
    comparison: str = Field(..., description="The formatted comparison text")
    query: str = Field(..., description="The actual query sent to the agent")
    execution_time: Optional[float] = Field(None, description="Execution time in seconds")
    error: Optional[str] = Field(None, description="Error message if any")


class HealthResponse(BaseModel):
    """Response model for health check"""
    status: str = Field(..., description="Service status (healthy/degraded/unhealthy)")
    message: str = Field(..., description="Status message")
    version: str = Field(..., description="API version")
    kiro_cli_available: Optional[bool] = Field(None, description="Whether Kiro CLI is available")
    agent_configured: Optional[bool] = Field(None, description="Whether agent is properly configured")


class SuggestionItem(BaseModel):
    """Model for a suggestion item"""
    id: int
    title: str
    category: str
    query: str