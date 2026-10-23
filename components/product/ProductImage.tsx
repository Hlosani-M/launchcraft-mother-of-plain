import Image from "next/image";
import type { Product } from "@/types/catalogue";
import { CategoryIcon } from "@/components/product/CategoryIcon";

/**
 * Product photography slot. Products without a photo get a branded placeholder
 * instead of stock imagery that might misrepresent a cut.
 */
export function ProductImage({
  product,
  sizes,
  priority = false,
  large = false,
}: {
  product: Pick<Product, "name" | "category" | "image">;
  sizes: string;
  priority?: boolean;
  large?: boolean;
}) {
  if (product.image) {
    const contain = product.image.fit !== "cover";
    return (
      <div className={`absolute inset-0 bg-white ${contain ? (large ? "p-6 sm:p-10" : "p-3 sm:p-4") : ""}`}>
        <div className="relative h-full w-full">
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            sizes={sizes}
            priority={priority}
            className={`${contain ? "object-contain" : "object-cover"} transition-transform duration-300 motion-safe:group-hover:scale-[1.03]`}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface text-brand"
      role="img"
      aria-label={`${product.name}: photo coming soon`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.06] [background-image:repeating-linear-gradient(135deg,currentColor_0_2px,transparent_2px_14px)]"
      />
      <span
        className={`relative flex items-center justify-center rounded-full bg-white shadow-[0_0_0_1px_var(--color-line)] ${large ? "size-28" : "size-16 sm:size-20"}`}
      >
        <CategoryIcon category={product.category} className={large ? "size-14" : "size-8 sm:size-10"} />
      </span>
      {large && (
        <span className="relative text-xs font-semibold tracking-wide text-muted uppercase">
          Product photo coming soon
        </span>
      )}
    </div>
  );
}

/** Small square thumbnail for lists (hero specials, search, basket). */
export function ProductThumb({
  product,
  className = "size-12",
}: {
  product: Pick<Product, "category" | "image">;
  className?: string;
}) {
  return (
    <span
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-md ${product.image ? "bg-white ring-1 ring-line" : "bg-brand-tint text-brand"} ${className}`}
    >
      {product.image ? (
        <Image
          src={product.image.src}
          alt=""
          fill
          sizes="80px"
          className={product.image.fit === "cover" ? "object-cover" : "object-contain p-1"}
        />
      ) : (
        <CategoryIcon category={product.category} className="size-1/2" />
      )}
    </span>
  );
}
