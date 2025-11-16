# Frontend - Telegram Bot Builder

React приложение для визуального создания Telegram ботов.

## Установка

```bash
npm install
```

## Запуск

```bash
npm start
```

Приложение откроется на `http://localhost:3000`

## Сборка для продакшена

```bash
npm run build
```

## Компоненты

### App.js
Главный компонент приложения:
- Управление состоянием
- API запросы
- Роутинг между views

### BotList.jsx
Список всех ботов:
- Карточки ботов
- Форма создания нового бота
- Действия (запуск, остановка, редактирование)

### BotBuilder.jsx
Визуальный редактор блоков:
- Панель доступных блоков
- Рабочая область с drag & drop
- Панель редактирования выбранного блока

### BlockEditor.jsx
Редактор параметров блока:
- Динамические формы в зависимости от типа
- Валидация данных
- Автосохранение изменений

### BotSettings.jsx
Настройки бота:
- Изменение имени
- Изменение токена
- Информация о боте

## Стили

Все стили находятся в папке `src/styles/` и используют обычный CSS.

## Зависимости

- **react-beautiful-dnd** - drag & drop функциональность
- **axios** - HTTP запросы к API
- **react-icons** - иконки

## Структура данных

### Bot
```javascript
{
  id: string,
  name: string,
  token: string,
  blocks: Block[],
  status: 'running' | 'stopped' | 'error',
  createdAt: string
}
```

### Block
```javascript
{
  id: string,
  type: string,
  data: object
}
```
