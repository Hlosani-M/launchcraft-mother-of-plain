import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { getCategories, getProducts } from "@/lib/data/catalogue";
import { categoryHref } from "@/lib/routes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const url = (path: string) => `${siteConfig.siteUrl}${path}`;

  return [
    { url: url("/"), priority: 1 },
    { url: url("/shop"), priority: 0.9 },
    { url: url("/specials"), priority: 0.9 },
    { url: url("/hampers"), priority: 0.8 },
    { url: url("/visit"), priority: 0.7 },
    { url: url("/about"), priority: 0.4 },
    ...categories
      .filter((c) => c.slug !== "hampers")
      .map((c) => ({ url: url(categoryHref(c.slug)), priority: 0.7 })),
    ...products.map((p) => ({ url: url(`/shop/${p.slug}`), priority: 0.6 })),
  ];
}
