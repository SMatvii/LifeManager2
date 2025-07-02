from django.db import models
from django.contrib.auth.models import User
from core.models import BaseModel, Category
from events.models import Event

class Transaction(BaseModel):
    TYPE_CHOICES = [
        ('income', 'Дохід'),
        ('expense', 'Витрата'),
    ]
    
    title = models.CharField(max_length=200, verbose_name="Назва")
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Сума")
    category = models.ForeignKey(
        Category, 
        on_delete=models.CASCADE, 
        verbose_name="Категорія"
    )
    date = models.DateField(verbose_name="Дата")
    type = models.CharField(
        max_length=10, 
        choices=TYPE_CHOICES, 
        verbose_name="Тип"
    )
    related_event = models.ForeignKey(
        Event, 
        null=True, 
        blank=True, 
        on_delete=models.SET_NULL,
        verbose_name="Пов'язана подія"
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Користувач")

    class Meta:
        verbose_name = "Транзакція"
        verbose_name_plural = "Транзакції"
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.title} - {self.amount} грн"

    @property
    def amount_display(self):
        """Відображення суми з знаком"""
        sign = '+' if self.type == 'income' else '-'
        return f"{sign}{self.amount}"

class MonthlyBudget(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Користувач")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name="Категорія")
    month = models.DateField(verbose_name="Місяць")
    budget_amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Бюджет")
    
    class Meta:
        verbose_name = "Місячний бюджет"
        verbose_name_plural = "Місячні бюджети"
        unique_together = ['user', 'category', 'month']

    def __str__(self):
        return f"{self.category.name} - {self.month.strftime('%m/%Y')}"

    @property
    def spent_amount(self):
        """Витрачена сума за місяць"""
        return Transaction.objects.filter(
            user=self.user,
            category=self.category,
            type='expense',
            date__year=self.month.year,
            date__month=self.month.month
        ).aggregate(total=models.Sum('amount'))['total'] or 0

    @property
    def remaining_amount(self):
        """Залишок бюджету"""
        return self.budget_amount - self.spent_amount

    @property
    def is_over_budget(self):
        """Чи перевищено бюджет"""
        return self.spent_amount > self.budget_amount