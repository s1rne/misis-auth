# Инструкция по настройке MISIS Auth

## Быстрый старт

1. **Установите зависимости:**
```bash
pnpm install
```

2. **Настройте переменные окружения:**
```bash
cp env.example .env.local
```

Отредактируйте `.env.local`:
```env
# MongoDB - замените на вашу ссылку
MONGODB_URI=mongodb://localhost:27017/misis-auth

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# MISIS
MISIS_BASE_URL=https://lk.misis.ru

# OAuth
OAUTH_CLIENT_SECRET=your-oauth-client-secret-here
JWT_SECRET=your-jwt-secret-here
```

3. **Запустите приложение:**
```bash
pnpm dev
```

4. **Откройте в браузере:**
```
http://localhost:3000
```

## Настройка MongoDB

### Локальная установка
```bash
# Установка MongoDB (macOS)
brew install mongodb-community

# Запуск
brew services start mongodb-community
```

### MongoDB Atlas (облако)
1. Создайте аккаунт на [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Создайте кластер
3. Получите connection string
4. Замените `MONGODB_URI` в `.env.local`

## Генерация секретных ключей

```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# JWT_SECRET
openssl rand -base64 32

# OAUTH_CLIENT_SECRET
openssl rand -base64 32
```

## Тестирование OAuth

1. **Создайте OAuth приложение:**
   - Войдите в систему
   - Перейдите в "OAuth Приложения"
   - Нажмите "Создать приложение"
   - Заполните данные

2. **Тестируйте авторизацию:**
```bash
# Authorization URL
curl "http://localhost:3000/api/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3001/callback&response_type=code&scope=read profile"

# Exchange code for token
curl -X POST http://localhost:3000/api/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&code=AUTHORIZATION_CODE&redirect_uri=http://localhost:3001/callback"

# Get user info
curl -H "Authorization: Bearer ACCESS_TOKEN" \
  http://localhost:3000/api/v1/user
```

## Структура API

### OAuth Endpoints
- `GET /api/oauth/authorize` - Авторизация
- `POST /api/oauth/token` - Получение токена
- `GET /api/v1/oauth/info` - Информация о сервере

### REST API
- `GET /api/v1/user` - Информация о пользователе
- `GET /api/v1/user/profile` - Полный профиль
- `POST /api/v1/token/validate` - Валидация токена

### tRPC API
- `auth.*` - Аутентификация
- `oauth.*` - Управление OAuth приложениями

## Troubleshooting

### Ошибка подключения к MongoDB
```bash
# Проверьте, что MongoDB запущен
brew services list | grep mongodb

# Проверьте connection string
echo $MONGODB_URI
```

### Ошибки аутентификации
- Проверьте правильность логина/пароля MISIS
- Убедитесь, что `MISIS_BASE_URL` правильный
- Проверьте, что сайт MISIS доступен

### Ошибки OAuth
- Проверьте `client_id` и `client_secret`
- Убедитесь, что `redirect_uri` совпадает
- Проверьте `scopes`

## Продакшен

1. **Настройте переменные окружения:**
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret
JWT_SECRET=your-production-jwt-secret
```

2. **Соберите приложение:**
```bash
pnpm build
```

3. **Запустите:**
```bash
pnpm start
```

## Мониторинг

- Логи приложения в консоли
- MongoDB Compass для просмотра данных
- Network tab в браузере для отладки API

## Безопасность

- Никогда не коммитьте `.env.local`
- Используйте сильные секретные ключи
- Ограничьте доступ к MongoDB
- Настройте HTTPS в продакшене
- Регулярно обновляйте зависимости
