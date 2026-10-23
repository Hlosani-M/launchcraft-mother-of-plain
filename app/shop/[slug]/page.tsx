import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Info } from "lucide-react";
import { getCategory, getProductBySlug, getProducts, getRelatedProducts } from "@/lib/data/catalogue";
import { categoryHref } from "@/lib/routes";
import { formatUnitPrice, isVariableWeight, specialValidityLabel } from "@/lib/format";
import { Breadcrumbs } from "@/components/ui/PageHeader";
import { ProductImage } from "@/components/product/ProductImage";
import { ProductPrice } from "@/components/product/ProductPrice";
import { AvailabilityBadge, ProductBadge } from "@/components/product/Badges";
import { ProductGrid } from "@/components/product/ProductCard";
import { ProductPurchase } from "@/components/commerce/ProductPurchase";
import { ProductJsonLd } from "@/components/seo/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DemoNote } from "@/components/ui/DemoNote";

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: `${product.description} ${formatUnitPrice(product)} at Mother of Plain Foods, Mitchell's Plain. Reserve on WhatsApp.`,
    alternates: { canonical: `/shop/${product.slug}` },
  };
}

export default async function ProductPage({ params }: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [category, related] = await Promise.all([getCategory(product.category), getRelatedProducts(product)]);
  const validity = product.isSpecial ? specialValidityLabel(product) : null;

  const details = [
    product.packSize && { label: "Pack", value: product.packSize },
    product.weightLabel && { label: "Weight", value: product.weightLabel },
    { label: "Priced", value: formatUnitPrice(product) },
    category && { label: "Category", value: category.name },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      <div className="container-page py-4 sm:py-6">
        <Breadcrumbs
          items={[
            { href: "/shop", label: "Shop" },
            ...(category ? [{ href: categoryHref(category.slug), label: category.shortName }] : []),
            { label: product.name },
          ]}
        />
      </div>

      <div className="container-page grid grid-cols-1 gap-6 pb-12 lg:grid-cols-2 lg:gap-12">
        <div className="relative aspect-[4/3] overflow-hidden rounded-(--radius-card) border border-line lg:aspect-square">
          <ProductImage product={product} sizes="(min-width: 1024px) 50vw, 100vw" priority large />
          <div className="absolute top-3 left-3">
            <ProductBadge product={product} />
          </div>
        </div>

        <div>
          {category && (
            <p className="text-xs font-bold tracking-[0.18em] text-brand uppercase">{category.name}</p>
          )}
          <h1 className="mt-1 text-[2.4rem] leading-[0.92] font-extrabold uppercase sm:text-6xl">{product.name}</h1>
          {(product.packSize || product.weightLabel) && (
            <p className="mt-2 text-lg text-muted">{product.packSize ?? product.weightLabel}</p>
          )}

          <div className="mt-5 border-y border-line py-5">
            <ProductPrice product={product} size="lg" />
            {isVariableWeight(product) && (
              <p className="mt-2 flex gap-2 text-sm text-muted">
                <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                Price shown per kilogram. Final amount may vary with packed weight.
              </p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
              <AvailabilityBadge availability={product.availability} className="text-sm" />
              {validity && <span className="text-sm font-semibold text-brand">{validity} • While stocks last</span>}
            </div>
            {product.stockMessage && <p className="mt-2 text-sm text-muted">{product.stockMessage}</p>}
          </div>

          <div className="mt-5">
            <ProductPurchase product={product} />
          </div>

          <div className="mt-8 space-y-6">
            <section aria-labelledby="desc-title">
              <h2 id="desc-title" className="text-2xl font-bold uppercase">
                About this product
              </h2>
              <p className="mt-2 text-[1.05rem] leading-relaxed">{product.description}</p>
            </section>

            {product.contents && product.contents.length > 0 && (
              <section aria-labelledby="contents-title">
                <h2 id="contents-title" className="text-2xl font-bold uppercase">
                  What&apos;s inside
                </h2>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {product.contents.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            )}

            <section aria-labelledby="details-title">
              <h2 id="details-title" className="text-2xl font-bold uppercase">
                Pack details
              </h2>
              <dl className="mt-2 divide-y divide-line rounded-(--radius-card) border border-line">
                {details.map((d) => (
                  <div key={d.label} className="flex justify-between gap-4 px-4 py-3 text-sm">
                    <dt className="text-muted">{d.label}</dt>
                    <dd className="text-right font-semibold">{d.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <div className="rounded-(--radius-card) bg-surface p-4 text-sm">
              <p className="font-semibold">Reserve it. We&apos;ll confirm it.</p>
              <p className="mt-1 text-muted">
                Add items to your basket and send your order on WhatsApp. Final price and availability are confirmed by
                Mother of Plain Foods. Collection details will be confirmed by the store.
              </p>
            </div>
            <DemoNote />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="border-t border-line bg-surface py-12">
          <div className="container-page">
            <SectionHeading id="related-title" title="You might also need" />
            <ProductGrid products={related} />
          </div>
        </section>
      )}

      <ProductJsonLd product={product} />
    </>
  );
}
