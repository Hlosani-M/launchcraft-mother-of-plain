import Link from "next/link";
import { Check } from "lucide-react";
import type { Product } from "@/types/catalogue";
import { productEnquiryMessage, createWhatsAppUrl } from "@/lib/whatsapp";
import { specialValidityLabel } from "@/lib/format";
import { ProductPrice } from "@/components/product/ProductPrice";
import { AvailabilityBadge, ProductBadge } from "@/components/product/Badges";
import { ProductAction } from "@/components/commerce/ProductAction";
import { ProductImage } from "@/components/product/ProductImage";

export function HamperCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const contents = product.contents ?? [];
  const shown = compact ? contents.slice(0, 4) : contents;
  const hidden = contents.length - shown.length;
  const validity = product.isSpecial ? specialValidityLabel(product) : null;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-(--radius-card) border border-line bg-white text-ink">
      <div className="relative aspect-[4/3] border-b border-line">
        <ProductImage product={product} sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw" />
        <div className="absolute top-3 left-3">
          <ProductBadge product={product} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-3xl leading-none font-extrabold uppercase">
          <Link href={`/shop/${product.slug}`} className="hover:text-brand">
            {product.name}
          </Link>
        </h3>
        {product.packSize && <p className="mt-1 text-sm text-muted">{product.packSize} • sample contents</p>}

        <div className="mt-4">
          <ProductPrice product={product} size="md" />
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <AvailabilityBadge availability={product.availability} />
            {validity && <span className="text-xs font-medium text-brand">{validity}</span>}
          </div>
        </div>

        {shown.length > 0 && (
          <div className="mt-5 border-t border-line pt-4">
            <p className="text-xs font-bold tracking-wider text-muted uppercase">What&apos;s inside</p>
            <ul className="mt-2 space-y-1.5 text-sm">
              {shown.map((item) => (
                <li key={item} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={3} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            {hidden > 0 && (
              <Link href={`/shop/${product.slug}`} className="mt-2 inline-block text-sm font-semibold text-brand hover:underline">
                + {hidden} more {hidden === 1 ? "item" : "items"}
              </Link>
            )}
          </div>
        )}

        <div className="mt-auto grid gap-2 pt-5">
          <ProductAction product={product} />
          {product.availability !== "backorder" && product.availability !== "sold-out" && (
            <a
              href={createWhatsAppUrl(productEnquiryMessage(product))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center text-sm font-semibold underline decoration-line decoration-2 underline-offset-4 hover:decoration-brand"
            >
              Ask about this hamper
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
