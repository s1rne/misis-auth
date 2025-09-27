'use client';

import { trpc } from '@/lib/trpc-client';
import { PageHeader } from '@/components/layout/page-header';
import { ApplicationsList } from '@/components/oauth/application-card';
import { CreateApplicationButton } from '@/components/create-application-button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search,
  Filter
} from 'lucide-react';
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
    <>
      <PageHeader
        title="OAuth Приложения"
        description={`Управляйте вашими приложениями для авторизации${
          userSettings 
            ? `\nИспользовано: ${applications?.length || 0} / ${userSettings.maxApplications} приложений`
            : ''
        }`}
      >
        <CreateApplicationButton className="w-full sm:w-auto">
          Создать приложение
        </CreateApplicationButton>
      </PageHeader>

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
    </>
  );
}

