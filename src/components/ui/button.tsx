import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-heading font-semibold uppercase tracking-wider ring-offset-background transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/92 hover:shadow-[0_4px_16px_hsl(193_100%_42%/0.3)] hover:-translate-y-[2px] active:translate-y-0",
        secondary:
          "bg-transparent border border-foreground/20 text-foreground hover:bg-foreground/10 hover:-translate-y-[1px]",
        ghost:
          "text-muted-foreground hover:text-foreground bg-transparent",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        link:
          "text-primary underline-offset-4 hover:underline normal-case tracking-normal font-body font-medium",
      },
      size: {
        default: "h-12 px-6 text-sm rounded-lg",
        sm: "h-10 px-4 text-xs rounded-md",
        lg: "h-14 px-10 text-sm rounded-lg",
        icon: "h-12 w-12 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
