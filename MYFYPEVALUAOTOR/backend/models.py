from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, JSON, Text
from sqlalchemy.orm import declarative_base
import uuid

Base = declarative_base()


class Evaluation(Base):
    """Database model for storing FYP idea evaluations."""
    __tablename__ = "evaluations"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), nullable=False, index=True)
    idea_text = Column(Text, nullable=False)
    
    # Scores
    uniqueness_score = Column(Integer, nullable=False)
    feasibility_score = Column(Integer, nullable=False)
    problem_solving_value = Column(Integer, nullable=False)
    complexity = Column(String(20), nullable=False)  # Low, Medium, High
    domain = Column(String(100), nullable=False)
    overall_score = Column(Float, nullable=False)
    
    # JSON fields for arrays
    strengths = Column(JSON, nullable=False)  # List of strings
    weaknesses = Column(JSON, nullable=False)  # List of strings
    improvement_suggestions = Column(JSON, nullable=False)  # List of strings
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    def to_dict(self):
        """Convert model to dictionary."""
        return {
            "idea_id": self.id,
            "user_id": self.user_id,
            "idea_text": self.idea_text,
            "scores": {
                "uniqueness": self.uniqueness_score,
                "feasibility": self.feasibility_score,
                "problem_solving_value": self.problem_solving_value,
                "complexity": self.complexity,
                "domain": self.domain,
            },
            "overall_score": self.overall_score,
            "strengths": self.strengths,
            "weaknesses": self.weaknesses,
            "improvement_suggestions": self.improvement_suggestions,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
