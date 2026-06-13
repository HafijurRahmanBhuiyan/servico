from django.urls import path
from . import views

urlpatterns = [
    path('chat/<int:booking_id>/messages/', views.MessageListCreateView.as_view()),
    path('chat/<int:booking_id>/mark-read/', views.MarkMessagesReadView.as_view()),
    path('chat/conversations/', views.ConversationListView.as_view()),
]
