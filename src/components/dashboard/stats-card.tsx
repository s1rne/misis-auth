import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { memo } from "react"

interface StatsCardProps {
  title: string
  value: string | number
  description: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
}

export const StatsCard = memo(function StatsCard({ title, value, description, icon: Icon, trend }: StatsCardProps) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold group-hover:text-primary transition-colors duration-300">
          {value}
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
          {trend && (
            <span className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
})
