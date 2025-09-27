'use client';

import { useParams, useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc-client';
import { PageHeader } from '@/components/layout/page-header';
import { ApplicationDetails } from '@/components/oauth/application-details';
import { ApplicationSidebar } from '@/components/oauth/application-sidebar';
import { Badge } from '@/components/ui/badge';
import { LoadingPage } from '@/components/skeletons/loading-spinner';
import { toast } from 'sonner';

export default function ApplicationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  
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

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!application) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Приложение не найдено</h1>
        <p className="text-muted-foreground mt-2">
          Приложение с указанным ID не существует или у вас нет доступа к нему.
        </p>
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
    <>
      <PageHeader
        title={application.name}
        description={application.description}
        backHref="/oauth/applications"
        backLabel="Назад к приложениям"
      >
        <Badge variant={application.isActive ? "default" : "secondary"}>
          {application.isActive ? 'Активно' : 'Неактивно'}
        </Badge>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Application Details */}
        <div className="lg:col-span-2">
          <ApplicationDetails application={application} />
        </div>

        {/* Sidebar */}
        <div>
          <ApplicationSidebar
            application={application}
            onToggleActive={handleToggleActive}
            onDelete={handleDelete}
            isUpdating={updateMutation.isPending}
            isDeleting={deleteMutation.isPending}
          />
        </div>
      </div>
    </>
  );
}
