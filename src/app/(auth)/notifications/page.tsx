'use client';

import { PageHeader } from '@/components/layout/page-header';
import { DevelopmentRibbon } from '@/components/ui/development-ribbon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Check, X, AlertCircle, Info, CheckCircle } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <>
      <PageHeader
        title="Уведомления"
        description="Управляйте уведомлениями и просматривайте историю"
      />

      <div className="space-y-6">
        {/* Статистика уведомлений */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          <DevelopmentRibbon variant="development">
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Всего</p>
                    <p className="text-lg font-bold">12</p>
                  </div>
                  <Bell className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </DevelopmentRibbon>
          
          <DevelopmentRibbon variant="development">
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Непрочитанные</p>
                    <p className="text-lg font-bold">3</p>
                  </div>
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </DevelopmentRibbon>
          
          <DevelopmentRibbon variant="development">
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Сегодня</p>
                    <p className="text-lg font-bold">2</p>
                  </div>
                  <Info className="h-5 w-5 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </DevelopmentRibbon>
          
          <DevelopmentRibbon variant="development">
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">На этой неделе</p>
                    <p className="text-lg font-bold">8</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </DevelopmentRibbon>
        </div>

        {/* Действия */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button variant="outline" size="sm" className="text-xs sm:text-sm">
            <Check className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Отметить все как прочитанные</span>
            <span className="sm:hidden">Прочитанные</span>
          </Button>
          <Button variant="outline" size="sm" className="text-xs sm:text-sm">
            <X className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Очистить все</span>
            <span className="sm:hidden">Очистить</span>
          </Button>
        </div>

        {/* Список уведомлений */}
        <DevelopmentRibbon variant="development">
          <Card>
            <CardHeader>
              <CardTitle>Уведомления</CardTitle>
              <CardDescription>
                История всех уведомлений
              </CardDescription>
            </CardHeader>
            <CardContent>
            <div className="space-y-3">
              {/* Пример уведомления */}
              <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Info className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-medium truncate">Новое OAuth приложение</h4>
                    <Badge variant="secondary" className="text-xs ml-2">
                      Сегодня
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                    Приложение &quot;Test App&quot; было успешно создано
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                    <X className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>

              {/* Еще примеры */}
              <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 border rounded-lg opacity-60">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-medium truncate">Авторизация успешна</h4>
                    <Badge variant="outline" className="text-xs ml-2">
                      Вчера
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                    Вы успешно вошли в систему
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 border rounded-lg opacity-60">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-medium truncate">Обновление данных</h4>
                    <Badge variant="outline" className="text-xs ml-2">
                      2 дня назад
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                    Данные профиля были обновлены из MISIS
                  </p>
                </div>
              </div>

              {/* Дополнительные уведомления для демонстрации */}
              <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 border rounded-lg opacity-60">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Bell className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-medium truncate">Новая функция</h4>
                    <Badge variant="outline" className="text-xs ml-2">
                      3 дня назад
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                    Добавлена поддержка новых OAuth scopes
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 border rounded-lg opacity-60">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-medium truncate">Обновление безопасности</h4>
                    <Badge variant="outline" className="text-xs ml-2">
                      1 неделя назад
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                    Улучшена система аутентификации
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        </DevelopmentRibbon>
      </div>
    </>
  );
}
