import { Check, Clock, AlertTriangle, XCircle } from "lucide-react";
import type { Availability, Product } from "@/types/catalogue";
import { availabilityLabel } from "@/lib/format";

const availabilityStyles: Record<Availability, { className: string; Icon: typeof Check }> = {
  "in-stock": { className: "text-success", Icon: Check },
  "low-stock": { className: "text-warning", Icon: AlertTriangle },
  backorder: { className: "text-ink", Icon: Clock },
  "sold-out": { className: "text-muted", Icon: XCircle },
};

/** Text + icon, never colour alone. */
export function AvailabilityBadge({
  availability,
  className = "",
}: {
  availability: Availability;
  className?: string;
}) {
  const { className: tone, Icon } = availabilityStyles[availability];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${tone} ${className}`}>
      <Icon className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
      {availabilityLabel[availability]}
    </span>
  );
}

/** One corner badge per product, chosen by priority. */
export function ProductBadge({ product }: { product: Product }) {
  let label: string | null = null;
  let tone = "bg-brand text-white";

  if (product.availability === "sold-out") {
    label = "Sold out";
    tone = "bg-ink text-white";
  } else if (product.availability === "backorder") {
    label = "Back order";
    tone = "bg-ink text-white";
  } else if (product.isSpecial) {
    label = "Special";
  } else if (product.availability === "low-stock") {
    label = "Limited";
    tone = "bg-warning-tint text-warning";
  } else if (product.badge === "family-value") {
    label = "Family value";
    tone = "bg-white text-brand ring-1 ring-brand";
  }

  if (!label) return null;
  return (
    <span
      className={`inline-flex items-center rounded-sm px-2 py-1 text-[0.7rem] leading-none font-bold tracking-wide uppercase ${tone}`}
    >
      {label}
    </span>
  );
}
