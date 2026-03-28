from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from schemas import (
    EvaluateRequest,
    EvaluationResponse,
    HistoryResponse,
    SimilarIdeasResponse,
    SimilarIdeaResponse,
    StatsResponse,
)
from models import Evaluation
from services import evaluate_fyp_idea, save_evaluation, find_similar_ideas

router = APIRouter()


@router.post("/evaluate", response_model=EvaluationResponse)
async def evaluate_idea(request: EvaluateRequest, db: Session = Depends(get_db)):
    """
    Evaluate a Final Year Project idea using AI.
    
    - **idea**: The FYP idea text (minimum 50 characters)
    - **user_id**: User identifier (UUID or string)
    """
    try:
        # Validate idea length
        if len(request.idea) < 50:
            raise HTTPException(
                status_code=400,
                detail="Idea must be at least 50 characters long"
            )
        
        # Get AI evaluation
        evaluation_data = evaluate_fyp_idea(request.idea, request.user_id, db)
        
        # Save to database
        evaluation_obj = save_evaluation(
            db,
            request.idea,
            request.user_id,
            evaluation_data
        )
        
        # Return response
        return evaluation_obj.to_dict()
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {str(e)}")


@router.get("/history/{user_id}", response_model=HistoryResponse)
async def get_user_history(user_id: str, db: Session = Depends(get_db)):
    """Get all evaluations for a specific user, sorted by creation date (newest first)."""
    evaluations = (
        db.query(Evaluation)
        .filter(Evaluation.user_id == user_id)
        .order_by(Evaluation.created_at.desc())
        .all()
    )
    
    return {
        "evaluations": [eval_obj.to_dict() for eval_obj in evaluations],
        "total_count": len(evaluations),
    }


@router.get("/ideas/similar", response_model=SimilarIdeasResponse)
async def get_similar_ideas(idea: str = Query(..., min_length=50), db: Session = Depends(get_db)):
    """
    Find ideas in the database that are similar to the provided idea.
    Used to warn users before they submit a potentially non-unique idea.
    """
    if len(idea) < 50:
        raise HTTPException(
            status_code=400,
            detail="Idea must be at least 50 characters long"
        )
    
    similar_ideas = find_similar_ideas(db, idea, threshold=0.6)
    
    similar_responses = [
        SimilarIdeaResponse(
            idea_id=idea_obj.id,
            idea_text=idea_obj.idea_text,
            overall_score=idea_obj.overall_score,
            domain=idea_obj.domain,
            created_at=idea_obj.created_at.isoformat() if idea_obj.created_at else None,
        )
        for idea_obj in similar_ideas
    ]
    
    return {
        "similar_ideas": similar_responses,
        "count": len(similar_responses),
    }


@router.get("/evaluations/stats", response_model=StatsResponse)
async def get_stats(db: Session = Depends(get_db)):
    """Get overall statistics across all submissions."""
    total = db.query(func.count(Evaluation.id)).scalar() or 0
    
    if total == 0:
        return {
            "total_ideas_submitted": 0,
            "average_uniqueness_score": 0.0,
            "average_feasibility_score": 0.0,
            "average_problem_solving_score": 0.0,
            "average_overall_score": 0.0,
            "most_common_domains": [],
        }
    
    # Calculate averages
    avg_uniqueness = db.query(func.avg(Evaluation.uniqueness_score)).scalar() or 0
    avg_feasibility = db.query(func.avg(Evaluation.feasibility_score)).scalar() or 0
    avg_problem_solving = db.query(func.avg(Evaluation.problem_solving_value)).scalar() or 0
    avg_overall = db.query(func.avg(Evaluation.overall_score)).scalar() or 0
    
    # Get most common domains
    domain_counts = (
        db.query(Evaluation.domain, func.count(Evaluation.domain))
        .group_by(Evaluation.domain)
        .order_by(func.count(Evaluation.domain).desc())
        .limit(5)
        .all()
    )
    most_common_domains = [domain for domain, _ in domain_counts]
    
    return {
        "total_ideas_submitted": total,
        "average_uniqueness_score": float(avg_uniqueness),
        "average_feasibility_score": float(avg_feasibility),
        "average_problem_solving_score": float(avg_problem_solving),
        "average_overall_score": float(avg_overall),
        "most_common_domains": most_common_domains,
    }


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}
