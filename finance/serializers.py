from rest_framework import serializers
from .models import Transaction, MonthlyBudget
from core.serializers import CategorySerializer
from events.serializers import EventListSerializer

class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_color = serializers.CharField(source='category.color', read_only=True)
    event_title = serializers.CharField(source='related_event.title', read_only=True)
    amount_display = serializers.ReadOnlyField()
    
    class Meta:
        model = Transaction
        fields = [
            'id', 'title', 'amount', 'amount_display', 'category', 'category_name', 
            'category_color', 'date', 'type', 'related_event', 'event_title',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class TransactionListSerializer(serializers.ModelSerializer):
    """Спрощений серіалізатор для списку транзакцій"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    amount_display = serializers.ReadOnlyField()
    
    class Meta:
        model = Transaction
        fields = ['id', 'title', 'amount', 'amount_display', 'category_name', 'date', 'type']

class MonthlyBudgetSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    spent_amount = serializers.ReadOnlyField()
    remaining_amount = serializers.ReadOnlyField()
    is_over_budget = serializers.ReadOnlyField()
    
    class Meta:
        model = MonthlyBudget
        fields = [
            'id', 'category', 'month', 'budget_amount', 'spent_amount', 
            'remaining_amount', 'is_over_budget', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)