import { ComponentProps } from "react";
import { cn } from "../../lib/utils";

export function Input({ className, type, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-10 w-full min-w-0 rounded-full border border-neutral-300 bg-neutral-50 px-4 py-2 text-base text-neutral-900 shadow-sm outline-none transition placeholder:text-neutral-400 focus-visible:border-neutral-700 focus-visible:ring-2 focus-visible:ring-neutral-900/10 disabled:pointer-events-none disabled:opacity-50 md:text-sm",
        className,
      )}
      data-slot="input"
      type={type}
      {...props}
    />
  );
}
