import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getCategory, getProductsByCategory } from "@/lib/data/catalogue";
import { categoryHref } from "@/lib/routes";
import { createWhatsAppUrl, bulkOrderMessage } from "@/lib/whatsapp";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProductGrid } from "@/components/product/ProductCard";
import { DemoNote } from "@/components/ui/DemoNote";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { ExternalButton } from "@/components/ui/Button";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.filter((c) => c.slug !== "hampers").map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return {};
  return {
    title: `${category.name} | Mitchell's Plain Butchery`,
    description: `${category.description} Shop ${category.name.toLowerCase()} from Mother of Plain Foods and reserve your order on WhatsApp.`,
    alternates: { canonical: `/category/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  const [products, categories] = await Promise.all([getProductsByCategory(category.slug), getCategories()]);

  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Home" }, { href: "/shop", label: "Shop" }, { label: category.name }]}
        eyebrow={category.tier === "primary" ? "Butchery & fresh" : "Everyday essentials"}
        title={category.name}
        description={category.description}
      >
        <nav aria-label="Other categories" className="-mx-4 mt-6 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0">
          <ul className="flex gap-2 sm:flex-wrap">
            {categories.map((c) => (
              <li key={c.slug} className="shrink-0">
                <Link
                  href={categoryHref(c.slug)}
                  aria-current={c.slug === category.slug ? "page" : undefined}
                  className={`inline-flex min-h-10 items-center rounded-md px-3.5 text-sm font-semibold whitespace-nowrap ${
                    c.slug === category.slug ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-line hover:ring-ink"
                  }`}
                >
                  {c.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      <div className="container-page py-8 sm:py-10">
        <p className="mb-4 text-sm text-muted">
          <strong className="text-ink">{products.length}</strong> {products.length === 1 ? "product" : "products"}
        </p>
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <p className="rounded-(--radius-card) bg-surface p-8 text-center text-muted">
            No products found. Try another category or ask the team on WhatsApp.
          </p>
        )}

        {category.tier === "primary" && (
          <div className="mt-10 flex flex-col gap-4 rounded-(--radius-card) border border-line p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-2xl font-extrabold uppercase">Need more? Ask us about bulk orders.</p>
              <p className="text-muted">Special cuts and bigger quantities can be arranged with the butchery team.</p>
            </div>
            <ExternalButton
              href={createWhatsAppUrl(bulkOrderMessage(category.name))}
              variant="whatsapp"
              size="lg"
              className="shrink-0"
            >
              <WhatsAppIcon /> Ask about bulk
            </ExternalButton>
          </div>
        )}
        <DemoNote className="mt-8" />
      </div>
    </>
  );
}
