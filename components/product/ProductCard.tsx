import Link from "next/link";
import type { Category, Product } from "@/types/catalogue";
import { packLabel, specialValidityLabel } from "@/lib/format";
import { ProductImage } from "@/components/product/ProductImage";
import { ProductPrice } from "@/components/product/ProductPrice";
import { AvailabilityBadge, ProductBadge } from "@/components/product/Badges";
import { ProductAction } from "@/components/commerce/ProductAction";

export function ProductCard({
  product,
  categoryName,
  showValidity = false,
}: {
  product: Product;
  categoryName?: string;
  showValidity?: boolean;
}) {
  const pack = packLabel(product);
  const validity = showValidity && product.isSpecial ? specialValidityLabel(product) : null;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-(--radius-card) border border-line bg-white transition-colors hover:border-ink/30">
      <div className="relative aspect-[4/3] overflow-hidden">
        <ProductImage
          product={product}
          sizes="(min-width: 1280px) 300px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        />
        <div className="absolute top-2 left-2">
          <ProductBadge product={product} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
        {categoryName && (
          <p className="text-[0.7rem] font-semibold tracking-wider text-muted uppercase">{categoryName}</p>
        )}
        <h3 className="font-sans text-[0.95rem] leading-snug font-semibold sm:text-base">
          <Link
            href={`/shop/${product.slug}`}
            className="after:absolute after:inset-0 after:content-[''] hover:text-brand focus-visible:outline-none"
          >
            {product.name}
          </Link>
        </h3>
        {pack && <p className="text-xs text-muted sm:text-sm">{pack}</p>}

        <div className="mt-auto space-y-1.5 pt-2">
          <ProductPrice product={product} />
          <AvailabilityBadge availability={product.availability} />
          {validity && <p className="text-xs font-medium text-brand">{validity}</p>}
        </div>

        {/* Lifted above the stretched link so it stays clickable. */}
        <div className="relative z-10 pt-2">
          <ProductAction product={product} compact />
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({
  products,
  categories,
  showValidity,
}: {
  products: Product[];
  categories?: Category[];
  showValidity?: boolean;
}) {
  const names = new Map(categories?.map((c) => [c.slug, c.shortName]));
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4 max-[340px]:grid-cols-1">
      {products.map((product) => (
        <li key={product.slug}>
          <ProductCard
            product={product}
            categoryName={names.get(product.category)}
            showValidity={showValidity}
          />
        </li>
      ))}
    </ul>
  );
}
