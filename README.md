# 🍕 Pizza Delivery API

Веб-приложение для доставки пиццы с REST API и фронтенд-интерфейсом. Проект включает в себя полный цикл: управление пиццами, ингредиентами, клиентами, заказами и курьерами.

---

## 📋 Описание проекта

Проект представляет собой сервис доставки пиццы, который позволяет:
- Просматривать меню пицц с фильтрацией и поиском
- Оформлять заказы
- Отслеживать историю заказов
- Управлять профилем клиента и адресами доставки
- Просматривать доступных курьеров

### Технологии

| Компонент | Технология |
|-----------|------------|
| **Бэкенд** | Node.js + Express.js |
| **База данных** | PostgreSQL + Sequelize ORM |
| **Документация API** | Swagger / OpenAPI |
| **Фронтенд** | HTML5, CSS3, Vanilla JavaScript |
| **Среда выполнения** | Node.js |

---

## 🚀 Установка и запуск

### 1. Клонирование репозитория

```bash
git clone https://github.com/aqquque/db_pizza_project
cd trade-project/trade-app
```
2. Установка зависимостей
```bash
npm install
```
3. Настройка базы данных PostgreSQL

Убедитесь, что PostgreSQL установлен и запущен. Создайте базу данных:
```bash
psql -U postgres -c "CREATE DATABASE pizza_delivery_db;"
```
4. Настройка переменных окружения

Создайте файл .env в папке trade-app:
```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=pizza_delivery_db
DB_PORT=5432
PORT=8080
```
5. Заполнение базы тестовыми данными
```bash
node seed2.js
```
6. Запуск сервера
```bash
npm start
```
7. Открыть приложение в браузере
```
http://localhost:8080
```
