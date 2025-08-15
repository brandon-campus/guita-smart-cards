import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const progressVariants = cva(
  "relative h-2 w-full overflow-hidden rounded-full",
  {
    variants: {
      variant: {
        default: "bg-muted",
        success: "bg-muted",
        warning: "bg-muted", 
        danger: "bg-muted",
        credit: "bg-border"
      },
      size: {
        sm: "h-1",
        default: "h-2",
        lg: "h-3"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

const progressIndicatorVariants = cva(
  "h-full w-full flex-1 transition-all duration-700 ease-out",
  {
    variants: {
      variant: {
        default: "bg-primary",
        success: "gradient-success",
        warning: "bg-warning",
        danger: "gradient-danger", 
        credit: "gradient-primary"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants>,
    VariantProps<typeof progressIndicatorVariants> {
  value?: number
  animated?: boolean
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, variant, size, value, animated = false, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(progressVariants({ variant, size }), className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        progressIndicatorVariants({ variant }),
        animated && "progress-animated"
      )}
      style={{ 
        transform: `translateX(-${100 - (value || 0)}%)`,
        "--progress-value": `${value || 0}%`
      } as React.CSSProperties}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress, progressVariants }
