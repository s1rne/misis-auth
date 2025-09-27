'use client';

import { useSession, signIn } from 'next-auth/react';
import { trpc } from '@/lib/trpc-client';
import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { CreateApplicationButton } from '@/components/create-application-button';
import { 
  Key, 
  Plus, 
  ExternalLink, 
  Users, 
  Activity,
  Shield,
  Code,
  Globe
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { data: session, status } = useSession();
  const { data: profile } = trpc.auth.getProfile.useQuery(undefined, {
    enabled: !!session,
  });
  const { data: applications, isLoading } = trpc.oauth.getMyApplications.useQuery(undefined, {
    enabled: !!session,
  });

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">MISIS Auth</CardTitle>
            <CardDescription>
              OAuth сервер для авторизации через MISIS
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => signIn()} 
              className="w-full"
              size="lg"
            >
              <Users className="mr-2 h-4 w-4" />
              Войти через MISIS
            </Button>
            
            <Separator />
            
            <div className="text-center text-sm text-muted-foreground">
              <p>Для разработчиков:</p>
              <Link 
                href="/docs" 
                className="text-primary hover:text-primary/80 underline"
              >
                Документация API
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
            {/* Welcome Section */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Добро пожаловать, {profile?.misisData?.fullName || session.user.name}!
              </h1>
              <p className="text-muted-foreground">
                Управляйте вашими OAuth приложениями и настройками авторизации
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    OAuth Приложения
                  </CardTitle>
                  <Key className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {applications?.length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Активных приложений
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Активные токены
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">
                    В разработке
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    API Запросы
                  </CardTitle>
                  <Code className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">
                    За сегодня
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Статус
                  </CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    Онлайн
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Все системы работают
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
              {/* Profile Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={session.user.name || ''} />
                      <AvatarFallback>
                        {session.user.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    Профиль
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile?.misisData ? (
                    <>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Имя</div>
                        <div className="text-sm text-muted-foreground">
                          {profile.misisData.fullName}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Группа</div>
                        <div className="text-sm text-muted-foreground">
                          {profile.misisData.group}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Факультет</div>
                        <div className="text-sm text-muted-foreground">
                          {profile.misisData.faculty}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Email</div>
                        <div className="text-sm text-muted-foreground">
                          {profile.email}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Загрузка данных профиля...
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* OAuth Applications */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle>OAuth Приложения</CardTitle>
                      <CardDescription>
                        Управляйте вашими приложениями для авторизации
                      </CardDescription>
                    </div>
                    <CreateApplicationButton className="w-full sm:w-auto">
                      Создать
                    </CreateApplicationButton>
                  </div>
                </CardHeader>
                <CardContent>
                  <OAuthApplicationsList 
                    applications={applications} 
                    isLoading={isLoading} 
                  />
                </CardContent>
              </Card>
            </div>

            {/* API Info */}
            <Card>
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
                <CardDescription>
                  Основные эндпоинты для интеграции с OAuth сервером
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Authorization</div>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      /api/oauth/authorize
                    </code>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Token</div>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      /api/oauth/token
                    </code>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">User Info</div>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      /api/v1/user
                    </code>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Profile</div>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      /api/v1/user/profile
            </code>
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>
      </main>
      </div>
    </div>
  );
}

function OAuthApplicationsList({ 
  applications, 
  isLoading 
}: { 
  applications?: any[]; 
  isLoading: boolean; 
}) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-sm text-muted-foreground">Загрузка приложений...</p>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="text-center py-8">
        <Key className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">Нет приложений</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Создайте ваше первое OAuth приложение для начала работы
        </p>
        <CreateApplicationButton className="mt-4">
          Создать приложение
        </CreateApplicationButton>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium truncate">{app.name}</h3>
              <Badge variant={app.isActive ? "default" : "secondary"}>
                {app.isActive ? 'Активно' : 'Неактивно'}
              </Badge>
            </div>
            {app.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {app.description}
              </p>
            )}
            <div className="mt-2 text-xs text-muted-foreground font-mono">
              Client ID: {app.clientId}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/oauth/applications/${app.id}`}>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}