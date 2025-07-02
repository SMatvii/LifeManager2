from django.contrib import admin
from .models import Event

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'start_time', 'end_time', 'status', 'user', 'created_at']
    list_filter = ['status', 'user', 'start_time', 'created_at']
    search_fields = ['title', 'description']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'start_time'
    
    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'user')
        }),
        ('Час', {
            'fields': ('start_time', 'end_time')
        }),
        ('Статус', {
            'fields': ('status',)
        }),
        ('Системна інформація', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )