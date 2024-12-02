from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from openai import OpenAI
from ai_detection import detect_ai_content
import os
from dotenv import load_dotenv
import logging
from sqlalchemy import create_engine, Column, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import uuid

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables and initialize OpenAI
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./articles.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class ArticleDB(Base):
    __tablename__ = "articles"
    id = Column(String, primary_key=True)
    user_id = Column(String, index=True)
    original_text = Column(Text)
    summary = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "https://truthrisenews.netlify.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ArticleInput(BaseModel):
    text: str
    style: str = "balanced"
    target_audience: str = "general"
    output_format: str = "default"
    focus_areas: List[str] = []

class ArticleCreate(BaseModel):
    user_id: str
    original_text: str
    summary: str

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# def create_summary_prompt(text: str, style: str, target_audience: str, output_format: str, focus_areas: List[str]) -> str:
#     style_guides = {
#         "balanced": "Maintain objectivity, present all viewpoints equally, and provide comprehensive coverage.",
#         "academic": "Use academic language, focus on methodology and research findings, cite evidence.",
#         "technical": "Emphasize technical specifications, use domain-specific terminology, detail processes.",
#         "simplified": "Use clear, simple language, avoid jargon, explain complex concepts simply.",
#         "critical": "Analyze strengths and weaknesses, evaluate evidence, discuss implications."
#     }

#     audience_guides = {
#         "general": "Use accessible language, provide context, avoid technical jargon.",
#         "expert": "Use field-specific terminology, focus on technical details and nuanced analysis.",
#         "student": "Include explanations of key concepts, provide learning context, be educational.",
#         "professional": "Focus on practical applications, business implications, and actionable insights."
#     }

#     format_guides = {
#         "default": "Write a flowing narrative with clear paragraphs.",
#         "bulletpoints": "• Use bullet points for main ideas\n• Include supporting details\n• Organize hierarchically",
#         "structured": "Use sections: Overview, Key Points, Analysis, and Conclusions.",
#         "annotated": "Include explanatory notes and clarifications in brackets."
#     }

#     focus_instructions = ""
#     if focus_areas:
#         focus_instructions = "\nFocus particularly on: " + ", ".join(focus_areas)

#     return f"""Analyze and summarize the following text according to these specifications:

# STYLE: {style_guides.get(style, style_guides['balanced'])}

# AUDIENCE: {audience_guides.get(target_audience, audience_guides['general'])}

# FORMAT: {format_guides.get(output_format, format_guides['default'])}
# {focus_instructions}

# TEXT TO SUMMARIZE:
# {text}

# Provide a clear, well-organized summary that:
# 1. Captures the main arguments and key points
# 2. Maintains appropriate tone for the target audience
# 3. Follows the specified format
# 4. Preserves important context and nuance
# 5. Includes relevant examples or evidence"""

def create_summary_prompt(text: str, style: str, target_audience: str, output_format: str, focus_areas: List[str]) -> str:
    style_guides = {
        "balanced": """Present contrasting viewpoints with equal depth.
Use neutral language markers: "suggests," "indicates," "shows".
Include perspectives from all stakeholders mentioned.""",
        
        "academic": """Emphasize methodological rigor.
Include explicit references to research design.
Maintain formal academic tone throughout.
Note limitations and uncertainties.""",
        
        "technical": """Lead with specifications and technical parameters.
Define system relationships and dependencies.
Use precise technical terminology consistently.
Include operational details and procedures.""",
        
        "simplified": """Break down complex concepts into digestible components.
Use analogies for difficult concepts.
Define technical terms in parentheses.
Focus on practical implications.""",
        
        "critical": """Evaluate evidence quality explicitly.
Identify potential biases or limitations.
Discuss broader implications.
Compare against established frameworks."""
    }

    audience_guides = {
        "general": """Provide relevant background context.
Define all field-specific terms.
Use accessible examples.
Focus on practical implications.""",
        
        "expert": """Maintain technical precision.
Include domain-specific details.
Reference related concepts/theories.
Discuss technical implications.""",
        
        "student": """Explain underlying principles.
Connect to fundamental concepts.
Include learning objectives.
Provide examples that build understanding.""",
        
        "professional": """Focus on business impact.
Include implementation considerations.
Highlight resource requirements.
Note market or industry implications."""
    }

    format_guides = {
        "default": """Use clear topic sentences.
Ensure paragraph cohesion.
Include smooth transitions.
Maintain logical flow.""",
        
        "bulletpoints": """Start with overview bullet.
Use hierarchical structure.
Include sub-bullets for details.
Maintain parallel structure.""",
        
        "structured": """Structure as follows:
1. Overview: Provide high-level summary
2. Key Points: List major findings/arguments
3. Analysis: Discuss implications
4. Conclusions: Summarize key takeaways""",
        
        "annotated": """Place clarifications in [square brackets].
Include context notes where needed.
Define terms inline [term: definition].
Add methodological notes where relevant."""
    }

    quality_checklist = """
QUALITY CONTROL CHECKLIST:
- All main arguments are captured (improving recall)
- Supporting details are included (improving ROUGE-2)
- Style guidelines are strictly followed
- Audience-appropriate language is maintained
- Format requirements are met precisely
- Context and nuance are preserved
- Examples and evidence are incorporated
"""

    focus_instructions = ""
    if focus_areas:
        focus_instructions = "\nFOCUS AREAS: " + ", ".join(focus_areas)

    return f"""INITIALIZATION
Please carefully review the following specifications for this summarization task:

STYLE REQUIREMENTS:
{style_guides.get(style, style_guides['balanced'])}

AUDIENCE ADAPTATION:
{audience_guides.get(target_audience, audience_guides['general'])}

FORMAT SPECIFICATIONS:
{format_guides.get(output_format, format_guides['default'])}
{focus_instructions}

CONTENT ANALYSIS REQUIREMENTS:
Before starting the summary, analyze the text for:
1. Primary arguments and conclusions
2. Supporting evidence and examples
3. Technical terminology or field-specific concepts
4. Underlying assumptions or contextual factors

Generate a summary that adheres to these detailed guidelines:
- Begin with the most significant finding or argument
- Include ALL supporting evidence that reinforces main points
- Preserve specific numbers, statistics, and measurements
- Maintain cause-and-effect relationships
- Reference methodologies and data sources where relevant

TEXT TO SUMMARIZE:
{text}

{quality_checklist}

Remember to verify all checklist items before providing the final summary."""

