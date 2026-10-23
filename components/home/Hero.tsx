import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/types/catalogue";
import type { SiteSettings } from "@/types/site";
import { formatRand, formatShortDate, packLabel, priceUnitLabel } from "@/lib/format";
import { createWhatsAppUrl, generalEnquiryMessage } from "@/lib/whatsapp";
import { LinkButton } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { ProductThumb } from "@/components/product/ProductImage";
import { currentPromotion } from "@/data/specials";

export function Hero({ site, specials }: { site: SiteSettings; specials: Product[] }) {
  const { storeImage } = site.brand;

  return (
    <>
      {storeImage && (
        // The banner carries its own text and logo, so it is shown whole rather than cropped.
        <div className="bg-ink">
          <Image
            src={storeImage.src}
            alt={storeImage.alt}
            width={storeImage.width}
            height={storeImage.height}
            priority
            sizes="(min-width: 1640px) 1640px, 100vw"
            className="mx-auto block h-auto w-full max-w-[1640px]"
          />
        </div>
      )}
      <section aria-labelledby="hero-title" className="relative overflow-hidden bg-brand text-white">
        {/* Oversized outline type echoes the store's bold signage without competing with the copy. */}
        <p
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -bottom-8 font-display text-[11rem] leading-none font-extrabold tracking-tighter whitespace-nowrap text-white/[0.07] uppercase select-none sm:text-[16rem] lg:-bottom-14 lg:text-[22rem]"
        >
          Butcher
        </p>

        <div className="container-page relative grid grid-cols-1 gap-10 py-10 sm:py-14 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-14 lg:py-20">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-white/85 uppercase sm:text-sm">
              {site.name} • {site.address.suburb}
            </p>
            <h1
              id="hero-title"
              className="mt-3 text-[3.6rem] leading-[0.86] font-extrabold uppercase sm:text-8xl lg:text-[7.5rem]"
            >
              Fresh cuts.
              <br />
              Big value.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/95 sm:text-xl">
              Your local butcher for meat, hampers, seafood, deli favourites and everyday groceries.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <LinkButton href="/category/beef" variant="inverse" size="lg">
                Shop the butchery <ArrowRight className="size-5" aria-hidden="true" />
              </LinkButton>
              <LinkButton
                href="/specials"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-brand"
                variant="ghost"
              >
                View specials
              </LinkButton>
            </div>
            <a
              href={createWhatsAppUrl(generalEnquiryMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold underline decoration-white/50 underline-offset-4 hover:decoration-white"
            >
              <WhatsAppIcon className="size-5" />
              Order on WhatsApp: {site.whatsappDisplay}
            </a>
          </div>

          <HeroSpecials specials={specials} />
        </div>
      </section>
    </>
  );
}

/** A live "this week" panel built from the specials in the catalogue. */
function HeroSpecials({ specials }: { specials: Product[] }) {
  return (
    <div className="rounded-(--radius-card) bg-white p-4 text-ink shadow-[0_20px_50px_-20px_rgb(0_0_0/0.45)] sm:p-6">
      <div className="flex items-center justify-between border-b-2 border-ink pb-3">
        <div>
          <p className="font-display text-2xl leading-none font-extrabold uppercase sm:text-3xl">
            {currentPromotion.name}
          </p>
          <p className="mt-1 text-xs font-semibold text-muted">
            Specials until {formatShortDate(currentPromotion.validTo)} • While stocks last
          </p>
        </div>
        <span className="rounded-sm bg-brand px-2 py-1 text-[0.7rem] font-bold tracking-wide text-white uppercase">
          Save
        </span>
      </div>
      <ul className="divide-y divide-line">
        {specials.map((p) => (
          <li key={p.slug}>
            <Link href={`/shop/${p.slug}`} className="group flex items-center gap-3 py-3">
              <ProductThumb product={p} className="size-14" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold group-hover:text-brand">{p.name}</span>
                <span className="block truncate text-sm text-muted">{packLabel(p)}</span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block font-display text-2xl leading-none font-extrabold text-brand">
                  {formatRand(p.price)}
                </span>
                <span className="text-xs font-semibold text-muted">{priceUnitLabel[p.priceUnit]}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/specials"
        className="mt-2 flex min-h-11 items-center justify-center gap-1.5 rounded-md bg-ink font-semibold text-white hover:bg-black"
      >
        See all specials <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </div>
  );
}
