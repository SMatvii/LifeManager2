import django_filters
from django.db import models
from .models import Event

class EventFilter(django_filters.FilterSet):
    status = django_filters.ChoiceFilter(choices=Event.STATUS_CHOICES)
    start_date = django_filters.DateFilter(field_name='start_time', lookup_expr='date__gte')
    end_date = django_filters.DateFilter(field_name='start_time', lookup_expr='date__lte')
    month = django_filters.NumberFilter(field_name='start_time', lookup_expr='month')
    year = django_filters.NumberFilter(field_name='start_time', lookup_expr='year')
    
    class Meta:
        model = Event
        fields = ['status', 'start_date', 'end_date', 'month', 'year']