# LifeManager - Python/Django Version

![LifeManager Logo](static/logo.svg)

Особистий помічник для управління подіями та фінансами, створений на Django з мінімальним використанням JavaScript.

## 🎯 Основні можливості

### 📅 Управління подіями
- **Створення та редагування подій**: Повний контроль над вашими заходами
- **Статуси подій**: Заплановано, завершено, скасовано
- **Календарне планування**: Зручний інтерфейс для планування
- **Фільтрація**: За датою, статусом та періодом

### 💰 Фінансовий трекер
- **Доходи та витрати**: Повний облік ваших фінансів
- **Категоризація**: Організація транзакцій за категоріями
- **Місячні звіти**: Детальна статистика за періоди
- **Візуалізація**: Графіки та діаграми

### 📊 Аналітика та звіти
- **Інтерактивні графіки**: Chart.js для візуалізації даних
- **Статистика подій**: Розподіл за статусами
- **Фінансові звіти**: Доходи, витрати, баланс
- **Експорт даних**: Можливість експорту через Django Admin

## 🚀 Встановлення

### 1. Клонування репозиторію
```bash
git clone <repository-url>
cd lifemanager-python
```

### 2. Створення віртуального середовища
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# або
venv\Scripts\activate  # Windows
```

### 3. Встановлення залежностей
```bash
pip install -r requirements.txt
```

### 4. Налаштування бази даних
```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Створення суперкористувача
```bash
python manage.py createsuperuser
```

### 6. Збір статичних файлів
```bash
python manage.py collectstatic
```

### 7. Запуск сервера
```bash
python manage.py runserver
```

Додаток буде доступний за адресою: http://127.0.0.1:8000/

## 🏗️ Структура проекту

```
lifemanager/
├── core/                   # Основний додаток
│   ├── models.py          # Категорії, базові моделі
│   ├── views.py           # Головна сторінка, панель управління
│   └── serializers.py     # API серіалізатори
├── events/                # Управління подіями
│   ├── models.py          # Модель подій
│   ├── views.py           # API для подій
│   └── filters.py         # Фільтри для подій
├── finance/               # Фінансовий трекер
│   ├── models.py          # Транзакції, бюджети
│   ├── views.py           # API для фінансів
│   └── filters.py         # Фільтри для транзакцій
├── templates/             # HTML шаблони
│   └── core/
│       ├── base.html      # Базовий шаблон
│       ├── index.html     # Головна сторінка
│       └── dashboard.html # Панель управління
├── static/                # Статичні файли
│   └── logo.svg          # Логотип сайту
└── manage.py             # Django управління
```

## 🎨 Дизайн та UI

### Особливості дизайну
- **Мінімальний JavaScript**: Основний функціонал на HTML/CSS
- **Responsive дизайн**: Адаптивність для всіх пристроїв
- **Градієнти та анімації**: Сучасний вигляд з CSS анімаціями
- **Кастомний логотип**: SVG логотип з градієнтами
- **Темна/світла тема**: Підтримка різних кольорових схем

### CSS Класи
```css
.gradient-primary    # Основний градієнт
.gradient-success    # Зелений градієнт
.gradient-danger     # Червоний градієнт
.card               # Стандартна картка
.btn                # Базова кнопка
.floating           # Анімація плавання
.fade-in            # Анімація появи
```

## 🔧 API Endpoints

### Аутентифікація
- `POST /api/auth/login/` - Вхід в систему
- `POST /api/auth/register/` - Реєстрація
- `POST /api/auth/logout/` - Вихід

### Події (Events)
- `GET /api/events/` - Список подій
- `POST /api/events/` - Створення події
- `GET /api/events/{id}/` - Деталі події
- `PUT /api/events/{id}/` - Оновлення події
- `DELETE /api/events/{id}/` - Видалення події
- `PATCH /api/events/{id}/change_status/` - Зміна статусу
- `GET /api/events/statistics/` - Статистика подій
- `GET /api/events/upcoming/` - Найближчі події

### Фінанси (Finance)
- `GET /api/finance/transactions/` - Список транзакцій
- `POST /api/finance/transactions/` - Створення транзакції
- `GET /api/finance/transactions/{id}/` - Деталі транзакції
- `PUT /api/finance/transactions/{id}/` - Оновлення транзакції
- `DELETE /api/finance/transactions/{id}/` - Видалення транзакції
- `GET /api/finance/transactions/monthly_stats/` - Місячна статистика
- `GET /api/finance/transactions/yearly_stats/` - Річна статистика

