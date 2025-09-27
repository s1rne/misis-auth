'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc-client';
import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Plus, Trash2, Check } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function NewApplication() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [redirectUris, setRedirectUris] = useState(['']);
  const [scopes, setScopes] = useState(['read', 'profile']);
  
  const router = useRouter();
  const createMutation = trpc.oauth.createApplication.useMutation({
    onSuccess: () => {
      toast.success('OAuth приложение успешно создано!');
      router.push('/');
    },
    onError: (error) => {
      toast.error('Ошибка при создании приложения: ' + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validRedirectUris = redirectUris.filter(uri => uri.trim());
    if (validRedirectUris.length === 0) {
      toast.error('Необходим хотя бы один redirect URI');
      return;
    }

    createMutation.mutate({
      name,
      description: description || undefined,
      redirectUris: validRedirectUris,
      scopes,
    });
  };

  const addRedirectUri = () => {
    setRedirectUris([...redirectUris, '']);
  };

  const removeRedirectUri = (index: number) => {
    if (redirectUris.length > 1) {
      setRedirectUris(redirectUris.filter((_, i) => i !== index));
    }
  };

  const updateRedirectUri = (index: number, value: string) => {
    const newUris = [...redirectUris];
    newUris[index] = value;
    setRedirectUris(newUris);
  };

  const toggleScope = (scope: string) => {
    if (scopes.includes(scope)) {
      setScopes(scopes.filter(s => s !== scope));
    } else {
      setScopes([...scopes, scope]);
    }
  };

  const availableScopes = [
    { id: 'read', name: 'Read', description: 'Базовое чтение данных пользователя', icon: '👁️' },
    { id: 'profile', name: 'Profile', description: 'Доступ к полному профилю пользователя', icon: '👤' },
    { id: 'email', name: 'Email', description: 'Доступ к email адресу', icon: '📧' },
    { id: 'misis_data', name: 'MISIS Data', description: 'Доступ к данным MISIS (группа, факультет и т.д.)', icon: '🎓' },
  ];

  return (
    <div className="min-h-screen bg-background">
        <Header />
        
        <div className="flex">
          <Sidebar />
          
          <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/oauth/applications">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Назад
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Создать OAuth приложение
                </h1>
                <p className="text-muted-foreground">
                  Создайте новое OAuth приложение для интеграции с MISIS Auth
                </p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Настройки приложения</CardTitle>
                <CardDescription>
                  Заполните информацию о вашем OAuth приложении
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Название приложения *</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Мое приложение"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Описание</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Описание вашего приложения"
                        rows={3}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Redirect URIs */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Redirect URIs *</Label>
                      <p className="text-sm text-muted-foreground">
                        URL, на который будет перенаправлен пользователь после авторизации
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      {redirectUris.map((uri, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            type="url"
                            value={uri}
                            onChange={(e) => updateRedirectUri(index, e.target.value)}
                            placeholder="https://example.com/callback"
                            className="flex-1"
                          />
                          {redirectUris.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeRedirectUri(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addRedirectUri}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Добавить URI
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Scopes */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Разрешения (Scopes)</Label>
                      <p className="text-sm text-muted-foreground">
                        Выберите разрешения, которые будет запрашивать ваше приложение
                      </p>
                    </div>
                    
                    <div className="grid gap-3">
                      {availableScopes.map((scope) => {
                        const isSelected = scopes.includes(scope.id);
                        return (
                          <div
                            key={scope.id}
                            className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                              isSelected 
                                ? 'border-primary bg-primary/5' 
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => toggleScope(scope.id)}
                          >
                            <div className={`flex items-center justify-center w-5 h-5 rounded border-2 mt-0.5 ${
                              isSelected 
                                ? 'border-primary bg-primary text-primary-foreground' 
                                : 'border-muted-foreground'
                            }`}>
                              {isSelected && <Check className="h-3 w-3" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{scope.icon}</span>
                                <div className="font-medium">{scope.name}</div>
                                {isSelected && (
                                  <Badge variant="secondary" className="text-xs">
                                    Выбрано
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {scope.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Separator />

                  {/* Actions */}
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" asChild>
                      <Link href="/">Отмена</Link>
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createMutation.isPending}
                    >
                      {createMutation.isPending ? 'Создание...' : 'Создать приложение'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
