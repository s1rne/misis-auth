import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Shield, Users } from "lucide-react"
import Link from "next/link"

interface SigninCardProps {
  onSignIn: () => void
}

export function SigninCard({ onSignIn }: SigninCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">MISIS Auth</CardTitle>
        <CardDescription>
          OAuth сервер для авторизации через MISIS
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={onSignIn} 
          className="w-full"
          size="lg"
        >
          <Users className="mr-2 h-4 w-4" />
          Войти через MISIS
        </Button>
        
        <Separator />
        
        <div className="text-center text-sm text-muted-foreground">
          <p>Для разработчиков:</p>
          <Link 
            href="/docs" 
            className="text-primary hover:text-primary/80 underline"
          >
            Документация API
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
