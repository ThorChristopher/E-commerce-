import { Gamepad2 } from "lucide-react"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  }

  const iconSizes = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="relative">
        <Gamepad2 className={`${iconSizes[size]} text-blue-600`} />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
      </div>
      <div className="flex flex-col leading-none">
        <span className={`${sizeClasses[size]} font-bold text-gray-900 tracking-tight`}>THORP</span>
        <span
          className={`${size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"} font-semibold text-blue-600 tracking-wider -mt-1`}
        >
          CHRISTOPHER
        </span>
      </div>
    </div>
  )
}
