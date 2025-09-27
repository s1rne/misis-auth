'use client';

import { trpc } from '@/lib/trpc-client';
import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreateApplicationButton } from '@/components/create-application-button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Key, 
  Plus, 
  ExternalLink, 
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useState, useMemo } from 'react';

export default function ApplicationsPage() {
  const { data: applications, isLoading } = trpc.oauth.getMyApplications.useQuery();
  const { data: userSettings } = trpc.oauth.getUserSettings.useQuery();
  const utils = trpc.useUtils();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  
  const updateMutation = trpc.oauth.updateApplication.useMutation({
    onSuccess: () => {
      toast.success('Приложение обновлено');
      utils.oauth.getMyApplications.invalidate();
    },
    onError: (error) => {
      toast.error('Ошибка при обновлении: ' + error.message);
    },
  });

  const handleToggleActive = (appId: string, currentStatus: boolean) => {
    updateMutation.mutate({
      id: appId,
      isActive: !currentStatus,
    });
  };

  // Фильтрация приложений
  const filteredApplications = useMemo(() => {
    if (!applications) return [];
    
    return applications.filter(app => {
      // Поиск по названию и описанию
      const matchesSearch = !searchQuery || 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.description && app.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Фильтр по статусу
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'active' && app.isActive) ||
        (filterStatus === 'inactive' && !app.isActive);
      
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchQuery, filterStatus]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-6">
          <div className="w-full space-y-4 md:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  OAuth Приложения
                </h1>
                <p className="text-muted-foreground">
                  Управляйте вашими приложениями для авторизации
                  {userSettings && (
                    <span className="block text-sm mt-1">
                      Использовано: {applications?.length || 0} / {userSettings.maxApplications} приложений
                    </span>
                  )}
                </p>
              </div>
              <CreateApplicationButton className="w-full sm:w-auto">
                Создать приложение
              </CreateApplicationButton>
            </div>

            {/* Лимит приложений предупреждение */}
            {userSettings && applications && applications.length >= userSettings.maxApplications && (
              <div className="border border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 text-yellow-800 dark:text-yellow-200">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
                  <p className="text-sm font-medium text-center">
                    Вы достигли лимита приложений ({userSettings.maxApplications}). 
                    Удалите неиспользуемые приложения или обратитесь к администратору для увеличения лимита.
                  </p>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск приложений..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Status Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto justify-start">
                    <Filter className="mr-2 h-4 w-4" />
                    {filterStatus === 'all' && 'Все'}
                    {filterStatus === 'active' && 'Активные'}
                    {filterStatus === 'inactive' && 'Неактивные'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => setFilterStatus('all')}
                    className={filterStatus === 'all' ? 'bg-accent' : ''}
                  >
                    Все приложения
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setFilterStatus('active')}
                    className={filterStatus === 'active' ? 'bg-accent' : ''}
                  >
                    Только активные
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setFilterStatus('inactive')}
                    className={filterStatus === 'inactive' ? 'bg-accent' : ''}
                  >
                    Только неактивные
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Applications List */}
            <Card>
              <CardHeader>
                <CardTitle>Ваши приложения</CardTitle>
                <CardDescription>
                  {filteredApplications.length} из {applications?.length || 0} приложений
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ApplicationsList 
                  applications={filteredApplications} 
                  isLoading={isLoading}
                  onToggleActive={handleToggleActive}
                  isUpdating={updateMutation.isPending}
                />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

function ApplicationsList({ 
  applications, 
  isLoading,
  onToggleActive,
  isUpdating
}: { 
  applications?: any[]; 
  isLoading: boolean;
  onToggleActive: (appId: string, currentStatus: boolean) => void;
  isUpdating: boolean;
}) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-sm text-muted-foreground">Загрузка приложений...</p>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="text-center py-12">
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
        <div key={app.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0 w-full sm:w-auto">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Key className="h-5 w-5 text-primary" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h3 className="font-medium truncate">{app.name}</h3>
                <Badge variant={app.isActive ? "default" : "secondary"} className="w-fit">
                  {app.isActive ? 'Активно' : 'Неактивно'}
                </Badge>
              </div>
              {app.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {app.description}
                </p>
              )}
              <div className="mt-2 text-xs text-muted-foreground font-mono break-all">
                Client ID: {app.clientId}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onToggleActive(app.id, app.isActive)}
              disabled={isUpdating}
              className="flex-1 sm:flex-none"
            >
              {app.isActive ? 'Деактивировать' : 'Активировать'}
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/oauth/applications/${app.id}`}>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
