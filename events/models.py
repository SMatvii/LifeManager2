from django.db import models
from django.contrib.auth.models import User
from core.models import BaseModel

class Event(BaseModel):
    STATUS_CHOICES = [
        ('planned', 'Заплановано'),
        ('completed', 'Завершено'),
        ('cancelled', 'Скасовано'),
    ]
    
    title = models.CharField(max_length=200, verbose_name="Назва")
    description = models.TextField(blank=True, verbose_name="Опис")
    start_time = models.DateTimeField(verbose_name="Час початку")
    end_time = models.DateTimeField(verbose_name="Час завершення")
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='planned',
        verbose_name="Статус"
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Користувач")

    class Meta:
        verbose_name = "Подія"
        verbose_name_plural = "Події"
        ordering = ['-start_time']

    def __str__(self):
        return self.title

    @property
    def duration(self):
        """Тривалість події в хвилинах"""
        return (self.end_time - self.start_time).total_seconds() / 60

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.start_time and self.end_time and self.start_time >= self.end_time:
            raise ValidationError("Час початку повинен бути раніше часу завершення")