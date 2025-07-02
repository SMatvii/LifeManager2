from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum, Count, Q
from datetime import datetime, timedelta
from .models import Transaction, MonthlyBudget
from .serializers import (
    TransactionSerializer, 
    TransactionListSerializer,
    MonthlyBudgetSerializer
)
from .filters import TransactionFilter

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = TransactionFilter
    ordering = ['-date', '-created_at']

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).select_related(
            'category', 'related_event'
        )

    def get_serializer_class(self):
        if self.action == 'list':
            return TransactionListSerializer
        return TransactionSerializer

    @action(detail=False, methods=['get'])
    def monthly_stats(self, request):
        """Місячна статистика"""
        year = request.query_params.get('year', datetime.now().year)
        month = request.query_params.get('month', datetime.now().month)
        
        queryset = self.get_queryset().filter(
            date__year=year,
            date__month=month
        )
        
        income = queryset.filter(type='income').aggregate(
            total=Sum('amount')
        )['total'] or 0
        
        expense = queryset.filter(type='expense').aggregate(
            total=Sum('amount')
        )['total'] or 0
        
        # Розбивка за категоріями
        category_breakdown = queryset.filter(type='expense').values(
            'category__name', 'category__color'
        ).annotate(
            total=Sum('amount')
        ).order_by('-total')
        
        return Response({
            'total_income': float(income),
            'total_expense': float(expense),
            'balance': float(income - expense),
            'category_breakdown': list(category_breakdown),
            'transactions_count': queryset.count()
        })

    @action(detail=False, methods=['get'])
    def yearly_stats(self, request):
        """Річна статистика по місяцях"""
        year = request.query_params.get('year', datetime.now().year)
        
        monthly_data = []
        for month in range(1, 13):
            queryset = self.get_queryset().filter(
                date__year=year,
                date__month=month
            )
            
            income = queryset.filter(type='income').aggregate(
                total=Sum('amount')
            )['total'] or 0
            
            expense = queryset.filter(type='expense').aggregate(
                total=Sum('amount')
            )['total'] or 0
            
            monthly_data.append({
                'month': month,
                'income': float(income),
                'expense': float(expense),
                'balance': float(income - expense)
            })
        
        return Response(monthly_data)

class MonthlyBudgetViewSet(viewsets.ModelViewSet):
    serializer_class = MonthlyBudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MonthlyBudget.objects.filter(user=self.request.user).select_related('category')