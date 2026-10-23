import type { Product } from "@/types/catalogue";
import { formatRand, priceUnitLabel } from "@/lib/format";

export function ProductPrice({
  product,
  size = "md",
}: {
  product: Pick<Product, "price" | "compareAtPrice" | "priceUnit">;
  size?: "sm" | "md" | "lg";
}) {
  const priceSize = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl sm:text-5xl",
  }[size];

  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
      <span className={`font-display font-extrabold leading-none ${priceSize} ${onSale ? "text-brand" : "text-ink"}`}>
        {formatRand(product.price)}
      </span>
      <span className={`font-semibold text-muted ${size === "lg" ? "text-base" : "text-xs sm:text-sm"}`}>
        {priceUnitLabel[product.priceUnit]}
      </span>
      {onSale && (
        <span className={`text-muted line-through ${size === "lg" ? "text-base" : "text-xs"}`}>
          <span className="sr-only">Was </span>
          {formatRand(product.compareAtPrice!)}
        </span>
      )}
    </div>
  );
}
