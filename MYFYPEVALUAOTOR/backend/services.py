import json
import re
from typing import List, Optional
from openai import OpenAI
from config import settings
from sqlalchemy.orm import Session
from models import Evaluation
from difflib import SequenceMatcher

client = OpenAI(api_key=settings.OPENAI_API_KEY)


def calculate_similarity(idea1: str, idea2: str) -> float:
    """Calculate similarity ratio between two ideas (0-1)."""
    return SequenceMatcher(None, idea1.lower(), idea2.lower()).ratio()


def find_similar_ideas(db: Session, idea: str, threshold: float = 0.6) -> List[Evaluation]:
    """Find previously submitted ideas similar to the input idea."""
    all_ideas = db.query(Evaluation).all()
    similar = []
    
    for existing_idea in all_ideas:
        similarity = calculate_similarity(idea, existing_idea.idea_text)
        if similarity >= threshold:
            similar.append(existing_idea)
    
    return similar


def get_similar_ideas_context(similar_ideas: List[Evaluation]) -> str:
    """Build a context string about similar previously submitted ideas."""
    if not similar_ideas:
        return ""
    
    context = "\n\nIMPORTANT CONTEXT: The following similar ideas have been previously submitted:\n"
    for idx, idea in enumerate(similar_ideas[:5], 1):  # Limit to top 5
        context += f"{idx}. Score: {idea.overall_score}/10, Domain: {idea.domain}, Uniqueness: {idea.uniqueness_score}/10\n"
    
    context += f"\nTotal of {len(similar_ideas)} similar ideas exist. Consider this when evaluating uniqueness."
    return context


def evaluate_fyp_idea(idea: str, user_id: str, db: Session) -> dict:
    """
    Use OpenAI GPT to evaluate the FYP idea.
    Returns a dictionary with the evaluation results.
    """
    # Find similar ideas in the database
    similar_ideas = find_similar_ideas(db, idea)
    similar_context = get_similar_ideas_context(similar_ideas)
    
    # Build the evaluation prompt
    prompt = f"""
You are an expert academic advisor evaluating Final Year Project (FYP) ideas for university students.
Evaluate the following FYP idea on these criteria (each scored 0-10):
1. Uniqueness - How original and innovative is the idea?
2. Technical Feasibility - Can a student realistically implement it within the given time frame?
3. Problem-Solving Value - Does it solve a real problem? What's the practical impact?
4. Complexity Level - Is the scope appropriate? (as input for complexity rating: Low/Medium/High)
5. Domain Classification - What field does it belong to? (e.g., AI, EdTech, Web Dev, IoT, etc.)

**FYP Idea to Evaluate:**
{idea}

{similar_context}

**IMPORTANT:** You MUST respond with ONLY a valid JSON object in the following format (no markdown, no extra text):
{{
    "uniqueness": <integer 0-10>,
    "feasibility": <integer 0-10>,
    "problem_solving_value": <integer 0-10>,
    "complexity": "<string: 'Low' or 'Medium' or 'High'>",
    "domain": "<string: domain classification>",
    "overall_score": <float 0-10, calculated as average of main scores>,
    "strengths": [<list of 2-3 key strengths as strings>],
    "weaknesses": [<list of 2-3 potential weaknesses as strings>],
    "improvement_suggestions": [<list of 2-3 specific actionable suggestions as strings>]
}}

Respond with ONLY the JSON object. No other text.
"""

    try:
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert academic advisor. Respond only with valid JSON, no other text."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        # Extract the response text
        response_text = response.choices[0].message.content.strip()
        
        # Clean up the response (remove markdown code blocks if present)
        response_text = re.sub(r'^```json\s*', '', response_text)
        response_text = re.sub(r'\s*```$', '', response_text)
        response_text = response_text.strip()
        
        # Parse JSON response
        evaluation = json.loads(response_text)
        
        # Validate and normalize the response
        evaluation = {
            "uniqueness": int(evaluation.get("uniqueness", 5)),
            "feasibility": int(evaluation.get("feasibility", 5)),
            "problem_solving_value": int(evaluation.get("problem_solving_value", 5)),
            "complexity": str(evaluation.get("complexity", "Medium")).capitalize(),
            "domain": str(evaluation.get("domain", "Other")),
            "overall_score": float(evaluation.get("overall_score", 0)),
            "strengths": evaluation.get("strengths", []),
            "weaknesses": evaluation.get("weaknesses", []),
            "improvement_suggestions": evaluation.get("improvement_suggestions", []),
        }
        
        # Ensure complexity is valid
        if evaluation["complexity"] not in ["Low", "Medium", "High"]:
            evaluation["complexity"] = "Medium"
        
        # Recalculate overall score
        main_scores = [
            evaluation["uniqueness"],
            evaluation["feasibility"],
            evaluation["problem_solving_value"]
        ]
        evaluation["overall_score"] = sum(main_scores) / len(main_scores)
        
        return evaluation
        
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse AI response as JSON: {str(e)}")
    except Exception as e:
        raise Exception(f"Error calling OpenAI API: {str(e)}")


def save_evaluation(
    db: Session,
    idea: str,
    user_id: str,
    evaluation_data: dict
) -> Evaluation:
    """Save evaluation to database."""
    evaluation = Evaluation(
        user_id=user_id,
        idea_text=idea,
        uniqueness_score=evaluation_data["uniqueness"],
        feasibility_score=evaluation_data["feasibility"],
        problem_solving_value=evaluation_data["problem_solving_value"],
        complexity=evaluation_data["complexity"],
        domain=evaluation_data["domain"],
        overall_score=evaluation_data["overall_score"],
        strengths=evaluation_data["strengths"],
        weaknesses=evaluation_data["weaknesses"],
        improvement_suggestions=evaluation_data["improvement_suggestions"],
    )
    
    db.add(evaluation)
    db.commit()
    db.refresh(evaluation)
    
    return evaluation
