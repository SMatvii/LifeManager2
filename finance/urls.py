from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'transactions', views.TransactionViewSet, basename='transaction')
router.register(r'budgets', views.MonthlyBudgetViewSet, basename='budget')

urlpatterns = [
    path('', include(router.urls)),
]