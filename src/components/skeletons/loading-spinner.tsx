import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  }

  return (
    <div className={cn("animate-spin rounded-full border-b-2 border-primary", sizeClasses[size], className)} />
  )
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    </div>
  )
}

export function LoadingCard() {
  return (
    <div className="text-center py-8">
      <LoadingSpinner size="md" className="mx-auto" />
      <p className="mt-2 text-sm text-muted-foreground">Загрузка...</p>
    </div>
  )
}
