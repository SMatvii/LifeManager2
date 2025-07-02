from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet, basename='category')

urlpatterns = [
    path('', views.home, name='home'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('api/dashboard-stats/', views.dashboard_stats, name='dashboard-stats'),
    path('api/auth/login/', views.auth_login, name='auth-login'),
    path('api/auth/register/', views.auth_register, name='auth-register'),
    path('api/auth/logout/', views.auth_logout, name='auth-logout'),
    path('api/', include(router.urls)),
]