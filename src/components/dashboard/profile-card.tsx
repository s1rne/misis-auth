import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { LoadingCard } from "@/components/skeletons/loading-spinner"
import { memo } from "react"

interface ProfileData {
  fullName?: string
  group?: string
  faculty?: string
  email?: string
}

interface ProfileCardProps {
  userName?: string
  userEmail?: string
  profile?: {
    misisData?: ProfileData
    email?: string
  }
  isLoading?: boolean
}

export const ProfileCard = memo(function ProfileCard({ userName, userEmail, profile, isLoading }: ProfileCardProps) {
  if (isLoading) {
    return <LoadingCard />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt={userName || ''} />
            <AvatarFallback>
              {userName?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          Профиль
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile?.misisData ? (
          <>
            <div className="space-y-2">
              <div className="text-sm font-medium">Имя</div>
              <div className="text-sm text-muted-foreground">
                {profile.misisData.fullName}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Группа</div>
              <div className="text-sm text-muted-foreground">
                {profile.misisData.group}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Факультет</div>
              <div className="text-sm text-muted-foreground">
                {profile.misisData.faculty}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Email</div>
              <div className="text-sm text-muted-foreground">
                {profile.email}
              </div>
            </div>
          </>
        ) : (
          <div className="text-sm text-muted-foreground">
            Загрузка данных профиля...
          </div>
        )}
      </CardContent>
    </Card>
  )
})
