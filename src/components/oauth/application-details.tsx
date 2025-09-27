import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Key, Copy, Eye, EyeOff, AlertTriangle, Code } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface Application {
  id: string
  name: string
  description?: string
  clientId: string
  clientSecret: string
  redirectUris: string[]
  scopes: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface ApplicationDetailsProps {
  application: Application
}

export function ApplicationDetails({ application }: ApplicationDetailsProps) {
  const [showSecret, setShowSecret] = useState(false)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} скопирован в буфер обмена`)
  }

  const authUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/api/oauth/authorize?client_id=${application.clientId}&redirect_uri=${encodeURIComponent(application.redirectUris[0])}&response_type=code&scope=${application.scopes.join(' ')}&state=random_state`
    : ''

  const tokenRequest = `POST /api/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
client_id=${application.clientId}
client_secret=${application.clientSecret}
code=authorization_code
redirect_uri=${application.redirectUris[0]}`

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Информация о приложении
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Client ID</Label>
            <div className="flex gap-2">
              <Input
                value={application.clientId}
                readOnly
                className="font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(application.clientId, 'Client ID')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Client Secret</Label>
            <div className="flex gap-2">
              <Input
                type={showSecret ? "text" : "password"}
                value={showSecret ? application.clientSecret : "••••••••••••••••"}
                readOnly
                className="font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowSecret(!showSecret)}
              >
                {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(application.clientSecret, 'Client Secret')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Никогда не делитесь Client Secret с другими
              </AlertDescription>
            </Alert>
          </div>

          <div className="space-y-2">
            <Label>Redirect URIs</Label>
            <div className="space-y-2">
              {application.redirectUris.map((uri: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={uri}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(uri, 'Redirect URI')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Scopes</Label>
            <div className="flex flex-wrap gap-2">
              {application.scopes.map((scope: string) => (
                <Badge key={scope} variant="outline">
                  {scope}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Пример интеграции
          </CardTitle>
          <CardDescription>
            Как использовать это приложение в вашем коде
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>1. Authorization URL</Label>
            <div className="relative">
              <pre className="bg-muted p-4 pr-12 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap break-all">
                <code>{authUrl}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 h-8 w-8 p-0"
                onClick={() => copyToClipboard(authUrl, 'Authorization URL')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>2. Exchange Code for Token</Label>
            <div className="relative">
              <pre className="bg-muted p-4 pr-12 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap break-all">
                <code>{tokenRequest}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 h-8 w-8 p-0"
                onClick={() => copyToClipboard(tokenRequest, 'Token Request')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>3. Use Access Token</Label>
            <div className="relative">
              <pre className="bg-muted p-4 pr-12 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap break-all">
                <code>{`GET /api/v1/user
Authorization: Bearer access_token`}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 h-8 w-8 p-0"
                onClick={() => copyToClipboard('GET /api/v1/user\nAuthorization: Bearer access_token', 'API Request')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
