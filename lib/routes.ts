import type { CategorySlug } from "@/types/catalogue";

/** Hampers have their own richer landing page. */
export function categoryHref(slug: CategorySlug) {
  return slug === "hampers" ? "/hampers" : `/category/${slug}`;
}
