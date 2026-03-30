import json
import re
import httpx
from typing import List, Optional, Dict
import google.genai as genai
from config import settings
from sqlalchemy.orm import Session
from models import Evaluation
from difflib import SequenceMatcher

# Initialize Gemini API client
client = genai.Client(api_key=settings.GEMINI_API_KEY)


def extract_keywords(idea: str) -> List[str]:
    """Extract 3-5 important keywords from the idea text."""
    # Remove common words
    common_words = {
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
        'have', 'has', 'do', 'does', 'did', 'will', 'would', 'could', 'can',
        'that', 'this', 'it', 'its', 'will', 'your', 'my', 'our'
    }
    
    # Split and clean
    words = re.findall(r'\b\w+\b', idea.lower())
    keywords = [w for w in words if len(w) > 3 and w not in common_words]
    
    # Return most important keywords (first ones tend to be main topics)
    return keywords[:5] if keywords else ['project']


def search_github_similar_projects(idea: str) -> Dict:
    """
    Search GitHub for similar projects using the idea keywords.
    Returns both successful results and any error info.
    """
    try:
        keywords = extract_keywords(idea)
        search_query = ' '.join(keywords[:3])  # Use top 3 keywords
        
        url = f"https://api.github.com/search/repositories?q={search_query}&sort=stars&per_page=5"
        
        with httpx.Client() as client_http:
            response = client_http.get(url, timeout=5.0)
            response.raise_for_status()
            
        data = response.json()
        
        results = {
            "total_found": data.get("total_count", 0),
            "projects": []
        }
        
        for repo in data.get("items", [])[:5]:
            results["projects"].append({
                "name": repo.get("name", ""),
                "url": repo.get("html_url", ""),
                "stars": repo.get("stargazers_count", 0),
                "description": repo.get("description", "")[:100] if repo.get("description") else "",
            })
        
        return results
    except Exception as e:
        # Return graceful error info
        return {
            "total_found": 0,
            "projects": [],
            "error": f"GitHub search temporarily unavailable: {str(e)[:50]}"
        }


def extract_keywords_from_ideas(idea_texts: List[str]) -> List[str]:
    """Extract keywords from multiple idea texts."""
    keywords_set = set()
    for idea in idea_texts:
        keywords_set.update(extract_keywords(idea))
    return list(keywords_set)


def semantic_similarity(idea1: str, idea2: str) -> float:
    """
    Calculate semantic similarity between two ideas using keyword overlap.
    More robust than exact text matching.
    """
    keywords1 = set(extract_keywords(idea1))
    keywords2 = set(extract_keywords(idea2))
    
    if not keywords1 or not keywords2:
        return SequenceMatcher(None, idea1.lower(), idea2.lower()).ratio()
    
    # Jaccard similarity on keywords
    intersection = len(keywords1 & keywords2)
    union = len(keywords1 | keywords2)
    keyword_similarity = intersection / union if union > 0 else 0
    
    # Also consider substring matching for high relevance
    text_similarity = SequenceMatcher(None, idea1.lower(), idea2.lower()).ratio()
    
    # Weighted average: prefer keyword matching
    return (keyword_similarity * 0.7) + (text_similarity * 0.3)


def calculate_similarity(idea1: str, idea2: str) -> float:
    """Calculate similarity ratio between two ideas (0-1) using semantic matching."""
    return semantic_similarity(idea1, idea2)


def find_similar_ideas(db: Session, idea: str, threshold: float = 0.5) -> List[Evaluation]:
    """Find previously submitted ideas similar to the input idea using semantic matching."""
    all_ideas = db.query(Evaluation).all()
    similar = []
    
    for existing_idea in all_ideas:
        similarity = calculate_similarity(idea, existing_idea.idea_text)
        if similarity >= threshold:
            similar.append(existing_idea)
    
    return sorted(similar, key=lambda x: calculate_similarity(idea, x.idea_text), reverse=True)


