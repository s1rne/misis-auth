"use client"

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Plus, 
  Settings, 
  Key, 
  Users,
  FileText
} from 'lucide-react';

const navigation = [
  {
    name: 'Обзор',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'OAuth Приложения',
    href: '/oauth/applications',
    icon: Key,
  },
  {
    name: 'Создать приложение',
    href: '/oauth/applications/new',
    icon: Plus,
  },
  {
    name: 'Документация',
    href: '/docs',
    icon: FileText,
  },
  {
    name: 'Настройки',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col sticky top-16 h-[calc(100vh-4rem)]">
      <div className="flex flex-col flex-grow pt-5 bg-card border-r overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <h2 className="text-lg font-semibold text-foreground">Панель управления</h2>
        </div>
        <div className="mt-5 flex-grow flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start text-sm",
                      isActive && "bg-secondary text-secondary-foreground"
                    )}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
