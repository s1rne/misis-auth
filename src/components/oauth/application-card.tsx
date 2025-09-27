import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreateApplicationButton } from "@/components/create-application-button"
import { Key, ExternalLink } from "lucide-react"
import Link from "next/link"
import { ApplicationCardSkeleton } from "@/components/skeletons/card-skeleton"
import { LoadingCard } from "@/components/skeletons/loading-spinner"
import { memo } from "react"

interface Application {
  id: string
  name: string
  description?: string
  clientId: string
  isActive: boolean
}

interface ApplicationCardProps {
  application: Application
  onToggleActive?: (appId: string, currentStatus: boolean) => void
  isUpdating?: boolean
}

export const ApplicationCard = memo(function ApplicationCard({ application, onToggleActive, isUpdating }: ApplicationCardProps) {
  return (
    <div className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
      {/* Заголовок с названием и статусом */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Key className="h-4 w-4 text-primary flex-shrink-0" />
          <h3 className="font-medium truncate">{application.name}</h3>
        </div>
        <Badge variant={application.isActive ? "default" : "secondary"} className="text-xs">
          {application.isActive ? 'Активно' : 'Неактивно'}
        </Badge>
      </div>
      
      {/* Описание */}
      {application.description && (
        <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
          {application.description}
        </p>
      )}
      
      {/* Client ID */}
      <div className="text-xs text-muted-foreground font-mono truncate mb-3">
        {application.clientId}
      </div>
      
      {/* Кнопки */}
      <div className="flex gap-2">
        {onToggleActive && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onToggleActive(application.id, application.isActive)}
            disabled={isUpdating}
            className="flex-1 sm:flex-none text-xs sm:text-sm"
          >
            {application.isActive ? 'Деактивировать' : 'Активировать'}
          </Button>
        )}
        <Button variant="outline" size="sm" asChild className="px-3">
          <Link href={`/oauth/applications/${application.id}`}>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </Button>
      </div>
    </div>
  )
})

interface ApplicationsListProps {
  applications?: Application[]
  isLoading: boolean
  onToggleActive?: (appId: string, currentStatus: boolean) => void
  isUpdating?: boolean
}

export const ApplicationsList = memo(function ApplicationsList({ applications, isLoading, onToggleActive, isUpdating }: ApplicationsListProps) {
  if (isLoading) {
    return <LoadingCard />
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
    )
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <ApplicationCard
          key={app.id}
          application={app}
          onToggleActive={onToggleActive}
          isUpdating={isUpdating}
        />
      ))}
    </div>
  )
})
