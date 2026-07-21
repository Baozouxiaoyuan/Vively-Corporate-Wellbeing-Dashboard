import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer place-items-center items-center justify-center gap-2 rounded-full text-sm font-semibold leading-normal tracking-wide whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-orange-500/50 active:scale-95 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-red-500/20 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: "m",
      variant: "primary",
    },
    variants: {
      size: {
        m: "px-2.5 py-2 [&_svg]:size-4 [&_svg]:stroke-[3]",
        s: "px-2.5 py-1.5 [&_svg]:size-3.5",
      },
      variant: {
        danger: "bg-red-400 text-white hover:bg-red-500",
        primary: "bg-[#160E0C] text-white hover:bg-[#2a1c18]",
        secondary: "border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100",
        subtle: "bg-neutral-100 text-dark-green-900 hover:bg-neutral-200",
        tertiary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
        unstyled: "text-neutral-900",
      },
    },
  },
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

function ButtonContent({ children, disabled, loading }: { children: ReactNode; disabled?: boolean; loading?: boolean }) {
  return (
    <>
      <span className={cn("inline-flex items-center gap-[inherit]", loading && "opacity-0")}>{children}</span>
      {loading ? (
        <span className="absolute inset-0 grid place-items-center">
          <Loader2 className="animate-spin" />
        </span>
      ) : null}
      {disabled || loading ? <div className="absolute inset-0 rounded-[inherit] bg-neutral-50/10" /> : null}
    </>
  );
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, disabled, loading = false, size, variant, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ size, variant }), className)} data-slot="button" disabled={loading || disabled} ref={ref} {...props}>
        <ButtonContent disabled={disabled} loading={loading}>
          {children}
        </ButtonContent>
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, ButtonContent, type ButtonProps, buttonVariants };
