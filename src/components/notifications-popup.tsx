'use client';

import { useState } from 'react';
import { Bell, X, Check, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DevelopmentRibbon } from '@/components/ui/development-ribbon';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  time: string;
  unread: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Новое OAuth приложение',
    message: 'Приложение "Test App" было успешно создано',
    type: 'info',
    time: '2 мин назад',
    unread: true,
  },
  {
    id: '2',
    title: 'Авторизация успешна',
    message: 'Вы успешно вошли в систему',
    type: 'success',
    time: '1 час назад',
    unread: true,
  },
  {
    id: '3',
    title: 'Обновление данных',
    message: 'Данные профиля были обновлены из MISIS',
    type: 'warning',
    time: '3 часа назад',
    unread: true,
  },
  {
    id: '4',
    title: 'Система работает',
    message: 'Все сервисы функционируют нормально',
    type: 'success',
    time: '1 день назад',
    unread: false,
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'info':
      return <Info className="h-4 w-4 text-blue-600" />;
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'warning':
      return <AlertCircle className="h-4 w-4 text-orange-600" />;
    default:
      return <Info className="h-4 w-4 text-blue-600" />;
  }
};

const getBgColor = (type: string) => {
  switch (type) {
    case 'info':
      return 'bg-blue-100';
    case 'success':
      return 'bg-green-100';
    case 'warning':
      return 'bg-orange-100';
    default:
      return 'bg-blue-100';
  }
};

export function NotificationsPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, unread: false } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, unread: false }))
    );
  };

  return (
    <div className="relative">
      {/* Кнопка уведомлений */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      {/* Всплывающее окно */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Popup */}
          <div className="absolute right-0 top-12 z-50 w-80 max-h-96 overflow-hidden">
            <div className="bg-background border rounded-lg shadow-lg mx-2">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-semibold">Уведомления</h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={markAllAsRead}
                        className="text-xs"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Все
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-48 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      Нет уведомлений
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0 ${
                            notification.unread ? 'bg-muted/30' : ''
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`flex-shrink-0 w-6 h-6 rounded-full ${getBgColor(notification.type)} flex items-center justify-center`}>
                              {getIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium truncate">
                                  {notification.title}
                                </h4>
                                {notification.unread && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t bg-muted/30 -mb-1">
                  <DevelopmentRibbon variant="development">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs"
                      onClick={() => setIsOpen(false)}
                    >
                      Посмотреть все уведомления
                    </Button>
                  </DevelopmentRibbon>
                </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
