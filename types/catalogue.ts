/**
 * Domain models for the storefront.
 *
 * These are shaped around the fields a future Sanity schema will provide, so
 * swapping the local data for CMS queries should not require component changes.
 */

export type Availability = "in-stock" | "low-stock" | "backorder" | "sold-out";

export type PriceUnit = "each" | "kg" | "pack" | "box" | "hamper";

export type CategorySlug =
  | "beef"
  | "lamb-mutton"
  | "chicken"
  | "wors-sausages-burgers"
  | "deli"
  | "seafood"
  | "hampers"
  | "groceries"
  | "frozen"
  | "household";

export type ProductBadge = "special" | "family-value" | "new";

export interface ProductImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** "contain" for cut-out pack shots on white (default), "cover" for full-bleed photos. */
  fit?: "contain" | "cover";
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortName?: string;
  description: string;
  category: CategorySlug;
  subcategory?: string;
  /** Leave undefined until approved photography is supplied; the UI renders a branded placeholder. */
  image?: ProductImage;
  gallery?: ProductImage[];
  /** Price in rand for one `priceUnit`. */
  price: number;
  compareAtPrice?: number;
  priceUnit: PriceUnit;
  /** Fixed pack contents, e.g. "1kg tray" or "6 × 150g". */
  packSize?: string;
  /** Approximate weight for variable-weight items, e.g. "Approx. 1.2kg". */
  weightLabel?: string;
  availability: Availability;
  stockMessage?: string;
  isFeatured: boolean;
  isSpecial: boolean;
  specialLabel?: string;
  /** ISO date (YYYY-MM-DD). */
  specialValidFrom?: string;
  /** ISO date (YYYY-MM-DD). */
  specialValidTo?: string;
  badge?: ProductBadge;
  /** Hamper / combo contents shown on the hampers page. */
  contents?: string[];
  tags: string[];
  sortOrder?: number;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  shortName: string;
  description: string;
  /** Butchery-first categories are promoted more heavily in navigation. */
  tier: "primary" | "secondary";
  sortOrder: number;
}