def get_combined_context(similar_ideas: List[Evaluation], github_results: Dict) -> str:
    """Build a combined context from GitHub projects and database ideas."""
    context_parts = []
    
    # GitHub context
    if github_results.get("total_found", 0) > 0:
        github_text = f"\n📊 GITHUB ANALYSIS: Found {github_results['total_found']} similar projects on GitHub:"
        for idx, project in enumerate(github_results.get("projects", [])[:3], 1):
            github_text += f"\n   {idx}. {project['name']} ({project['stars']} ⭐) - {project['description']}"
        github_text += f"\nNote: This high number of existing projects on GitHub significantly impacts uniqueness assessment."
        context_parts.append(github_text)
    
    # Database context
    if similar_ideas:
        db_text = f"\n📚 DATABASE: Found {len(similar_ideas)} similar ideas previously submitted:"
        for idx, idea in enumerate(similar_ideas[:3], 1):
            db_text += f"\n   {idx}. Score: {idea.overall_score:.1f}/10, Domain: {idea.domain}, Uniqueness: {idea.uniqueness_score}/10"
        context_parts.append(db_text)
    
    if not context_parts:
        return ""
    
    return "\n" + "\n".join(context_parts)


def evaluate_fyp_idea(idea: str, user_id: str, db: Session) -> dict:
    """
    Use Google Gemini to evaluate the FYP idea with external GitHub research.
    Returns a dictionary with the evaluation results.
    """
    # Search GitHub for similar projects
    github_results = search_github_similar_projects(idea)
    
    # Find similar ideas in the database
    similar_ideas = find_similar_ideas(db, idea)
    
    # Build combined context
    combined_context = get_combined_context(similar_ideas, github_results)
    
    # Build the evaluation prompt with both GitHub and database context
    prompt = f"""
You are an expert academic advisor evaluating Final Year Project (FYP) ideas for university students.
Evaluate the following FYP idea on these criteria (each scored 0-10):

1. **Uniqueness** - How original and innovative is the idea?
   - Consider: Similar projects on GitHub (if many exist, this reduces uniqueness)
   - Consider: Similar ideas already submitted by other students
   - Be realistic: existing solutions reduce the uniqueness score
2. **Technical Feasibility** - Can a student realistically implement it within the given time frame?
3. **Problem-Solving Value** - Does it solve a real problem? What's the practical impact?
4. **Complexity Level** - Is the scope appropriate for FYP? (Low/Medium/High)
5. **Domain Classification** - What field does it belong to? (e.g., AI, EdTech, Web Dev, IoT, etc.)

**FYP Idea to Evaluate:**
{idea}

**RESEARCH DATA PROVIDED:**
{combined_context if combined_context else "No similar projects found - idea may be more unique."}

**CRITICAL INSTRUCTIONS:**
- If many GitHub projects exist with similar functionality, SIGNIFICANTLY LOWER the uniqueness score (consider 4-6/10)
- If database shows similar ideas, factor this into uniqueness (consider 5-7/10)
- If both GitHub AND database have similar ideas, uniqueness should be LOW (3-5/10)
- If neither GitHub nor database have similar ideas, uniqueness can be HIGH (7-10/10)
- All other scores (feasibility, problem-solving, complexity) should be independent of uniqueness findings

**IMPORTANT:** You MUST respond with ONLY a valid JSON object in the following format (no markdown, no extra text):
{{
    "uniqueness": <integer 0-10, heavily influenced by GitHub/database research>,
    "feasibility": <integer 0-10>,
    "problem_solving_value": <integer 0-10>,
    "complexity": "<string: 'Low' or 'Medium' or 'High'>",
    "domain": "<string: domain classification>",
    "overall_score": <float 0-10, average of uniqueness, feasibility, and problem_solving_value>,
    "strengths": [<list of 2-3 key strengths as strings>],
    "weaknesses": [<list of 2-3 potential weaknesses as strings>],
    "improvement_suggestions": [<list of 2-3 specific actionable suggestions as strings>]
}}

Respond with ONLY the JSON object. No other text.
"""

    try:
        # Call Gemini API
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        
        # Extract the response text
        response_text = response.text.strip()
        
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
        raise Exception(f"Error calling Gemini API: {str(e)}")


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
