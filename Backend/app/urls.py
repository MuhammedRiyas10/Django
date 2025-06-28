# app/urls.py
from django.urls import path
from .views import task_list, task_detail

urlpatterns = [
    path('tasks/', task_list, name='task_list'),
    path('tasks/<str:id>/', task_detail, name='task_detail'),  # Use <str:id> for MongoDB _id
]
