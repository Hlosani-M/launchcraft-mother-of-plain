import type { Metadata } from "next";
import { Suspense } from "react";
import { getCategories, getProducts } from "@/lib/data/catalogue";
import { PageHeader } from "@/components/ui/PageHeader";
import { ShopCatalogue } from "@/components/commerce/ShopCatalogue";
import { ProductGrid } from "@/components/product/ProductCard";
import { DemoNote } from "@/components/ui/DemoNote";

export const metadata: Metadata = {
  title: "Shop Meat, Hampers & Groceries",
  description:
    "Browse beef, lamb and mutton, chicken, wors, seafood, hampers, deli favourites and everyday essentials from Mother of Plain Foods in Mitchell's Plain.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Home" }, { label: "Shop" }]}
        title="Shop Mother of Plain"
        description="Browse meat, hampers, seafood, deli favourites and everyday essentials."
      />
      <div className="container-page py-8 sm:py-10">
        {/* The catalogue reads filters from the URL on the client; the static grid is the prerendered fallback. */}
        <Suspense fallback={<ProductGrid products={products} categories={categories} />}>
          <ShopCatalogue products={products} categories={categories} />
        </Suspense>
        <DemoNote className="mt-8" />
      </div>
    </>
  );
}
