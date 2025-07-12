from .utils.answer_ranker import rank_answers
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def rank_answers_api(request):
    question = request.data.get("question")
    answers = request.data.get("answers")  # list of strings

    ranked = rank_answers(question, answers)
    result = [
        {"index": i, "score": float(score), "answer": answer}
        for i, score, answer in ranked
    ]
    return Response({"ranked_answers": result})
