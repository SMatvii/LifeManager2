from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Sum, Count
from datetime import datetime, timedelta
import json
from .models import Category
from .serializers import CategorySerializer
from events.models import Event
from finance.models import Transaction

def home(request):
    """Головна сторінка"""
    return render(request, 'core/index.html')

@login_required
def dashboard(request):
    """Панель управління"""
    return render(request, 'core/dashboard.html')

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard_stats(request):
    """Статистика для панелі управління"""
    user = request.user
    now = datetime.now()
    current_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    # Статистика подій
    events_stats = {
        'total': Event.objects.filter(user=user).count(),
        'planned': Event.objects.filter(user=user, status='planned').count(),
        'completed': Event.objects.filter(user=user, status='completed').count(),
        'cancelled': Event.objects.filter(user=user, status='cancelled').count(),
    }
    
    # Фінансова статистика за поточний місяць
    transactions_this_month = Transaction.objects.filter(
        user=user,
        date__gte=current_month_start
    )
    
    income = transactions_this_month.filter(type='income').aggregate(
        total=Sum('amount')
    )['total'] or 0
    
    expense = transactions_this_month.filter(type='expense').aggregate(
        total=Sum('amount')
    )['total'] or 0
    
    finance_stats = {
        'total_income': float(income),
        'total_expense': float(expense),
        'balance': float(income - expense),
    }
    
    # Найближчі події
    upcoming_events = Event.objects.filter(
        user=user,
        status='planned',
        start_time__gte=now
    ).order_by('start_time')[:5]
    
    # Останні транзакції
    recent_transactions = Transaction.objects.filter(
        user=user
    ).order_by('-date')[:5]
    
    return Response({
        'events_stats': events_stats,
        'finance_stats': finance_stats,
        'upcoming_events': [
            {
                'id': event.id,
                'title': event.title,
                'start_time': event.start_time,
                'status': event.status
            } for event in upcoming_events
        ],
        'recent_transactions': [
            {
                'id': trans.id,
                'title': trans.title,
                'amount': float(trans.amount),
                'type': trans.type,
                'date': trans.date,
                'category': trans.category.name if trans.category else None
            } for trans in recent_transactions
        ]
    })

@csrf_exempt
@require_http_methods(["POST"])
def auth_login(request):
    """API для входу користувача"""
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return JsonResponse({
                'success': False,
                'error': 'Введіть ім\'я користувача та пароль'
            })
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return JsonResponse({
                'success': True,
                'message': 'Успішний вхід',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'first_name': user.first_name,
                    'email': user.email
                }
            })
        else:
            return JsonResponse({
                'success': False,
                'error': 'Невірне ім\'я користувача або пароль'
            })
            
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'Невірний формат даних'
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': 'Помилка сервера'
        })

@csrf_exempt
@require_http_methods(["POST"])
def auth_register(request):
    """API для реєстрації користувача"""
    try:
        data = json.loads(request.body)
        
        # Перевірка обов'язкових полів
        required_fields = ['username', 'email', 'password', 'first_name', 'last_name']
        for field in required_fields:
            if not data.get(field):
                return JsonResponse({
                    'success': False,
                    'error': f'Поле {field} є обов\'язковим'
                })
        
        # Перевірка унікальності
        if User.objects.filter(username=data['username']).exists():
            return JsonResponse({
                'success': False,
                'error': 'Користувач з таким ім\'ям вже існує'
            })
        
        if User.objects.filter(email=data['email']).exists():
            return JsonResponse({
                'success': False,
                'error': 'Користувач з таким email вже існує'
            })
        
        # Створення користувача
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            first_name=data['first_name'],
            last_name=data['last_name']
        )
        
        return JsonResponse({
            'success': True,
            'message': 'Реєстрація успішна',
            'user': {
                'id': user.id,
                'username': user.username,
                'first_name': user.first_name,
                'email': user.email
            }
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'Невірний формат даних'
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': 'Помилка сервера'
        })

@csrf_exempt
@require_http_methods(["POST"])
def auth_logout(request):
    """API для виходу користувача"""
    try:
        logout(request)
        return JsonResponse({
            'success': True,
            'message': 'Успішний вихід'
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': 'Помилка сервера'
        })