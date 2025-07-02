import django_filters
from .models import Transaction

class TransactionFilter(django_filters.FilterSet):
    type = django_filters.ChoiceFilter(choices=Transaction.TYPE_CHOICES)
    category = django_filters.NumberFilter(field_name='category__id')
    start_date = django_filters.DateFilter(field_name='date', lookup_expr='gte')
    end_date = django_filters.DateFilter(field_name='date', lookup_expr='lte')
    month = django_filters.NumberFilter(field_name='date', lookup_expr='month')
    year = django_filters.NumberFilter(field_name='date', lookup_expr='year')
    min_amount = django_filters.NumberFilter(field_name='amount', lookup_expr='gte')
    max_amount = django_filters.NumberFilter(field_name='amount', lookup_expr='lte')
    
    class Meta:
        model = Transaction
        fields = ['type', 'category', 'start_date', 'end_date', 'month', 'year', 'min_amount', 'max_amount']