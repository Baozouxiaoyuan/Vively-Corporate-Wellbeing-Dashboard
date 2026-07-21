import { ComponentProps } from "react";
import { cn } from "../../lib/utils";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-6 rounded-2xl border border-neutral-200 bg-white py-6 shadow-sm", className)} data-slot="card" {...props} />;
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5 px-6", className)} data-slot="card-header" {...props} />;
}

export function CardTitle({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("font-semibold leading-none", className)} data-slot="card-title" {...props} />;
}

export function CardDescription({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("text-sm text-neutral-500", className)} data-slot="card-description" {...props} />;
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("px-6", className)} data-slot="card-content" {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex items-center px-6", className)} data-slot="card-footer" {...props} />;
}
