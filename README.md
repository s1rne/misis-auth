# MISIS Auth - OAuth сервер

OAuth сервер для авторизации через MISIS (Московский институт стали и сплавов). Позволяет другим сайтам использовать MISIS как провайдера авторизации.

🌐 **Рабочий сервис**: [https://misis-auth.vercel.app/](https://misis-auth.vercel.app/)

Это клиент OAuth сервис для МИСИС личного кабинета, который предоставляет безопасную авторизацию для внешних приложений через стандарт OAuth 2.0.

## Возможности

- 🔐 OAuth 2.0 сервер с поддержкой authorization code flow
- 🎓 Интеграция с MISIS личным кабинетом
- 📊 REST API для внешних клиентов
- 🚀 tRPC для внутреннего API
- 💾 MongoDB для хранения данных
- 🎨 Современный UI для управления приложениями

## Технологии

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, tRPC
- **База данных**: MongoDB с Mongoose
- **Аутентификация**: NextAuth.js
- **OAuth**: Собственная реализация OAuth 2.0
- **Парсинг**: Axios + Cheerio для MISIS

## Установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd misis-auth
```

2. Установите зависимости:
```bash
pnpm install
```

3. Настройте переменные окружения:
```bash
cp env.example .env.local
```

Отредактируйте `.env.local`:
```env
# MongoDB
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

4. Запустите приложение:
```bash
pnpm dev
```

## API Документация

### OAuth Endpoints

#### Authorization Endpoint
```
GET /api/oauth/authorize
```

Параметры:
- `client_id` - ID OAuth приложения
- `redirect_uri` - URI для перенаправления
- `response_type` - Должен быть "code"
- `scope` - Запрашиваемые разрешения
- `state` - Случайная строка для защиты от CSRF

#### Token Endpoint
```
POST /api/oauth/token
```

Параметры (form-data):
- `grant_type` - "authorization_code" или "refresh_token"
- `client_id` - ID OAuth приложения
- `client_secret` - Секрет OAuth приложения
- `code` - Код авторизации (для authorization_code)
- `refresh_token` - Refresh token (для refresh_token)
- `redirect_uri` - URI для перенаправления

### REST API

#### User Info
```
GET /api/v1/user
Authorization: Bearer <access_token>
```

#### User Profile
```
GET /api/v1/user/profile
Authorization: Bearer <access_token>
```

#### Token Validation
```
POST /api/v1/token/validate
Content-Type: application/json

{
  "access_token": "<access_token>"
}
```

#### OAuth Server Info
```
GET /api/v1/oauth/info
```

### tRPC API

Внутренний API для управления приложениями:

- `auth.getSession` - Получение текущей сессии
- `auth.getProfile` - Получение профиля пользователя
- `oauth.createApplication` - Создание OAuth приложения
- `oauth.getMyApplications` - Получение списка приложений
- `oauth.updateApplication` - Обновление приложения
- `oauth.deleteApplication` - Удаление приложения

## Scopes (Разрешения)

- `read` - Базовое чтение данных
- `profile` - Доступ к профилю пользователя
- `email` - Доступ к email адресу
- `misis_data` - Доступ к данным MISIS

## Пример интеграции

### 1. Создание OAuth приложения

1. Войдите в систему
2. Перейдите в "OAuth Приложения"
3. Нажмите "Создать приложение"
4. Заполните данные и получите `client_id` и `client_secret`

### 2. Authorization Flow

```javascript
// 1. Перенаправление пользователя на авторизацию
const authUrl = `https://your-misis-auth.com/api/oauth/authorize?` +
  `client_id=${CLIENT_ID}&` +
  `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
  `response_type=code&` +
  `scope=read profile&` +
  `state=${randomState}`;

window.location.href = authUrl;
```

### 3. Обмен кода на токен

```javascript
// 2. Обмен кода на токен
const response = await fetch('https://your-misis-auth.com/api/oauth/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: authorizationCode,
    redirect_uri: REDIRECT_URI,
  }),
});

const tokenData = await response.json();
// { access_token, token_type, expires_in, refresh_token, scope }
```

### 4. Использование токена

```javascript
// 3. Получение данных пользователя
const userResponse = await fetch('https://your-misis-auth.com/api/v1/user', {
  headers: {
    'Authorization': `Bearer ${tokenData.access_token}`,
  },
});

const userData = await userResponse.json();
// { id, email, misisLogin, profile: { fullName, group, faculty, ... } }
```

## Структура проекта

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/          # NextAuth.js
│   │   ├── oauth/         # OAuth endpoints
│   │   ├── trpc/          # tRPC
│   │   └── v1/            # REST API v1
│   ├── auth/              # Страницы аутентификации
│   ├── oauth/             # OAuth управление
│   └── page.tsx           # Главная страница
├── components/            # React компоненты
├── lib/                   # Утилиты и конфигурация
│   ├── auth.ts            # NextAuth.js конфигурация
│   ├── mongodb.ts         # MongoDB подключение
│   ├── oauth.ts           # OAuth сервер
│   ├── trpc.ts            # tRPC конфигурация
│   └── misis-client.ts    # MISIS парсер
├── models/                # Mongoose модели
├── server/                # tRPC роутеры
└── types/                 # TypeScript типы
```

## Разработка

### Запуск в режиме разработки

```bash
pnpm dev
```

### Сборка для продакшена

```bash
pnpm build
pnpm start
```

### Линтинг

```bash
pnpm lint
```

## Безопасность

- Все пароли хешируются с помощью bcrypt
- JWT токены подписываются секретным ключом
- OAuth токены имеют ограниченное время жизни
- Валидация всех входящих данных
- Защита от CSRF атак

## Лицензия

MIT License

## Поддержка

Для вопросов и предложений создавайте issues в репозитории.