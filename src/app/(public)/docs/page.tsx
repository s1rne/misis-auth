'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, 
  Code, 
  Key, 
  Users, 
  Shield,
  ExternalLink,
  Copy,
  Check,
  Home
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function DocsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    toast.success('Код скопирован в буфер обмена');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const codeExamples = {
    authUrl: `${typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/api/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=https://your-app.com/callback&response_type=code&scope=read+profile&state=random_state`,
    tokenRequest: `POST /api/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
client_id=YOUR_CLIENT_ID
client_secret=YOUR_CLIENT_SECRET
code=AUTHORIZATION_CODE
redirect_uri=https://your-app.com/callback`,
    userInfo: `GET /api/v1/user
Authorization: Bearer ACCESS_TOKEN`,
    tokenValidation: `POST /api/v1/token/validate
Content-Type: application/json

{
  "access_token": "ACCESS_TOKEN"
}`
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Документация API
              </h1>
              <p className="text-muted-foreground text-lg">
                Полное руководство по интеграции с MISIS Auth OAuth сервером
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Главная
              </Link>
            </Button>
          </div>
        </div>

        <div className="space-y-8">

      {/* Overview */}
      <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Обзор
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  MISIS Auth - это OAuth 2.0 сервер, который позволяет внешним приложениям 
                  использовать MISIS как провайдера авторизации. Пользователи могут войти 
                  в ваше приложение, используя свои учетные данные MISIS.
                </p>
                
                <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                  <div className="text-center p-4 border rounded-lg">
                    <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-medium">Авторизация</h3>
                    <p className="text-sm text-muted-foreground">Безопасный вход через MISIS</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Key className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-medium">OAuth 2.0</h3>
                    <p className="text-sm text-muted-foreground">Стандартный протокол</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Code className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-medium">REST API</h3>
                    <p className="text-sm text-muted-foreground">Простая интеграция</p>
                  </div>
                </div>
              </CardContent>
            </Card>

      {/* Getting Started */}
      <Card>
              <CardHeader>
                <CardTitle>Быстрый старт</CardTitle>
                <CardDescription>
                  Начните интеграцию за 3 простых шага
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      1
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Создайте OAuth приложение</h3>
                      <p className="text-sm text-muted-foreground">
                        Зарегистрируйтесь в системе и создайте новое OAuth приложение. 
                        Получите Client ID и Client Secret.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      2
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Настройте redirect URI</h3>
                      <p className="text-sm text-muted-foreground">
                        Укажите URL, на который будет перенаправлен пользователь после авторизации.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      3
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Реализуйте OAuth flow</h3>
                      <p className="text-sm text-muted-foreground">
                        Следуйте примеру ниже для реализации авторизации в вашем приложении.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

      {/* OAuth Flow */}
      <Card>
              <CardHeader>
                <CardTitle>OAuth 2.0 Flow</CardTitle>
                <CardDescription>
                  Authorization Code Flow - рекомендуемый способ авторизации
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Шаг 1</Badge>
                    <h3 className="font-medium">Перенаправление на авторизацию</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Перенаправьте пользователя на наш authorization endpoint с необходимыми параметрами.
                  </p>
                  <div className="relative">
                    <pre className="bg-muted p-4 pr-12 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap break-all">
                      <code>{codeExamples.authUrl}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 h-8 w-8 p-0"
                      onClick={() => copyToClipboard(codeExamples.authUrl, 'authUrl')}
                    >
                      {copiedCode === 'authUrl' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Step 2 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Шаг 2</Badge>
                    <h3 className="font-medium">Обмен кода на токен</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    После авторизации пользователь будет перенаправлен обратно с кодом. 
                    Обменяйте этот код на access token.
                  </p>
                  <div className="relative">
                    <pre className="bg-muted p-4 pr-12 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap break-all">
                      <code>{codeExamples.tokenRequest}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 h-8 w-8 p-0"
                      onClick={() => copyToClipboard(codeExamples.tokenRequest, 'tokenRequest')}
                    >
                      {copiedCode === 'tokenRequest' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Step 3 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Шаг 3</Badge>
                    <h3 className="font-medium">Использование токена</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Используйте полученный access token для доступа к API пользователя.
                  </p>
                  <div className="relative">
                    <pre className="bg-muted p-4 pr-12 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap break-all">
                      <code>{codeExamples.userInfo}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 h-8 w-8 p-0"
                      onClick={() => copyToClipboard(codeExamples.userInfo, 'userInfo')}
                    >
                      {copiedCode === 'userInfo' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

      {/* API Endpoints */}
      <Card>
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
                <CardDescription>
                  Все доступные эндпоинты для интеграции
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-2">
                    <div>
                      <div className="font-medium">Authorization</div>
                      <div className="text-sm text-muted-foreground">Начало OAuth flow</div>
                    </div>
                    <Badge variant="outline" className="w-fit text-xs">GET /api/oauth/authorize</Badge>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-2">
                    <div>
                      <div className="font-medium">Token</div>
                      <div className="text-sm text-muted-foreground">Обмен кода на токен</div>
                    </div>
                    <Badge variant="outline" className="w-fit text-xs">POST /api/oauth/token</Badge>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-2">
                    <div>
                      <div className="font-medium">User Info</div>
                      <div className="text-sm text-muted-foreground">Информация о пользователе</div>
                    </div>
                    <Badge variant="outline" className="w-fit text-xs">GET /api/v1/user</Badge>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-2">
                    <div>
                      <div className="font-medium">Profile</div>
                      <div className="text-sm text-muted-foreground">Полный профиль пользователя</div>
                    </div>
                    <Badge variant="outline" className="w-fit text-xs">GET /api/v1/user/profile</Badge>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-2">
                    <div>
                      <div className="font-medium">Token Validation</div>
                      <div className="text-sm text-muted-foreground">Проверка токена</div>
                    </div>
                    <Badge variant="outline" className="w-fit text-xs">POST /api/v1/token/validate</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

      {/* Scopes */}
      <Card>
              <CardHeader>
                <CardTitle>Scopes (Разрешения)</CardTitle>
                <CardDescription>
                  Доступные разрешения для запроса у пользователя
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="text-lg">👁️</div>
                    <div>
                      <div className="font-medium">read</div>
                      <div className="text-sm text-muted-foreground">
                        Базовое чтение данных пользователя
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="text-lg">👤</div>
                    <div>
                      <div className="font-medium">profile</div>
                      <div className="text-sm text-muted-foreground">
                        Доступ к полному профилю пользователя
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="text-lg">📧</div>
                    <div>
                      <div className="font-medium">email</div>
                      <div className="text-sm text-muted-foreground">
                        Доступ к email адресу
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="text-lg">🎓</div>
                    <div>
                      <div className="font-medium">misis_data</div>
                      <div className="text-sm text-muted-foreground">
                        Доступ к данным MISIS (группа, факультет и т.д.)
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

      {/* Support */}
      <Card>
              <CardHeader>
                <CardTitle>Поддержка</CardTitle>
                <CardDescription>
                  Нужна помощь? Мы всегда готовы помочь
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" asChild className="w-full sm:w-auto">
                    <a href="mailto:m2501350@edu.misis.ru">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Написать в поддержку
                    </a>
                  </Button>
                  <Button variant="outline" asChild className="w-full sm:w-auto">
                    <a href="https://t.me/s1rne" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Telegram поддержка
                    </a>
                  </Button>
                  <Button variant="outline" asChild className="w-full sm:w-auto">
                    <a href="https://github.com/misis-auth/docs" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      GitHub
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
