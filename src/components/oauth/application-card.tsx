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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 hover:shadow-md transition-all duration-300 gap-4 group">
      <div className="flex items-center gap-4 flex-1 min-w-0 w-full sm:w-auto">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
            <Key className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h3 className="font-medium truncate">{application.name}</h3>
            <Badge variant={application.isActive ? "default" : "secondary"} className="w-fit">
              {application.isActive ? 'Активно' : 'Неактивно'}
            </Badge>
          </div>
          {application.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {application.description}
            </p>
          )}
          <div className="mt-2 text-xs text-muted-foreground font-mono break-all">
            Client ID: {application.clientId}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 w-full sm:w-auto">
        {onToggleActive && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onToggleActive(application.id, application.isActive)}
            disabled={isUpdating}
            className="flex-1 sm:flex-none"
          >
            {application.isActive ? 'Деактивировать' : 'Активировать'}
          </Button>
        )}
        <Button variant="outline" size="sm" asChild>
          <Link href={`/oauth/applications/${application.id}`}>
            <ExternalLink className="h-4 w-4" />
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
