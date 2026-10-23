import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "whatsapp" | "inverse" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 [&_svg]:shrink-0";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-dark",
  secondary: "border-2 border-ink bg-white text-ink hover:bg-ink hover:text-white",
  whatsapp: "bg-wa text-white hover:bg-wa-dark",
  inverse: "bg-white text-brand hover:bg-brand-tint",
  ghost: "text-ink underline-offset-4 hover:underline",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-6 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}

interface LinkButtonProps extends Omit<ComponentProps<typeof Link>, "className"> {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function LinkButton({ variant, size, className, ...props }: LinkButtonProps) {
  return <Link className={buttonClasses(variant, size, className)} {...props} />;
}

interface ExternalButtonProps extends Omit<ComponentProps<"a">, "className"> {
  variant?: Variant;
  size?: Size;
  className?: string;
}

/** For tel:, mailto:, wa.me and map links. */
export function ExternalButton({ variant, size, className, ...props }: ExternalButtonProps) {
  const isWeb = props.href?.startsWith("http");
  return (
    <a
      className={buttonClasses(variant, size, className)}
      {...(isWeb ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    />
  );
}
