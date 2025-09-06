import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const buttonVariants = {
  variant: {
    default: "gradient-primary text-white hover:opacity-90",
    secondary: "bg-background-secondary text-foreground hover:bg-background-tertiary border border-border",
    success: "gradient-success text-white hover:opacity-90",
    danger: "bg-danger text-white hover:bg-opacity-90",
    outline: "border border-border bg-transparent hover:bg-background-secondary",
    ghost: "hover:bg-background-secondary",
    link: "text-primary underline-offset-4 hover:underline",
    arena: "gradient-primary text-white arena-glow hover:opacity-90 transform hover:scale-105 transition-all duration-300",
    shield: "bg-shield-gold text-black shield-glow hover:opacity-90",
  },
  size: {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3 text-sm",
    lg: "h-11 rounded-md px-8",
    xl: "h-14 rounded-lg px-10 text-lg",
    icon: "h-10 w-10",
  },
} as const;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };