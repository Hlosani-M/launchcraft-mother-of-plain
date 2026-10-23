import type { Availability, PriceUnit, Product } from "@/types/catalogue";
import type { TimeRange } from "@/types/site";

const randFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** "R1 250.00": South African retail style, space-grouped with a decimal point. */
export function formatRand(amount: number) {
  return `R${randFormatter.format(amount).replace(/,/g, "\u00a0")}`;
}

export const priceUnitLabel: Record<PriceUnit, string> = {
  each: "each",
  kg: "/ kg",
  pack: "/ pack",
  box: "/ box",
  hamper: "/ hamper",
};

/** Short unit for compact contexts, e.g. "R89.99/kg". */
export function formatUnitPrice(product: Pick<Product, "price" | "priceUnit">) {
  const unit = product.priceUnit === "each" ? " each" : `/${product.priceUnit}`;
  return `${formatRand(product.price)}${unit}`;
}

export function isVariableWeight(product: Pick<Product, "priceUnit">) {
  return product.priceUnit === "kg";
}

/** The pack/weight line shown under product names. */
export function packLabel(product: Pick<Product, "packSize" | "weightLabel">) {
  return product.packSize ?? product.weightLabel ?? "";
}

export const availabilityLabel: Record<Availability, string> = {
  "in-stock": "In stock",
  "low-stock": "Limited availability",
  backorder: "Back order",
  "sold-out": "Sold out",
};

export function formatTimeRanges(ranges: TimeRange[]) {
  return ranges.map((r) => `${r.open}–${r.close}`).join(" / ");
}

const shortDate = new Intl.DateTimeFormat("en-ZA", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

/** "31 Oct" from an ISO date. */
export function formatShortDate(isoDate: string) {
  return shortDate.format(new Date(`${isoDate}T00:00:00Z`));
}

export function specialValidityLabel(product: Pick<Product, "specialValidFrom" | "specialValidTo">) {
  if (product.specialValidTo) return `Valid until ${formatShortDate(product.specialValidTo)}`;
  if (product.specialValidFrom) return `From ${formatShortDate(product.specialValidFrom)}`;
  return null;
}
