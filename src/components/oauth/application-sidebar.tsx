import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { DevelopmentRibbon } from "@/components/ui/development-ribbon"
import { Calendar, Globe, Key, ExternalLink } from "lucide-react"
import Link from "next/link"

interface Application {
  id: string
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface ApplicationSidebarProps {
  application: Application
  onToggleActive: () => void
  onDelete: () => void
  isUpdating: boolean
  isDeleting: boolean
}

export function ApplicationSidebar({ 
  application, 
  onToggleActive, 
  onDelete, 
  isUpdating, 
  isDeleting 
}: ApplicationSidebarProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Управление</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={onToggleActive}
            disabled={isUpdating}
            variant={application.isActive ? "destructive" : "default"}
            className="w-full"
          >
            {isUpdating 
              ? 'Обновление...' 
              : application.isActive 
                ? 'Деактивировать' 
                : 'Активировать'
            }
          </Button>

          <DeleteConfirmationDialog
            title="Удалить приложение"
            description={`Вы уверены, что хотите удалить приложение "${application.name}"? Это действие нельзя отменить. Все связанные токены доступа будут аннулированы.`}
            onConfirm={onDelete}
            triggerText="Удалить приложение"
            isPending={isDeleting}
            className="w-full"
          />
        </CardContent>
      </Card>

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
  )
}
