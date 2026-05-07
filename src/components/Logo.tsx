import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "gradient" | "white";
}

export function Logo({ className, size = "md", variant = "gradient" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  }

  const variantClasses = {
    gradient: "bg-gradient-to-br from-purple-600 to-orange-500 text-white",
    white: "bg-white/20 backdrop-blur text-white",
  }

  return (
    <div className={cn(
      "rounded-xl flex items-center justify-center font-bold shadow-lg shrink-0",
      sizeClasses[size],
      variantClasses[variant],
      className
    )}>
      BM
    </div>
  )
}
