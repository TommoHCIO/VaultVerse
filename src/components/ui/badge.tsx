import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = {
  variant: {
    default: "bg-primary text-white hover:bg-primary/80",
    secondary: "bg-background-secondary text-foreground hover:bg-background-tertiary",
    success: "bg-success text-white",
    warning: "bg-warning text-white",
    danger: "bg-danger text-white",
    outline: "text-foreground border border-border",
    market: "bg-market-neutral text-white",
    "market-up": "bg-market-up text-white",
    "market-down": "bg-market-down text-white",
    shield: "bg-shield-gold text-black",
    "event-live": "bg-event-live text-white animate-pulse",
    "event-upcoming": "bg-event-upcoming text-white",
    "event-completed": "bg-event-completed text-white",
  },
  size: {
    default: "px-2.5 py-0.5 text-xs",
    sm: "px-2 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm",
  },
} as const;

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof badgeVariants.variant;
  size?: keyof typeof badgeVariants.size;
}

function Badge({ className, variant = "default", size = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        badgeVariants.variant[variant],
        badgeVariants.size[size],
        className
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };