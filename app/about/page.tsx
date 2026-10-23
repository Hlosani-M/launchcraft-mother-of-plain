import type { Metadata } from "next";
import Image from "next/image";
import { Beef, ShoppingBasket, Store, Tag } from "lucide-react";
import { getSiteSettings } from "@/lib/data/site";
import { createWhatsAppUrl, generalEnquiryMessage } from "@/lib/whatsapp";
import { PageHeader } from "@/components/ui/PageHeader";
import { ExternalButton, LinkButton } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Mother of Plain Foods is a Mitchell's Plain food retailer with butchery at the heart of the store: meat, deli, seafood, groceries and everyday essentials under one roof.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const site = await getSiteSettings();
  const points = [
    { icon: Beef, title: "Butchery at the heart", body: "Beef, lamb and mutton, chicken, wors and braai cuts are what we're known for." },
    { icon: ShoppingBasket, title: "Family value", body: "Family packs, combos and hampers help the budget go further." },
    { icon: Tag, title: "Specials", body: "Regular specials on meat and essentials, so it pays to check in." },
    { icon: Store, title: "A real local store", body: `Visit us at Polka Place, ${site.address.area}, ${site.address.suburb}.` },
  ];

  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Home" }, { label: "About" }]}
        eyebrow={site.descriptor}
        title="Your local butcher in Mitchell's Plain"
      />
      <div className="container-page grid grid-cols-1 gap-10 py-10 sm:py-14 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-xl leading-relaxed sm:text-2xl">
            {site.name} is a {site.address.suburb} food retailer with butchery at the heart of the store. Customers can
            shop meat, deli favourites, seafood, groceries, frozen products and everyday essentials under one roof.
          </p>
          <p className="mt-4 text-lg text-muted">
            This website brings the store to your phone: browse what&apos;s on special, build a basket, and send it to
            the team on WhatsApp to confirm availability and collection.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <LinkButton href="/shop" size="lg">
              Start shopping
            </LinkButton>
            <ExternalButton href={createWhatsAppUrl(generalEnquiryMessage())} variant="whatsapp" size="lg">
              <WhatsAppIcon /> Chat on WhatsApp
            </ExternalButton>
          </div>
        </div>

        {site.brand.storeImage ? (
          <Image
            src={site.brand.storeImage.src}
            alt={site.brand.storeImage.alt}
            width={site.brand.storeImage.width}
            height={site.brand.storeImage.height}
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="h-auto w-full rounded-(--radius-card)"
          />
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {points.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-4 rounded-(--radius-card) border border-line p-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-display text-xl font-bold uppercase">{title}</span>
                  <span className="text-muted">{body}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
