'use client';

import { Button } from '@/components/ui/button';
import { Plus, Lock } from 'lucide-react';
import Link from 'next/link';
import { trpc } from '@/lib/trpc-client';

interface CreateApplicationButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
}

export function CreateApplicationButton({
  variant = 'default',
  size = 'default',
  className,
  children,
  showIcon = true,
}: CreateApplicationButtonProps) {
  const { data: applications } = trpc.oauth.getMyApplications.useQuery();
  const { data: userSettings } = trpc.oauth.getUserSettings.useQuery();

  const isLimitReached = userSettings && applications && applications.length >= userSettings.maxApplications;
  const defaultText = children || 'Создать приложение';

  if (isLimitReached) {
    return (
      <Button 
        className={className}
        disabled
        title={`Достигнут лимит приложений (${userSettings.maxApplications}). Удалите неиспользуемые приложения или обратитесь к администратору.`}
        variant={variant}
        size={size}
      >
        {showIcon && <Lock className="mr-2 h-4 w-4" />}
        Лимит достигнут
      </Button>
    );
  }

  return (
    <Button asChild className={className} variant={variant} size={size}>
      <Link href="/oauth/applications/new">
        {showIcon && <Plus className="mr-2 h-4 w-4" />}
        {defaultText}
      </Link>
    </Button>
  );
}
