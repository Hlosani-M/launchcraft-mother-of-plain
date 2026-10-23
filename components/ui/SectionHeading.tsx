import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  id,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: { href: string; label: string };
  id?: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-1 text-xs font-bold tracking-[0.18em] text-brand uppercase">{eyebrow}</p>
        )}
        <h2 id={id} className="text-[2rem] leading-[0.95] font-extrabold uppercase sm:text-5xl">
          {title}
        </h2>
        {description && <p className="mt-3 text-muted sm:text-lg">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 font-semibold text-ink underline decoration-brand decoration-2 underline-offset-4 hover:text-brand"
        >
          {action.label}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
