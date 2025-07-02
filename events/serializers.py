from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    duration = serializers.ReadOnlyField()
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'start_time', 'end_time', 
            'status', 'duration', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

    def validate(self, data):
        if data.get('start_time') and data.get('end_time'):
            if data['start_time'] >= data['end_time']:
                raise serializers.ValidationError(
                    "Час початку повинен бути раніше часу завершення"
                )
        return data

class EventListSerializer(serializers.ModelSerializer):
    """Спрощений серіалізатор для списку подій"""
    class Meta:
        model = Event
        fields = ['id', 'title', 'start_time', 'end_time', 'status']