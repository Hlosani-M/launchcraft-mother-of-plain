"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import type { Category, CategorySlug, PriceUnit, ProductImage } from "@/types/catalogue";
import { formatRand, priceUnitLabel } from "@/lib/format";
import { matchesQuery } from "@/lib/search";
import { categoryHref } from "@/lib/routes";
import { createWhatsAppUrl, searchEnquiryMessage } from "@/lib/whatsapp";
import { buttonClasses } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { CategoryIcon } from "@/components/product/CategoryIcon";
import { ProductThumb } from "@/components/product/ProductImage";

/** Lightweight product index passed from the server layout. */
export interface SearchItem {
  slug: string;
  name: string;
  category: CategorySlug;
  categoryName: string;
  tags: string[];
  price: number;
  priceUnit: PriceUnit;
  pack: string;
  image?: ProductImage;
}

const QUICK_SEARCHES = ["chicken", "mince", "wors", "chops", "hamper", "fish"];

export function SearchPanel({
  items,
  categories,
  onNavigate,
}: {
  items: SearchItem[];
  categories: Category[];
  onNavigate: () => void;
}) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputId = useId();
  const trimmed = query.trim();
  const results = trimmed ? items.filter((item) => matchesQuery(item, trimmed)) : [];

  return (
    <div className="p-4">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (!trimmed) return;
          onNavigate();
          router.push(`/shop?q=${encodeURIComponent(trimmed)}`);
        }}
      >
        <label htmlFor={inputId} className="sr-only">
          Search products
        </label>
        <div className="flex items-center gap-2 rounded-md border-2 border-ink px-3 focus-within:border-brand">
          <Search className="size-5 shrink-0 text-muted" aria-hidden="true" />
          <input
            id={inputId}
            type="search"
            autoFocus
            autoComplete="off"
            enterKeyHint="search"
            placeholder="Try chicken, mutton, wors, hamper…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-12 w-full bg-transparent outline-none placeholder:text-muted"
          />
        </div>
      </form>

      {!trimmed && (
        <div className="mt-5 space-y-5">
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wider text-muted uppercase">Popular searches</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="min-h-10 rounded-md border border-line px-3 text-sm font-medium capitalize hover:border-ink"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wider text-muted uppercase">Categories</p>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={categoryHref(c.slug)}
                    onClick={onNavigate}
                    className="flex min-h-11 items-center gap-2 rounded-md bg-surface px-3 text-sm font-medium hover:bg-brand-tint"
                  >
                    <CategoryIcon category={c.slug} className="size-4 text-brand" />
                    {c.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {trimmed && (
        <div className="mt-4" aria-live="polite">
          {results.length > 0 ? (
            <>
              <p className="mb-2 text-sm text-muted">
                {results.length} {results.length === 1 ? "product" : "products"} found
              </p>
              <ul className="divide-y divide-line">
                {results.slice(0, 8).map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/shop/${item.slug}`}
                      onClick={onNavigate}
                      className="flex min-h-14 items-center gap-3 py-2 hover:text-brand"
                    >
                      <ProductThumb product={item} className="size-12" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold">{item.name}</span>
                        <span className="block truncate text-xs text-muted">
                          {item.categoryName}
                          {item.pack && ` • ${item.pack}`}
                        </span>
                      </span>
                      <span className="shrink-0 text-right text-sm font-bold">
                        {formatRand(item.price)}
                        <span className="block text-xs font-medium text-muted">{priceUnitLabel[item.priceUnit]}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={`/shop?q=${encodeURIComponent(trimmed)}`}
                onClick={onNavigate}
                className={buttonClasses("secondary", "md", "mt-4 w-full")}
              >
                See all results <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </>
          ) : (
            <div className="rounded-(--radius-card) bg-surface p-5 text-center">
              <p className="font-display text-2xl font-bold uppercase">Can&apos;t find what you&apos;re looking for?</p>
              <p className="mt-1 text-sm text-muted">
                Not everything in store is listed online. Ask the team about &ldquo;{trimmed}&rdquo;.
              </p>
              <a
                href={createWhatsAppUrl(searchEnquiryMessage(trimmed))}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses("whatsapp", "lg", "mt-4 w-full sm:w-auto")}
              >
                <WhatsAppIcon /> Ask us on WhatsApp
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
