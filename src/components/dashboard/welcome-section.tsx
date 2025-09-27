interface WelcomeSectionProps {
  userName?: string
  profileName?: string
}

export function WelcomeSection({ userName, profileName }: WelcomeSectionProps) {
  const displayName = profileName || userName || "Пользователь"
  
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold tracking-tight">
        Добро пожаловать, {displayName}!
      </h1>
      <p className="text-muted-foreground">
        Управляйте вашими OAuth приложениями и настройками авторизации
      </p>
    </div>
  )
}
