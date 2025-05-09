import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
  href?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = "default", size = "default", href, asChild, ...props }, ref) => {
    // Remove asChild from props to prevent it from being passed to DOM elements

    if (href) {
      return (
        <a
          href={href}
          className={cn(
            "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            variant === "default" &&
              "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary/80 dark:text-primary-foreground dark:hover:bg-primary/70",
            variant === "destructive" &&
              "bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:bg-destructive/80 dark:hover:bg-destructive/70",
            variant === "outline" &&
              "border border-input bg-background hover:bg-accent hover:text-accent-foreground dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-100",
            variant === "secondary" &&
              "bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-secondary/20 dark:text-secondary-foreground dark:hover:bg-secondary/30",
            variant === "ghost" &&
              "hover:bg-accent hover:text-accent-foreground dark:hover:bg-slate-800 dark:hover:text-slate-100",
            size === "default" && "h-10 px-4 py-2",
            size === "sm" && "h-9 rounded-md px-3",
            size === "lg" && "h-11 rounded-md px-8",
            size === "icon" && "h-10 w-10",
            className,
          )}
        >
          {children}
        </a>
      )
    }

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          variant === "default" &&
            "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary/80 dark:text-primary-foreground dark:hover:bg-primary/70",
          variant === "destructive" &&
            "bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:bg-destructive/80 dark:hover:bg-destructive/70",
          variant === "outline" &&
            "border border-input bg-background hover:bg-accent hover:text-accent-foreground dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-100",
          variant === "secondary" &&
            "bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-secondary/20 dark:text-secondary-foreground dark:hover:bg-secondary/30",
          variant === "ghost" &&
            "hover:bg-accent hover:text-accent-foreground dark:hover:bg-slate-800 dark:hover:text-slate-100",
          size === "default" && "h-10 px-4 py-2",
          size === "sm" && "h-9 rounded-md px-3",
          size === "lg" && "h-11 rounded-md px-8",
          size === "icon" && "h-10 w-10",
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  },
)
Button.displayName = "Button"

export { Button }
