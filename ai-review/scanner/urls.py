from django.urls import path
from . import views

urlpatterns = [
    path('predict-tags/', views.predict_tags_api, name='predict_tags'),
    path('filter-content/', views.filter_content_api, name='filter_content'),
    path('rank-answers/', views.rank_answers_api, name='rank_answers'),
    path('clean-answers/', views.clean_answers_api, name='clean_answers'),
    path('health/', views.health_check_api, name='health_check'),
] 