@app.post("/api/summarize")
async def summarize_text(article: ArticleInput):
    if not article.text.strip():
        raise HTTPException(status_code=400, detail="No text provided")
    
    try:
        logger.info(f"Processing summary request with style: {article.style}, audience: {article.target_audience}")
        
        # Create the customized prompt
        prompt = create_summary_prompt(
            article.text,
            article.style,
            article.target_audience,
            article.output_format,
            article.focus_areas
        )

        # Generate the summary
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert summarizer who adapts content for different audiences and purposes."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            max_tokens=1000
        )

        summary = response.choices[0].message.content

        return {
            "summary": summary,
            "metadata": {
                "style_used": article.style,
                "target_audience": article.target_audience,
                "output_format": article.output_format,
                "focus_areas": article.focus_areas,
                "created_at": datetime.utcnow().isoformat(),
                "word_count": len(summary.split())
            }
        }
    
    except Exception as e:
        logger.error(f"Error generating summary: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate summary. Please try again.")

# Database operations
@app.post("/api/articles")
def create_article(article: ArticleCreate, db: Session = Depends(get_db)):
    try:
        logger.info(f"Saving article for user: {article.user_id}")
        db_article = ArticleDB(
            id=str(uuid.uuid4()),
            user_id=article.user_id,
            original_text=article.original_text,
            summary=article.summary,
            created_at=datetime.utcnow()
        )
        db.add(db_article)
        db.commit()
        db.refresh(db_article)
        return {"message": "Article saved successfully", "id": db_article.id}
    except Exception as e:
        logger.error(f"Error saving article: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to save article")

@app.get("/api/articles/{user_id}")
def get_user_articles(user_id: str, db: Session = Depends(get_db)):
    try:
        logger.info(f"Fetching articles for user: {user_id}")
        articles = db.query(ArticleDB).filter(ArticleDB.user_id == user_id).all()
        return [
            {
                "id": article.id,
                "original_text": article.original_text,
                "summary": article.summary,
                "created_at": article.created_at.isoformat()
            }
            for article in articles
        ]
    except Exception as e:
        logger.error(f"Error fetching articles: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch articles")

@app.delete("/api/articles/{article_id}")
def delete_article(article_id: str, db: Session = Depends(get_db)):
    try:
        article = db.query(ArticleDB).filter(ArticleDB.id == article_id).first()
        if not article:
            raise HTTPException(status_code=404, detail="Article not found")
        db.delete(article)
        db.commit()
        return {"message": "Article deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting article: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete article")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


@app.post("/api/detect-ai")
def detect_ai(article: ArticleInput):
    if not article.text.strip():
        raise HTTPException(status_code=400, detail="No text provided")
    
    try:
        logger.info("Processing AI detection request")
        result = detect_ai_content(client, article.text)
        return result
    except Exception as e:
        logger.error(f"Error in AI detection: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to analyze text")