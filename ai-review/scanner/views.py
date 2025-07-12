from .utils.answer_ranker import rank_answers, clean_answers, is_profanity, is_low_effort
from .utils.tag_predictor import predict_tags
from .utils.model_loader import model_loader
from rest_framework.decorators import api_view
from rest_framework.response import Response
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
def predict_tags_api(request):
    title = request.data.get("title", "")
    description = request.data.get("description", "")
    
    if not model_loader.is_ready():
        logger.error("ML models not loaded")
        return Response({"error": "AI service not ready"}, status=503)
    
    try:
        tags = predict_tags(title, description)
        return Response({"predicted_tags": tags})
    except ValueError as e:
        logger.warning(f"Invalid input for tag prediction: {str(e)}")
        return Response({"error": "Invalid input data"}, status=400)
    except Exception as e:
        logger.error(f"Tag prediction error: {str(e)}")
        return Response({"error": "Internal server error"}, status=500)

@api_view(['POST'])
def filter_content_api(request):
    content = request.data.get("content", "")
    
    if not content:
        return Response({"error": "Content is required"}, status=400)
    
    try:
        is_clean_content = not (is_profanity(content) or is_low_effort(content))
        return Response({
            "is_clean": is_clean_content,
            "filtered_content": content
        })
    except Exception as e:
        logger.error(f"Content filtering error: {str(e)}")
        return Response({"error": "Internal server error"}, status=500)

@api_view(['POST'])
def rank_answers_api(request):
    question = request.data.get("question", "")
    answers = request.data.get("answers", [])  # list of strings

    try:
        ranked = rank_answers(question, answers)
        result = [
            {"index": i, "score": float(score), "answer": answer}
            for i, score, answer in ranked
        ]
        return Response({"ranked_answers": result})
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
def clean_answers_api(request):
    answers = request.data.get("answers", [])  # list of strings
    
    try:
        cleaned = clean_answers(answers)
        return Response({"cleaned_answers": cleaned})
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def health_check_api(request):
    models_ready = model_loader.is_ready()
    return Response({
        "status": "healthy" if models_ready else "degraded",
        "service": "ai-review",
        "message": "AI Review service is running",
        "models_loaded": models_ready
    })
