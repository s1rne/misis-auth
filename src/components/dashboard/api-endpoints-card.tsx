import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const endpoints = [
  {
    name: "Authorization",
    path: "/api/oauth/authorize",
    description: "Начало OAuth flow"
  },
  {
    name: "Token", 
    path: "/api/oauth/token",
    description: "Обмен кода на токен"
  },
  {
    name: "User Info",
    path: "/api/v1/user", 
    description: "Информация о пользователе"
  },
  {
    name: "Profile",
    path: "/api/v1/user/profile",
    description: "Полный профиль пользователя"
  }
]

export function ApiEndpointsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Endpoints</CardTitle>
        <CardDescription>
          Основные эндпоинты для интеграции с OAuth сервером
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {endpoints.map((endpoint) => (
            <div key={endpoint.path} className="space-y-2">
              <div className="text-sm font-medium">{endpoint.name}</div>
              <code className="text-sm bg-muted px-2 py-1 rounded block">
                {endpoint.path}
              </code>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
