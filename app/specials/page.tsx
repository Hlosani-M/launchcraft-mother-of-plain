import type { Metadata } from "next";
import { getCategories, getSpecials } from "@/lib/data/catalogue";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProductGrid } from "@/components/product/ProductCard";
import { DemoNote } from "@/components/ui/DemoNote";
import { LinkButton } from "@/components/ui/Button";
import { currentPromotion } from "@/data/specials";

export const metadata: Metadata = {
  title: "Weekly Meat Specials",
  description:
    "This week's specials on beef, lamb, chicken, wors, seafood and hampers at Mother of Plain Foods, Mitchell's Plain. Reserve on WhatsApp.",
  alternates: { canonical: "/specials" },
};

export default async function SpecialsPage() {
  const [specials, categories] = await Promise.all([getSpecials(), getCategories()]);

  return (
    <>
      <PageHeader
        tone="brand"
        crumbs={[{ href: "/", label: "Home" }, { label: "Specials" }]}
        eyebrow={currentPromotion.title}
        title="Specials worth stocking up for."
        description={currentPromotion.description}
      >
        <p className="mt-4 inline-block rounded-sm bg-white px-3 py-1.5 text-sm font-bold text-brand">
          {currentPromotion.terms}
        </p>
      </PageHeader>
      <div className="container-page py-8 sm:py-10">
        <p className="mb-4 text-sm text-muted">
          <strong className="text-ink">{specials.length}</strong> specials • While stocks last
        </p>
        {specials.length > 0 ? (
          <ProductGrid products={specials} categories={categories} showValidity />
        ) : (
          <div className="rounded-(--radius-card) bg-surface p-10 text-center">
            <p className="font-display text-3xl font-extrabold uppercase">New specials coming soon.</p>
            <p className="mt-2 text-muted">Browse the full shop in the meantime.</p>
            <LinkButton href="/shop" size="lg" className="mt-5">
              Start shopping
            </LinkButton>
          </div>
        )}
        <div className="mt-8 space-y-2 border-t border-line pt-6">
          <p className="text-sm text-muted">Prices and availability may change. Contact the store to confirm.</p>
          <DemoNote />
        </div>
      </div>
    </>
  );
}
