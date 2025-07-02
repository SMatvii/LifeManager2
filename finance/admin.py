from django.contrib import admin
from .models import Transaction, MonthlyBudget

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['title', 'amount', 'type', 'category', 'date', 'user', 'created_at']
    list_filter = ['type', 'category', 'user', 'date', 'created_at']
    search_fields = ['title', 'category__name']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'date'
    
    fieldsets = (
        (None, {
            'fields': ('title', 'amount', 'type', 'category', 'user')
        }),
        ('Дата та зв\'язки', {
            'fields': ('date', 'related_event')
        }),
        ('Системна інформація', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(MonthlyBudget)
class MonthlyBudgetAdmin(admin.ModelAdmin):
    list_display = ['category', 'month', 'budget_amount', 'spent_amount', 'remaining_amount', 'user']
    list_filter = ['user', 'category', 'month']
    readonly_fields = ['spent_amount', 'remaining_amount', 'is_over_budget']