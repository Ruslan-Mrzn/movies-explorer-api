# Бэкенд часть дипломного проекта `Сайт-портфолио` на `Express.js`

## Описание

Серверная часть дипломного проекта для защиты, проверки и правильного хранения данных пользователей

## Консольные команды для локальной разработки

В директории проекта вы можете запустить:

### `npm run start` — запускает сервер в production режиме

### `npm run dev` — запускает сервер с hot-reload для локальной разработки

## Функциональность проекта

* Отдельные схемы для фильмов и пользователей для записи в базу данных

* Для управления базой данных использвано `MongoDB` в сочетании с `Mongoose`

* Код "разбит" на отдельные контроллеры

* Использованы кастомные middlewar'ы

* Роутинг описан в отдельной директории и файлах

## Что планирую улучшить

* Добавить фильтрацию и выдачу фильмов текущего пользователя, т.к. фильтрация "на клиете" - не совсем логична
