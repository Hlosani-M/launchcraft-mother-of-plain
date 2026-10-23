import Link from "next/link";
import { ArrowRight, Clock, MapPin, MousePointerClick, Phone, Store, Users, Beef, ShoppingBasket } from "lucide-react";
import type { Category, CategorySlug, Product } from "@/types/catalogue";
import type { SiteSettings } from "@/types/site";
import { categoryHref } from "@/lib/routes";
import { createWhatsAppUrl, bulkOrderMessage, generalEnquiryMessage } from "@/lib/whatsapp";
import { ExternalButton, LinkButton } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { RatingStars } from "@/components/ui/RatingStars";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CategoryIcon } from "@/components/product/CategoryIcon";
import { ProductGrid } from "@/components/product/ProductCard";
import { HamperCard } from "@/components/product/HamperCard";
import { StoreStatus } from "@/components/store/StoreStatus";

export function QuickInfoStrip({ site }: { site: SiteSettings }) {
  const items = [
    { icon: <Clock className="size-5" aria-hidden="true" />, label: site.openDaysLabel, sub: "Including public holidays" },
    {
      icon: <RatingStars rating={site.googleRating} className="size-4" />,
      label: `${site.googleRating.toFixed(1)} ★ on Google`,
      sub: `${site.googleReviewCount.toLocaleString("en-ZA")} Google reviews`,
    },
    { icon: <Beef className="size-5" aria-hidden="true" />, label: "Butcher • Deli", sub: "Seafood • Groceries" },
    { icon: <WhatsAppIcon className="size-5" />, label: "Order via WhatsApp", sub: site.whatsappDisplay },
  ];
  return (
    <section aria-label="Store highlights" className="border-b border-line bg-white">
      <ul className="container-page grid grid-cols-2 divide-line lg:grid-cols-4 lg:divide-x">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-3 py-4 lg:justify-center lg:px-4">
            <span className="flex shrink-0 items-center text-brand">{item.icon}</span>
            <span className="min-w-0 leading-tight">
              <span className="block text-sm font-bold">{item.label}</span>
              <span className="block truncate text-xs text-muted">{item.sub}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

const FEATURED_CATEGORIES: CategorySlug[] = [
  "beef",
  "lamb-mutton",
  "chicken",
  "wors-sausages-burgers",
  "seafood",
  "hampers",
];

export function CategorySection({ categories, counts }: { categories: Category[]; counts: Map<CategorySlug, number> }) {
  const featured = FEATURED_CATEGORIES.map((slug) => categories.find((c) => c.slug === slug)!);
  const rest = categories.filter((c) => !FEATURED_CATEGORIES.includes(c.slug));

  return (
    <section aria-labelledby="categories-title" className="container-page py-12 sm:py-16">
      <SectionHeading
        id="categories-title"
        eyebrow="Butchery first"
        title="What are you shopping for?"
        action={{ href: "/shop", label: "Browse everything" }}
      />
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {featured.map((c) => (
          <li key={c.slug}>
            <Link
              href={categoryHref(c.slug)}
              className="group flex h-full flex-col justify-between gap-6 rounded-(--radius-card) border border-line bg-white p-4 transition-colors hover:border-brand hover:bg-brand hover:text-white sm:p-5"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-brand-tint text-brand transition-colors group-hover:bg-white">
                <CategoryIcon category={c.slug} className="size-6" />
              </span>
              <span>
                <span className="block font-display text-2xl leading-none font-extrabold uppercase">
                  {c.shortName}
                </span>
                <span className="mt-1.5 flex items-center gap-1 text-sm text-muted group-hover:text-white/90">
                  {counts.get(c.slug) ?? 0} products
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <ul className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none sm:mt-4 sm:flex-wrap">
        {rest.map((c) => (
          <li key={c.slug} className="shrink-0">
            <Link
              href={categoryHref(c.slug)}
              className="flex min-h-11 items-center gap-2 rounded-md bg-surface px-4 text-sm font-semibold hover:bg-brand-tint hover:text-brand"
            >
              <CategoryIcon category={c.slug} className="size-4 text-brand" />
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SpecialsSection({ specials, categories }: { specials: Product[]; categories: Category[] }) {
  return (
    <section aria-labelledby="specials-title" className="border-t-4 border-brand bg-surface py-12 sm:py-16">
      <div className="container-page">
        <SectionHeading
          id="specials-title"
          eyebrow="This week's specials"
          title={
            <>
              Deals worth <span className="text-brand">stocking up</span> for.
            </>
          }
          action={{ href: "/specials", label: "View all specials" }}
        />
        <ProductGrid products={specials} categories={categories} showValidity />
        <p className="mt-4 text-sm font-medium text-muted">While stocks last.</p>
      </div>
    </section>
  );
}

export function HampersSection({ hampers }: { hampers: Product[] }) {
  return (
    <section aria-labelledby="hampers-title" className="bg-ink py-12 text-white sm:py-16">
      <div className="container-page">
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="mb-1 text-xs font-bold tracking-[0.18em] text-white/70 uppercase">Hampers & bulk deals</p>
            <h2 id="hampers-title" className="text-[2.6rem] leading-[0.9] font-extrabold uppercase sm:text-6xl">
              Fill the freezer <span className="text-brand">for less.</span>
            </h2>
          </div>
          <div className="lg:pb-1">
            <p className="text-white/85 sm:text-lg">
              Family packs, meat hampers and bulk-friendly deals made for bigger shops. Shop a ready-made hamper or chat
              to the team about a bulk order.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/hampers" size="lg">
                Shop hampers <ArrowRight className="size-5" aria-hidden="true" />
              </LinkButton>
              <ExternalButton
                href={createWhatsAppUrl(bulkOrderMessage())}
                variant="inverse"
                size="lg"
                className="text-ink"
              >
                <WhatsAppIcon /> Ask about bulk orders
              </ExternalButton>
            </div>
          </div>
        </div>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {hampers.map((h) => (
            <li key={h.slug}>
              <HamperCard product={h} compact />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function BackOrderSection() {
  const steps = [
    { icon: <MousePointerClick className="size-6" aria-hidden="true" />, title: "Pick the product", body: "Find what you need in the shop, even if it's marked back order." },
    { icon: <WhatsAppIcon className="size-6" />, title: "Tap back-order", body: "WhatsApp opens with the product and quantity already filled in." },
    { icon: <ShoppingBasket className="size-6" aria-hidden="true" />, title: "Confirm with the team", body: "The Mother of Plain team confirms availability and collection with you." },
  ];
  return (
    <section aria-labelledby="backorder-title" className="container-page py-12 sm:py-16">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
        <div>
          <p className="mb-1 text-xs font-bold tracking-[0.18em] text-brand uppercase">Back orders</p>
          <h2 id="backorder-title" className="text-[2rem] leading-[0.95] font-extrabold uppercase sm:text-5xl">
            Can&apos;t find it in stock?
          </h2>
          <p className="mt-3 text-muted sm:text-lg">
            Back-order it in a few taps. Tell us what you need and the Mother of Plain team can confirm availability on
            WhatsApp.
          </p>
          <LinkButton href="/shop?availability=backorder" variant="secondary" size="lg" className="mt-5">
            See back-order items
          </LinkButton>
        </div>
        <ol className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="relative rounded-(--radius-card) border border-line p-5">
              <span className="font-display text-5xl leading-none font-extrabold text-brand/15" aria-hidden="true">
                0{i + 1}
              </span>
              <span className="mt-2 flex size-11 items-center justify-center rounded-full bg-brand text-white">
                {step.icon}
              </span>
              <h3 className="mt-3 text-xl font-bold uppercase">
                <span className="sr-only">Step {i + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-1 text-sm text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function WhySection() {
  const reasons = [
    { icon: <Beef className="size-6" aria-hidden="true" />, title: "Butchery first", body: "Fresh meat is at the heart of the store, from everyday mince to braai cuts." },
    { icon: <Users className="size-6" aria-hidden="true" />, title: "Family-sized value", body: "Browse individual cuts, family packs, combos and hampers." },
    { icon: <ShoppingBasket className="size-6" aria-hidden="true" />, title: "More under one roof", body: "Deli, seafood, frozen foods and grocery essentials in the same shop." },
    { icon: <Store className="size-6" aria-hidden="true" />, title: "Easy to reach", body: "Find us at Polka Place in Town Centre, Mitchell's Plain." },
  ];
  return (
    <section aria-labelledby="why-title" className="border-y border-line bg-surface py-12 sm:py-16">
      <div className="container-page">
        <SectionHeading id="why-title" eyebrow="Why Mother of Plain" title="Big on meat. Big on value." />
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r) => (
            <li key={r.title} className="rounded-(--radius-card) bg-white p-5 shadow-[0_0_0_1px_var(--color-line)]">
              <span className="text-brand">{r.icon}</span>
              <h3 className="mt-3 text-2xl font-bold uppercase">{r.title}</h3>
              <p className="mt-1 text-muted">{r.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function VisitSection({ site }: { site: SiteSettings }) {
  const tel = `tel:${site.phone.replace(/\s/g, "")}`;
  return (
    <section aria-labelledby="visit-title" className="container-page py-12 sm:py-16">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-(--radius-card) border border-line p-6 sm:p-8">
          <p className="mb-1 text-xs font-bold tracking-[0.18em] text-brand uppercase">Visit the store</p>
          <h2 id="visit-title" className="text-[2rem] leading-[0.95] font-extrabold uppercase sm:text-5xl">
            Your local Mother of Plain
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <p className="flex gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
                <span>
                  {site.address.street}
                  <br />
                  {site.address.area}, {site.address.suburb}
                </span>
              </p>
              <p className="flex gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
                <StoreStatus hours={site.tradingHours} />
              </p>
              <p className="flex gap-3">
                <Phone className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
                <a href={tel} className="font-semibold hover:text-brand">
                  {site.phone}
                </a>
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <ExternalButton href={site.mapUrl} size="lg">
                <MapPin className="size-5" aria-hidden="true" /> Get directions
              </ExternalButton>
              <ExternalButton href={createWhatsAppUrl(generalEnquiryMessage())} variant="whatsapp" size="lg">
                <WhatsAppIcon /> WhatsApp us
              </ExternalButton>
              <LinkButton href="/visit" variant="secondary" size="lg">
                Trading hours & contact
              </LinkButton>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-(--radius-card) bg-surface p-6 sm:p-8">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-muted uppercase">Community rated</p>
            <p className="mt-2 flex items-end gap-3">
              <span className="font-display text-7xl leading-none font-extrabold">{site.googleRating.toFixed(1)}</span>
              <span className="pb-2">
                <RatingStars rating={site.googleRating} className="size-5" />
                <span className="sr-only">{site.googleRating} out of 5 stars</span>
              </span>
            </p>
            <p className="mt-2 font-semibold">
              {site.googleReviewCount.toLocaleString("en-ZA")} Google reviews
            </p>
          </div>
          <ExternalButton href={site.mapUrl} variant="secondary" size="lg" className="mt-6">
            View on Google
          </ExternalButton>
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-title" className="bg-brand text-white">
      <div className="container-page flex flex-col gap-6 py-12 sm:py-16 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 id="final-cta-title" className="text-[2.4rem] leading-[0.92] font-extrabold uppercase sm:text-6xl">
            Need something specific?
          </h2>
          <p className="mt-3 text-lg text-white/95">
            Special cuts, bulk quantities or stock questions? Chat directly to the Mother of Plain team.
          </p>
        </div>
        <ExternalButton
          href={createWhatsAppUrl(generalEnquiryMessage())}
          variant="inverse"
          size="lg"
          className="shrink-0 text-ink"
        >
          <WhatsAppIcon className="size-5 text-wa" /> Chat on WhatsApp
        </ExternalButton>
      </div>
    </section>
  );
}