### Категорії (Categories)
- `GET /api/categories/` - Список категорій
- `POST /api/categories/` - Створення категорії
- `GET /api/categories/{id}/` - Деталі категорії
- `PUT /api/categories/{id}/` - Оновлення категорії
- `DELETE /api/categories/{id}/` - Видалення категорії

### Загальна статистика
- `GET /api/dashboard-stats/` - Статистика для панелі управління

## 🔍 Фільтрація та пошук

### Події
```
?status=planned          # Фільтр за статусом
?start_date=2024-01-01  # Події після дати
?end_date=2024-12-31    # Події до дати
?month=1                # Події за місяць
?year=2024              # Події за рік
```

### Транзакції
```
?type=income            # Фільтр за типом (income/expense)
?category=1             # Фільтр за категорією
?start_date=2024-01-01  # Транзакції після дати
?end_date=2024-12-31    # Транзакції до дати
?min_amount=100         # Мінімальна сума
?max_amount=1000        # Максимальна сума
```

## 📋 Моделі даних

### Event (Подія)
```python
title = CharField(max_length=200)           # Назва події
description = TextField(blank=True)         # Опис
start_time = DateTimeField()               # Час початку
end_time = DateTimeField()                 # Час завершення
status = CharField(choices=STATUS_CHOICES) # Статус
user = ForeignKey(User)                    # Користувач
```

### Transaction (Транзакція)
```python
title = CharField(max_length=200)          # Назва транзакції
amount = DecimalField(max_digits=10)       # Сума
category = ForeignKey(Category)            # Категорія
date = DateField()                         # Дата
type = CharField(choices=TYPE_CHOICES)     # Тип (income/expense)
related_event = ForeignKey(Event)          # Пов'язана подія
user = ForeignKey(User)                    # Користувач
```

### Category (Категорія)
```python
name = CharField(max_length=100)           # Назва
color = CharField(max_length=7)            # Колір (HEX)
icon = CharField(max_length=50)            # Іконка
user = ForeignKey(User)                    # Користувач
```

## 🛠️ Адміністрування

Адмін-панель доступна за адресою: http://127.0.0.1:8000/admin/

### Можливості адмін-панелі:
- **Управління користувачами**: Створення, редагування, видалення
- **Перегляд даних**: Всі події, транзакції, категорії
- **Фільтрація та пошук**: Зручні фільтри для всіх моделей
- **Експорт даних**: Можливість експорту в різних форматах
- **Статистика**: Агреговані дані по користувачах

## 🧪 Розробка

### Додавання нових функцій
1. Створіть нову міграцію:
   ```bash
   python manage.py makemigrations
   ```

2. Застосуйте міграцію:
   ```bash
   python manage.py migrate
   ```

3. Оновіть серіалізатори та API views
4. Додайте тести

### Тестування
```bash
python manage.py test
```

### Збір статичних файлів
```bash
python manage.py collectstatic
```

## 🚀 Деплой

### Налаштування для продакшену
1. Встановіть `DEBUG=False` в settings.py
2. Налаштуйте базу даних (PostgreSQL рекомендується)
3. Налаштуйте статичні файли
4. Встановіть HTTPS
5. Налаштуйте CORS для фронтенду

### Змінні середовища
```bash
SECRET_KEY=your-secret-key-here
DEBUG=False
DATABASE_URL=postgresql://user:pass@localhost/dbname
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
```

## 📱 Responsive дизайн

Додаток повністю адаптивний та працює на:
- **Desktop**: Повний функціонал
- **Tablet**: Адаптований інтерфейс
- **Mobile**: Мобільна версія з touch-friendly елементами

## 🎨 Кастомізація

### Зміна кольорів
Відредагуйте CSS змінні в `base.html`:
```css
:root {
    --primary-gradient: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
    --secondary-gradient: linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%);
    /* ... інші кольори */
}
```

### Додавання нових анімацій
```css
@keyframes yourAnimation {
    from { /* початковий стан */ }
    to { /* кінцевий стан */ }
}

.your-class {
    animation: yourAnimation 1s ease-in-out;
}
```

## 📄 Ліцензія

MIT License - дивіться файл LICENSE для деталей.

## 🤝 Внесок у проект

1. Fork проекту
2. Створіть feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit ваші зміни (`git commit -m 'Add some AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Відкрийте Pull Request

## 📞 Підтримка

Якщо у вас є питання або проблеми:
1. Перевірте існуючі Issues
2. Створіть новий Issue з детальним описом
3. Додайте скріншоти якщо необхідно

---

**LifeManager** - ваш надійний помічник для організації життя! 🚀