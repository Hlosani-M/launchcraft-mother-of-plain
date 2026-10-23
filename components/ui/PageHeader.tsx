import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export interface Crumb {
  href?: string;
  label: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="size-3.5" aria-hidden="true" />}
            {item.href ? (
              <Link href={item.href} className="inline-flex min-h-8 items-center hover:text-brand hover:underline">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-ink">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  crumbs,
  tone = "light",
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  crumbs?: Crumb[];
  tone?: "light" | "brand";
  children?: ReactNode;
}) {
  const brand = tone === "brand";
  return (
    <div className={brand ? "bg-brand text-white" : "border-b border-line bg-surface"}>
      <div className="container-page py-8 sm:py-12">
        {crumbs && (
          <div className={`mb-3 ${brand ? "[&_a]:text-white/85 [&_li]:text-white/85 [&_span]:text-white" : ""}`}>
            <Breadcrumbs items={crumbs} />
          </div>
        )}
        {eyebrow && (
          <p className={`mb-1 text-xs font-bold tracking-[0.18em] uppercase ${brand ? "text-white/85" : "text-brand"}`}>
            {eyebrow}
          </p>
        )}
        <h1 className="text-[2.6rem] leading-[0.9] font-extrabold uppercase sm:text-6xl lg:text-7xl">{title}</h1>
        {description && (
          <p className={`mt-3 max-w-2xl text-lg ${brand ? "text-white/95" : "text-muted"}`}>{description}</p>
        )}
        {children}
      </div>
    </div>
  );
}
