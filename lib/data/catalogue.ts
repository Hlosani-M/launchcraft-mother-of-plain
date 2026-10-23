import { categories } from "@/data/categories";
import { products } from "@/data/products";
import type { Category, CategorySlug, Product } from "@/types/catalogue";

/**
 * Catalogue repository.
 *
 * Every page and component reads catalogue data through these async functions.
 * To move to Sanity, replace each body with a GROQ query; the signatures stay.
 */

const categoryOrder = new Map(categories.map((c) => [c.slug, c.sortOrder]));

function byCatalogueOrder(a: Product, b: Product) {
  const category =
    (categoryOrder.get(a.category) ?? 99) - (categoryOrder.get(b.category) ?? 99);
  if (category !== 0) return category;
  return (a.sortOrder ?? 99) - (b.sortOrder ?? 99);
}

export async function getProducts(): Promise<Product[]> {
  return [...products].sort(byCatalogueOrder);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}

export async function getProductsByCategory(slug: CategorySlug): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.category === slug);
}

export async function getFeaturedProducts(limit?: number): Promise<Product[]> {
  const featured = (await getProducts()).filter((p) => p.isFeatured);
  return limit ? featured.slice(0, limit) : featured;
}

export async function getSpecials(limit?: number): Promise<Product[]> {
  const specials = (await getProducts()).filter((p) => p.isSpecial);
  return limit ? specials.slice(0, limit) : specials;
}

export async function getHampers(): Promise<Product[]> {
  return getProductsByCategory("hampers");
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const all = await getProducts();
  const sameCategory = all.filter(
    (p) => p.category === product.category && p.slug !== product.slug,
  );
  const others = all.filter((p) => p.category !== product.category && p.isFeatured);
  return [...sameCategory, ...others].slice(0, limit);
}

export async function getCategories(): Promise<Category[]> {
  return [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  return categories.find((c) => c.slug === slug);
}
