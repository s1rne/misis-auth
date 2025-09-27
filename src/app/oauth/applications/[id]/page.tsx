'use client';

import { useParams, useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc-client';
import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { 
  ArrowLeft, 
  Copy, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  Key,
  AlertTriangle,
  Calendar,
  Code,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ApplicationDetails() {
  const params = useParams();
  const router = useRouter();
  const [showSecret, setShowSecret] = useState(false);
  
  const { data: application, isLoading } = trpc.oauth.getApplication.useQuery({
    id: params.id as string,
  });

  const utils = trpc.useUtils();
  
  const updateMutation = trpc.oauth.updateApplication.useMutation({
    onSuccess: () => {
      toast.success('Приложение обновлено');
      // Обновляем кэш для немедленного отображения изменений
      utils.oauth.getApplication.invalidate({ id: params.id as string });
      utils.oauth.getMyApplications.invalidate();
    },
    onError: (error) => {
      toast.error('Ошибка при обновлении: ' + error.message);
    },
  });

  const deleteMutation = trpc.oauth.deleteApplication.useMutation({
    onSuccess: () => {
      toast.success('Приложение удалено');
      router.push('/oauth/applications');
    },
    onError: (error) => {
      toast.error('Ошибка при удалении: ' + error.message);
    },
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} скопирован в буфер обмена`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Приложение не найдено</h1>
          <Button asChild className="mt-4">
            <Link href="/oauth/applications">Вернуться к приложениям</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleToggleActive = () => {
    updateMutation.mutate({
      id: application.id,
      isActive: !application.isActive,
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate({ id: application.id });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/oauth/applications">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Назад
                </Link>
              </Button>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight">{application.name}</h1>
                  <Badge variant={application.isActive ? "default" : "secondary"}>
                    {application.isActive ? 'Активно' : 'Неактивно'}
                  </Badge>
                </div>
                {application.description && (
                  <p className="text-muted-foreground mt-1">{application.description}</p>
                )}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Application Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      Информация о приложении
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Client ID</Label>
                      <div className="flex gap-2">
                        <Input
                          value={application.clientId}
                          readOnly
                          className="font-mono"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(application.clientId, 'Client ID')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Client Secret</Label>
                      <div className="flex gap-2">
                        <Input
                          type={showSecret ? "text" : "password"}
                          value={showSecret ? application.clientSecret : "••••••••••••••••"}
                          readOnly
                          className="font-mono"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setShowSecret(!showSecret)}
                        >
                          {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(application.clientSecret, 'Client Secret')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Никогда не делитесь Client Secret с другими
                        </AlertDescription>
                      </Alert>
                    </div>

                    <div className="space-y-2">
                      <Label>Redirect URIs</Label>
                      <div className="space-y-2">
                        {application.redirectUris.map((uri: string, index: number) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={uri}
                              readOnly
                              className="font-mono"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => copyToClipboard(uri, 'Redirect URI')}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Scopes</Label>
                      <div className="flex flex-wrap gap-2">
                        {application.scopes.map((scope: string) => (
                          <Badge key={scope} variant="outline">
                            {scope}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* OAuth Flow Example */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Пример интеграции
                    </CardTitle>
                    <CardDescription>
                      Как использовать это приложение в вашем коде
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>1. Authorization URL</Label>
                      <div className="relative">
                        <pre className="bg-muted p-4 pr-12 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap break-all">
                          <code>{typeof window !== 'undefined' && `${window.location.origin}/api/oauth/authorize?client_id=${application.clientId}&redirect_uri=${encodeURIComponent(application.redirectUris[0])}&response_type=code&scope=${application.scopes.join(' ')}&state=random_state`}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2 h-8 w-8 p-0"
                          onClick={() => copyToClipboard(
                            typeof window !== 'undefined' ? `${window.location.origin}/api/oauth/authorize?client_id=${application.clientId}&redirect_uri=${encodeURIComponent(application.redirectUris[0])}&response_type=code&scope=${application.scopes.join(' ')}&state=random_state` : '',
                            'Authorization URL'
                          )}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>2. Exchange Code for Token</Label>
                      <div className="relative">
                        <pre className="bg-muted p-4 pr-12 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap break-all">
                          <code>{`POST /api/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
client_id=${application.clientId}
client_secret=${application.clientSecret}
code=authorization_code
redirect_uri=${application.redirectUris[0]}`}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2 h-8 w-8 p-0"
                          onClick={() => copyToClipboard(
                            `POST /api/oauth/token\nContent-Type: application/x-www-form-urlencoded\n\ngrant_type=authorization_code\nclient_id=${application.clientId}\nclient_secret=${application.clientSecret}\ncode=authorization_code\nredirect_uri=${application.redirectUris[0]}`,
                            'Token Request'
                          )}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>3. Use Access Token</Label>
                      <div className="relative">
                        <pre className="bg-muted p-4 pr-12 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap break-all">
                          <code>{`GET /api/v1/user
Authorization: Bearer access_token`}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2 h-8 w-8 p-0"
                          onClick={() => copyToClipboard(
                            'GET /api/v1/user\nAuthorization: Bearer access_token',
                            'API Request'
                          )}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Управление</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={handleToggleActive}
                      disabled={updateMutation.isPending}
                      variant={application.isActive ? "destructive" : "default"}
                      className="w-full"
                    >
                      {updateMutation.isPending 
                        ? 'Обновление...' 
                        : application.isActive 
                          ? 'Деактивировать' 
                          : 'Активировать'
                      }
                    </Button>

                    <DeleteConfirmationDialog
                      title="Удалить приложение"
                      description={`Вы уверены, что хотите удалить приложение "${application.name}"? Это действие нельзя отменить. Все связанные токены доступа будут аннулированы.`}
                      onConfirm={handleDelete}
                      triggerText="Удалить приложение"
                      isPending={deleteMutation.isPending}
                      className="w-full"
                    />
                  </CardContent>
                </Card>

                {/* Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Статистика
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Создано:</span>
                      <span className="text-sm">
                        {new Date(application.createdAt).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Обновлено:</span>
                      <span className="text-sm">
                        {new Date(application.updatedAt).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Links */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Быстрые ссылки
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/docs">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Документация API
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/oauth/applications">
                        <Key className="mr-2 h-4 w-4" />
                        Все приложения
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
