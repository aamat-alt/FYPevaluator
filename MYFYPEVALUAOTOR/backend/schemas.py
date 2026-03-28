from pydantic import BaseModel, Field
from typing import List
from datetime import datetime


class EvaluateRequest(BaseModel):
    """Request schema for POST /evaluate endpoint."""
    idea: str = Field(..., min_length=50, description="The FYP idea (minimum 50 characters)")
    user_id: str = Field(..., description="User identifier (UUID or string)")


class ScoresSchema(BaseModel):
    """Evaluation scores."""
    uniqueness: int = Field(..., ge=0, le=10)
    feasibility: int = Field(..., ge=0, le=10)
    problem_solving_value: int = Field(..., ge=0, le=10)
    complexity: str = Field(..., description="Low / Medium / High")
    domain: str = Field(..., description="Domain classification (e.g. AI / EdTech / Web Dev)")


class EvaluationResponse(BaseModel):
    """Response schema for evaluation endpoint."""
    idea_id: str
    user_id: str
    idea_text: str
    scores: ScoresSchema
    overall_score: float = Field(..., ge=0, le=10)
    strengths: List[str]
    weaknesses: List[str]
    improvement_suggestions: List[str]
    created_at: str


class HistoryResponse(BaseModel):
    """Response schema for history endpoint."""
    evaluations: List[EvaluationResponse]
    total_count: int


class SimilarIdeaResponse(BaseModel):
    """Response for similar ideas found."""
    idea_id: str
    idea_text: str
    overall_score: float
    domain: str
    created_at: str


class SimilarIdeasResponse(BaseModel):
    """Response schema for similar ideas endpoint."""
    similar_ideas: List[SimilarIdeaResponse]
    count: int


class StatsResponse(BaseModel):
    """Response schema for statistics endpoint."""
    total_ideas_submitted: int
    average_uniqueness_score: float
    average_feasibility_score: float
    average_problem_solving_score: float
    average_overall_score: float
    most_common_domains: List[str]
