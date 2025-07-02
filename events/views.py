from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count
from datetime import datetime, timedelta
from .models import Event
from .serializers import EventSerializer, EventListSerializer
from .filters import EventFilter

class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = EventFilter
    ordering = ['-start_time']

    def get_queryset(self):
        return Event.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == 'list':
            return EventListSerializer
        return EventSerializer

    @action(detail=True, methods=['patch'])
    def change_status(self, request, pk=None):
        """Зміна статусу події"""
        event = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in ['planned', 'completed', 'cancelled']:
            return Response(
                {'error': 'Невірний статус'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        event.status = new_status
        event.save()
        
        return Response({
            'message': f'Статус події змінено на "{event.get_status_display()}"',
            'status': event.status
        })

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Статистика подій"""
        queryset = self.get_queryset()
        
        stats = queryset.aggregate(
            total=Count('id'),
            planned=Count('id', filter=models.Q(status='planned')),
            completed=Count('id', filter=models.Q(status='completed')),
            cancelled=Count('id', filter=models.Q(status='cancelled'))
        )
        
        return Response(stats)

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Найближчі події"""
        now = datetime.now()
        upcoming = self.get_queryset().filter(
            status='planned',
            start_time__gte=now
        ).order_by('start_time')[:10]
        
        serializer = EventListSerializer(upcoming, many=True)
        return Response(serializer.data)