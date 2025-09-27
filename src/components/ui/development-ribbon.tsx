import { cn } from "@/lib/utils"

interface DevelopmentRibbonProps {
  children: React.ReactNode
  text?: string
  variant?: 'development' | 'partial' | 'comingSoon'
  className?: string
}

const variants = {
  development: "bg-gradient-to-r from-orange-500 to-red-500",
  partial: "bg-gradient-to-r from-blue-500 to-purple-500", 
  comingSoon: "bg-gradient-to-r from-green-500 to-teal-500"
}

const defaultTexts = {
  development: "В РАЗРАБОТКЕ",
  partial: "ЧАСТИЧНО",
  comingSoon: "СКОРО"
}

export function DevelopmentRibbon({ 
  children, 
  text, 
  variant = 'development',
  className 
}: DevelopmentRibbonProps) {
  const ribbonText = text || defaultTexts[variant]
  const ribbonClasses = variants[variant]

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Лента */}
      <div className={cn(
        "absolute top-4 -right-10 text-white text-xs font-bold px-8 py-1 transform rotate-40 shadow-lg z-20 pointer-events-none",
        ribbonClasses
      )}>
        {ribbonText}
      </div>
      
      {/* Затемнение для блокировки hover */}
      <div className="absolute inset-0 z-10 backdrop-blur-[1.2px]" />
      
      {/* Контент */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  )
}
