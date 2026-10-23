import type { Metadata } from "next";
import { getHampers } from "@/lib/data/catalogue";
import { bulkOrderMessage, createWhatsAppUrl } from "@/lib/whatsapp";
import { PageHeader } from "@/components/ui/PageHeader";
import { HamperCard } from "@/components/product/HamperCard";
import { ExternalButton } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { DemoNote } from "@/components/ui/DemoNote";

export const metadata: Metadata = {
  title: "Meat Hampers & Bulk Deals",
  description:
    "Family meat hampers, braai packs, freezer fillers and bulk orders from Mother of Plain Foods in Mitchell's Plain. Reserve on WhatsApp.",
  alternates: { canonical: "/hampers" },
};

export default async function HampersPage() {
  const hampers = await getHampers();

  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Home" }, { href: "/shop", label: "Shop" }, { label: "Hampers & Bulk" }]}
        eyebrow="Family packs • Freezer fillers • Bulk"
        title="Hampers & Bulk Deals"
        description="Make the budget go further with family packs, freezer fillers and bulk options."
      />

      <div className="container-page py-8 sm:py-12">
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {hampers.map((h) => (
            <li key={h.slug}>
              <HamperCard product={h} />
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted">
          Hamper contents shown are a guide. The team will confirm exact contents and weights with you.
        </p>

        <section
          aria-labelledby="bulk-title"
          className="mt-12 grid grid-cols-1 gap-6 rounded-(--radius-card) bg-ink p-6 text-white sm:p-10 lg:grid-cols-[1.4fr_1fr] lg:items-center"
        >
          <div>
            <h2 id="bulk-title" className="text-4xl leading-[0.92] font-extrabold uppercase sm:text-5xl">
              Need a custom bulk order?
            </h2>
            <p className="mt-3 text-white/85 sm:text-lg">
              Functions, big families, stokvels or stocking up for the month? Tell us what you need and the butchery team
              will put it together and confirm pricing and collection.
            </p>
          </div>
          <ExternalButton href={createWhatsAppUrl(bulkOrderMessage())} variant="whatsapp" size="lg">
            <WhatsAppIcon /> Plan a bulk order on WhatsApp
          </ExternalButton>
        </section>
        <DemoNote className="mt-8" />
      </div>
    </>
  );
}
