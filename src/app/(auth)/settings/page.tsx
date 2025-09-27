'use client';

import { useSession } from 'next-auth/react';
import { trpc } from '@/lib/trpc-client';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Settings, 
  User, 
  Shield, 
  Bell,
  Key,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { DevelopmentRibbon } from '@/components/ui/development-ribbon';

export default function SettingsPage() {
  const { data: session } = useSession();
  const { data: profile } = trpc.auth.getProfile.useQuery(undefined, {
    enabled: !!session,
  });


  const handleRefreshData = () => {
    toast.success('Данные обновлены');
  };

  const handleDeleteAccount = () => {
    if (confirm('Вы уверены, что хотите удалить аккаунт? Это действие необратимо.')) {
      toast.error('Функция удаления аккаунта в разработке');
    }
  };

  const handleViewSessions = () => {
    toast.info('Функция просмотра сессий в разработке');
  };

  return (
    <>
      <PageHeader
        title="Настройки"
        description="Управляйте настройками вашего аккаунта и приложений"
      />

      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Профиль
              </CardTitle>
              <CardDescription>
                Информация о вашем аккаунте
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="" alt={session?.user.name || ''} />
                  <AvatarFallback className="text-lg">
                    {session?.user.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{session?.user.name}</h3>
                  <p className="text-sm text-muted-foreground">{session?.user.email}</p>
                  <Badge variant="outline" className="mt-1">
                    MISIS: {session?.user.misisLogin}
                  </Badge>
                </div>
              </div>
              
              <Separator />
              
              {profile?.misisData && (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Полное имя</Label>
                    <Input value={profile.misisData.fullName} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Группа</Label>
                    <Input value={profile.misisData.group} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Факультет</Label>
                    <Input value={profile.misisData.faculty} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={profile.email} readOnly />
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleRefreshData}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Обновить данные
                </Button>
              </div>
            </CardContent>
          </Card>

          <DevelopmentRibbon variant="partial">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Безопасность
                </CardTitle>
                <CardDescription>
                  Настройки безопасности аккаунта
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Смена пароля</Label>
                  <p className="text-sm text-muted-foreground">
                    Пароль управляется через MISIS. Для смены пароля обратитесь в службу поддержки MISIS.
                  </p>
                  <Button variant="outline" disabled className="cursor-not-allowed">
                    Сменить пароль
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Активные сессии</Label>
                  <p className="text-sm text-muted-foreground">
                    Управление активными сессиями входа
                  </p>
                  <Button variant="outline" onClick={handleViewSessions}>
                    Просмотреть сессии
                  </Button>
                </div>
              </CardContent>
            </Card>
          </DevelopmentRibbon>

          <DevelopmentRibbon variant="development">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Уведомления
                </CardTitle>
                <CardDescription>
                  Настройки уведомлений
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 opacity-60">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Email уведомления</div>
                      <div className="text-sm text-muted-foreground">
                        Получать уведомления на email
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled
                      className="cursor-not-allowed"
                    >
                      Включено
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Уведомления о новых приложениях</div>
                      <div className="text-sm text-muted-foreground">
                        Уведомления о создании новых OAuth приложений
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled
                      className="cursor-not-allowed"
                    >
                      Включено
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </DevelopmentRibbon>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 md:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Быстрые действия
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <DevelopmentRibbon variant="development">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/oauth/applications">
                    <Key className="mr-2 h-4 w-4" />
                    OAuth Приложения
                  </a>
                </Button>
              </DevelopmentRibbon>
              <DevelopmentRibbon variant="development">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/docs">
                    <Settings className="mr-2 h-4 w-4" />
                    Документация
                  </a>
                </Button>
              </DevelopmentRibbon>
            </CardContent>
          </Card>

          <DevelopmentRibbon variant="development">
            <Card>
              <CardHeader>
                <CardTitle>Опасная зона</CardTitle>
              </CardHeader>
              <CardContent className="opacity-60">
                <div className="space-y-2">
                  <DevelopmentRibbon variant="development">
                    <Button 
                      variant="destructive" 
                      className="w-full justify-start cursor-not-allowed"
                      disabled
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Удалить аккаунт
                    </Button>
                  </DevelopmentRibbon>
                  <p className="text-xs text-muted-foreground">
                    Это действие необратимо. Все ваши данные будут удалены.
                  </p>
                </div>
              </CardContent>
            </Card>
          </DevelopmentRibbon>

          <Card>
            <CardHeader>
              <CardTitle>Информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Версия:</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Последний вход:</span>
                <span>Сегодня</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Статус:</span>
                <Badge variant="default">Активен</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
