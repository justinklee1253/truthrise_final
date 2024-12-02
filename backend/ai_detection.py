from fastapi import HTTPException
from typing import Dict, Any
import re
import logging

logger = logging.getLogger(__name__)

def analyze_text_patterns(text: str) -> Dict[str, float]:
    """Basic text pattern analysis without NLTK dependency."""
    try:
        # Basic text cleaning
        text = text.strip()
        sentences = [s.strip() for s in text.split('.') if s.strip()]
        words = text.lower().split()
        
        # Basic metrics
        avg_sentence_length = len(words) / len(sentences) if sentences else 0
        unique_words = len(set(words))
        lexical_diversity = unique_words / len(words) if words else 0
        
        # Analyze sentence beginnings
        sentence_starts = [s.split()[0] for s in sentences if s.split()]
        sentence_variety = len(set(sentence_starts)) / len(sentences) if sentences else 0
        
        # Check repetition
        word_pairs = [' '.join(words[i:i+2]) for i in range(len(words)-1)]
        unique_pairs = len(set(word_pairs)) / len(word_pairs) if word_pairs else 0
        
        return {
            "avg_sentence_length": min(avg_sentence_length / 30, 1),  # Normalize
            "lexical_diversity": lexical_diversity,
            "sentence_variety": sentence_variety,
            "unique_patterns": unique_pairs
        }
    except Exception as e:
        logger.error(f"Error in pattern analysis: {str(e)}")
        return {
            "avg_sentence_length": 0,
            "lexical_diversity": 0,
            "sentence_variety": 0,
            "unique_patterns": 0
        }
# def detect_ai_content(client, text: str) -> Dict[str, Any]:
#     try:
#         patterns = analyze_text_patterns(text)
        
#         response = client.chat.completions.create(
#             model="gpt-3.5-turbo",
#             messages=[
#                 {
#                     "role": "system",
#                     "content": "Analyze this text and determine if it's AI-generated. Consider writing style, natural language patterns, contextual understanding, and human-like nuances."
#                 },
#                 {
#                     "role": "user",
#                     "content": f"Analyze this text:\n\n{text}"
#                 }
#             ],
#             temperature=0.1
#         )
        
#         analysis = response.choices[0].message.content
#         is_human = "human" in analysis.lower() and "generate" in analysis.lower()
        
#         pattern_score = sum(patterns.values()) / len(patterns)
#         confidence = pattern_score * 0.8 + 0.2

#         return {
#             "is_ai_generated": not is_human,  # Flip based on analysis
#             "confidence": confidence,
#             "metrics": {
#                 "pattern_analysis": patterns,
#                 "style_indicators": {
#                     "repetitive_patterns": patterns["unique_patterns"] < 0.6,
#                     "uniform_sentences": patterns["sentence_variety"] < 0.5,
#                     "mechanical_structure": patterns["avg_sentence_length"] > 0.7,
#                     "limited_variety": patterns["lexical_diversity"] < 0.4
#                 }
#             },
#             "analysis": analysis
#         }
        
#     except Exception as e:
#         logger.error(f"Error in AI detection: {str(e)}")
#         raise HTTPException(status_code=500, detail="AI detection failed")

# def detect_ai_content(client, text: str) -> Dict[str, Any]:
#     try:
#         patterns = analyze_text_patterns(text)
#         response = client.chat.completions.create(
#             model="gpt-3.5-turbo",
#             messages=[{
#                 "role": "system",
#                 "content": "Analyze this text and determine if it's AI-generated. Consider writing style, natural language patterns, contextual understanding, and human-like nuances."
#             }, {
#                 "role": "user",
#                 "content": f"Analyze this text:\n\n{text}"
#             }],
#             temperature=0.1
#         )
        
#         analysis = response.choices[0].message.content
#         is_ai = "ai-generated" in analysis.lower() or "appears to be ai" in analysis.lower()
        
#         pattern_score = sum(patterns.values()) / len(patterns)
#         confidence = pattern_score * 0.8 + 0.2

#         return {
#             "is_ai_generated": is_ai,  # Changed from not is_human
#             "confidence": confidence,
#             "metrics": {
#                 "pattern_analysis": patterns,
#                 "style_indicators": {
#                     "repetitive_patterns": patterns["unique_patterns"] < 0.6,
#                     "uniform_sentences": patterns["sentence_variety"] < 0.5,
#                     "mechanical_structure": patterns["avg_sentence_length"] > 0.7,
#                     "limited_variety": patterns["lexical_diversity"] < 0.4
#                 }
#             },
#             "analysis": analysis
#         }
#     except Exception as e:
#         logger.error(f"Error in AI detection: {str(e)}")
#         raise HTTPException(status_code=500, detail="AI detection failed")

def detect_ai_content(client, text: str) -> Dict[str, Any]:
    try:
        patterns = analyze_text_patterns(text)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{
                "role": "system", 
                "content": """Analyze if this text is AI-generated. Look for:
                1. Repetitive patterns
                2. Natural language variations
                3. Contextual understanding
                4. Human-like nuances
                First state either 'HUMAN_WRITTEN' or 'AI_GENERATED', then provide your analysis."""
            }, {
                "role": "user",
                "content": f"Text:\n{text}"
            }],
            temperature=0.1
        )
        
        analysis = response.choices[0].message.content
        # Check for AI markers in the actual analysis
        is_ai = (
            analysis.upper().startswith("AI_GENERATED") or 
            "appears to be ai" in analysis.lower() or
            "ai-generated" in analysis.lower()
        )
        
        pattern_score = sum(patterns.values()) / len(patterns)
        confidence = pattern_score * 0.8 + 0.2

        return {
            "is_ai_generated": is_ai,
            "confidence": confidence,
            "metrics": {
                "pattern_analysis": patterns,
                "style_indicators": {
                    "repetitive_patterns": patterns["unique_patterns"] < 0.6,
                    "uniform_sentences": patterns["sentence_variety"] < 0.5,
                    "mechanical_structure": patterns["avg_sentence_length"] > 0.7,
                    "limited_variety": patterns["lexical_diversity"] < 0.4
                }
            },
            "analysis": analysis.replace("AI_GENERATED", "").replace("HUMAN_WRITTEN", "").strip()
        }
    except Exception as e:
        logger.error(f"Error in AI detection: {str(e)}")
        raise HTTPException(status_code=500, detail="AI detection failed")