import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        pending: "bg-orange-100 text-orange-800",
        confirmed: "bg-blue-100 text-blue-800",
        preparing: "bg-purple-100 text-purple-800",
        ready: "bg-green-100 text-green-800",
        delivered: "bg-gray-100 text-gray-800",
        cancelled: "bg-red-100 text-red-800",
        new: "bg-pink-100 text-pink-800",
        popular: "bg-yellow-100 text-yellow-800",
        default: "bg-gray-100 text-gray-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
