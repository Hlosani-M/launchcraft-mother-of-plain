"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Availability, Category, Product } from "@/types/catalogue";
import { availabilityLabel } from "@/lib/format";
import { matchesQuery } from "@/lib/search";
import { createWhatsAppUrl, searchEnquiryMessage, generalEnquiryMessage } from "@/lib/whatsapp";
import { ProductGrid } from "@/components/product/ProductCard";
import { Sheet } from "@/components/ui/Sheet";
import { buttonClasses } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

const SORTS = {
  featured: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  name: "Name",
} as const;
type Sort = keyof typeof SORTS;

const AVAILABILITY: Availability[] = ["in-stock", "low-stock", "backorder", "sold-out"];

export function ShopCatalogue({ products, categories }: { products: Product[]; categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchId = useId();

  const query = params.get("q") ?? "";
  const category = params.get("category") ?? "";
  const availability = (params.get("availability")?.split(",").filter(Boolean) ?? []) as Availability[];
  const specialsOnly = params.get("specials") === "1";
  const sort = (params.get("sort") as Sort) in SORTS ? (params.get("sort") as Sort) : "featured";

  function update(changes: Record<string, string | null>) {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function toggleAvailability(value: Availability) {
    const set = new Set(availability);
    if (set.has(value)) set.delete(value);
    else set.add(value);
    update({ availability: [...set].join(",") || null });
  }

  const categoryNames = new Map(categories.map((c) => [c.slug, c.name]));
  const results = products
    .filter((p) => !category || p.category === category)
    .filter((p) => availability.length === 0 || availability.includes(p.availability))
    .filter((p) => !specialsOnly || p.isSpecial)
    .filter((p) => matchesQuery({ ...p, categoryName: categoryNames.get(p.category) }, query))
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  const activeFilterCount = availability.length + (specialsOnly ? 1 : 0);
  const hasAnyFilter = Boolean(query || category || activeFilterCount);

  const filterControls = (
    <div className="space-y-6">
      <fieldset>
        <legend className="mb-2 text-xs font-bold tracking-wider text-muted uppercase">Availability</legend>
        <div className="space-y-1">
          {AVAILABILITY.map((value) => (
            <label key={value} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-1 hover:bg-surface">
              <input
                type="checkbox"
                checked={availability.includes(value)}
                onChange={() => toggleAvailability(value)}
                className="size-5 accent-brand"
              />
              <span className="text-[0.95rem]">{availabilityLabel[value]}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-xs font-bold tracking-wider text-muted uppercase">Deals</legend>
        <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-1 hover:bg-surface">
          <input
            type="checkbox"
            checked={specialsOnly}
            onChange={() => update({ specials: specialsOnly ? null : "1" })}
            className="size-5 accent-brand"
          />
          <span className="text-[0.95rem]">Specials only</span>
        </label>
      </fieldset>
    </div>
  );

  return (
    <div>
      {/* Search + category chips */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 rounded-md border-2 border-ink bg-white px-3 focus-within:border-brand">
          <label htmlFor={searchId} className="sr-only">
            Search products
          </label>
          <Search className="size-5 shrink-0 text-muted" aria-hidden="true" />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => update({ q: e.target.value || null })}
            placeholder="Search chicken, mutton, wors, hamper…"
            enterKeyHint="search"
            className="min-h-12 w-full bg-transparent outline-none placeholder:text-muted"
          />
          {query && (
            <button
              type="button"
              onClick={() => update({ q: null })}
              className="flex size-9 items-center justify-center rounded-md hover:bg-surface"
              aria-label="Clear search"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <div role="group" aria-label="Category" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:px-0">
          <CategoryChip active={!category} onClick={() => update({ category: null })}>
            All
          </CategoryChip>
          {categories.map((c) => (
            <CategoryChip key={c.slug} active={category === c.slug} onClick={() => update({ category: c.slug })}>
              {c.shortName}
            </CategoryChip>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[14rem_1fr]">
        <aside className="hidden lg:block" aria-label="Filters">
          <div className="sticky top-24">{filterControls}</div>
        </aside>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted" aria-live="polite">
              <strong className="text-ink">{results.length}</strong> {results.length === 1 ? "product" : "products"}
              {query && <> for &ldquo;{query}&rdquo;</>}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="inline-flex min-h-11 items-center gap-2 rounded-md border border-line px-3 text-sm font-semibold hover:border-ink lg:hidden"
              >
                <SlidersHorizontal className="size-4" aria-hidden="true" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-brand px-1.5 text-xs leading-5 text-white">{activeFilterCount}</span>
                )}
              </button>
              <label className="sr-only" htmlFor={`${searchId}-sort`}>
                Sort by
              </label>
              <select
                id={`${searchId}-sort`}
                value={sort}
                onChange={(e) => update({ sort: e.target.value === "featured" ? null : e.target.value })}
                className="min-h-11 rounded-md border border-line bg-white px-3 text-base font-semibold hover:border-ink"
              >
                {Object.entries(SORTS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {results.length > 0 ? (
            <ProductGrid products={results} categories={categories} />
          ) : (
            <div className="rounded-(--radius-card) bg-surface px-6 py-12 text-center">
              <p className="font-display text-3xl font-extrabold uppercase">No products found.</p>
              <p className="mx-auto mt-2 max-w-md text-muted">
                Try another category or ask the team on WhatsApp. Not everything in store is listed online.
              </p>
              <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href={createWhatsAppUrl(query ? searchEnquiryMessage(query) : generalEnquiryMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClasses("whatsapp", "lg")}
                >
                  <WhatsAppIcon /> Ask us on WhatsApp
                </a>
                {hasAnyFilter && (
                  <button type="button" onClick={() => router.replace(pathname, { scroll: false })} className={buttonClasses("secondary", "lg")}>
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Sheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters"
        footer={
          <button type="button" onClick={() => setFiltersOpen(false)} className={buttonClasses("primary", "lg", "w-full")}>
            Show {results.length} {results.length === 1 ? "product" : "products"}
          </button>
        }
      >
        <div className="p-4">{filterControls}</div>
      </Sheet>
    </div>
  );
}

function CategoryChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-11 shrink-0 rounded-md px-4 text-sm font-semibold whitespace-nowrap transition-colors ${
        active ? "bg-ink text-white" : "bg-surface text-ink hover:bg-brand-tint hover:text-brand"
      }`}
    >
      {children}
    </button>
  );
}
