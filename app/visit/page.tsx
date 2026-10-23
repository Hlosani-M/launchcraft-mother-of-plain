import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { getSiteSettings } from "@/lib/data/site";
import { createWhatsAppUrl, generalEnquiryMessage } from "@/lib/whatsapp";
import { PageHeader } from "@/components/ui/PageHeader";
import { ExternalButton } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { TradingHours } from "@/components/store/TradingHours";
import { StoreStatus, TodayHours } from "@/components/store/StoreStatus";
import { RatingStars } from "@/components/ui/RatingStars";

export const metadata: Metadata = {
  title: "Visit Us | Polka Place, Town Centre, Mitchell's Plain",
  description:
    "Find Mother of Plain Foods at 4th Avenue, Polka Place, Town Centre, Mitchell's Plain. Trading hours, directions, phone, WhatsApp and email.",
  alternates: { canonical: "/visit" },
};

export default async function VisitPage() {
  const site = await getSiteSettings();
  const tel = (n: string) => `tel:${n.replace(/\s/g, "")}`;
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(site.mapEmbedQuery)}&output=embed`;

  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Home" }, { label: "Visit Us" }]}
        eyebrow="Your local butcher in Mitchell's Plain"
        title="Visit Mother of Plain"
        description={`${site.address.street}, ${site.address.area}, ${site.address.suburb}.`}
      />

      <div className="container-page grid grid-cols-1 gap-6 py-8 sm:py-12 lg:grid-cols-[1fr_1fr] lg:gap-10">
        <div className="space-y-6">
          <section aria-labelledby="find-title" className="rounded-(--radius-card) border border-line p-5 sm:p-6">
            <h2 id="find-title" className="text-3xl font-extrabold uppercase">
              Find us
            </h2>
            <address className="mt-3 flex gap-3 text-lg not-italic">
              <MapPin className="mt-1 size-5 shrink-0 text-brand" aria-hidden="true" />
              <span>
                <strong className="font-semibold">{site.name}</strong>
                <br />
                {site.address.street}
                <br />
                {site.address.area}
                <br />
                {site.address.suburb}
                <br />
                {site.address.city}
              </span>
            </address>
            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <ExternalButton href={site.mapUrl} size="lg">
                <MapPin className="size-5" aria-hidden="true" /> Get directions
              </ExternalButton>
              <ExternalButton href={tel(site.phone)} variant="secondary" size="lg">
                <Phone className="size-5" aria-hidden="true" /> Call store
              </ExternalButton>
              <ExternalButton href={createWhatsAppUrl(generalEnquiryMessage())} variant="whatsapp" size="lg">
                <WhatsAppIcon /> WhatsApp
              </ExternalButton>
              <ExternalButton href={`mailto:${site.email}`} variant="secondary" size="lg">
                <Mail className="size-5" aria-hidden="true" /> Email
              </ExternalButton>
            </div>
          </section>

          <section aria-labelledby="hours-title" className="rounded-(--radius-card) border border-line p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 id="hours-title" className="flex items-center gap-2 text-3xl font-extrabold uppercase">
                <Clock className="size-6 text-brand" aria-hidden="true" /> Trading hours
              </h2>
              <StoreStatus hours={site.tradingHours} className="text-sm" />
            </div>
            <p className="mt-1 text-sm font-semibold text-brand">{site.openDaysLabel}</p>
            <div className="mt-2">
              <TodayHours hours={site.tradingHours} />
            </div>
            <div className="mt-3">
              <TradingHours hours={site.tradingHours} />
            </div>
            <p className="mt-3 text-sm text-muted">{site.tradingHoursNote}</p>
          </section>

          <section aria-labelledby="contact-title" className="rounded-(--radius-card) bg-surface p-5 sm:p-6">
            <h2 id="contact-title" className="text-3xl font-extrabold uppercase">
              Contact
            </h2>
            <dl className="mt-3 grid grid-cols-1 gap-3 text-[0.95rem] sm:grid-cols-2">
              <div>
                <dt className="text-sm text-muted">Telephone</dt>
                <dd>
                  <a href={tel(site.phone)} className="font-semibold hover:text-brand">
                    {site.phone}
                  </a>
                  <br />
                  <a href={tel(site.secondaryPhone)} className="font-semibold hover:text-brand">
                    {site.secondaryPhone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">WhatsApp</dt>
                <dd>
                  <a
                    href={createWhatsAppUrl(generalEnquiryMessage())}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold hover:text-brand"
                  >
                    {site.whatsappDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Email</dt>
                <dd>
                  <a href={`mailto:${site.email}`} className="font-semibold break-all hover:text-brand">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Follow us</dt>
                <dd className="flex gap-4">
                  <a href={site.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-brand">
                    Facebook
                  </a>
                  <a href={site.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-brand">
                    Instagram
                  </a>
                </dd>
              </div>
            </dl>
          </section>
        </div>

        <div className="space-y-6">
          <div className="overflow-hidden rounded-(--radius-card) border border-line">
            <iframe
              title={`Map showing ${site.name}`}
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block aspect-square w-full lg:aspect-[4/5]"
            />
          </div>
          <a
            href={site.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-4 rounded-(--radius-card) border border-line p-5 hover:border-ink"
          >
            <span>
              <span className="flex items-center gap-2">
                <span className="font-display text-4xl font-extrabold">{site.googleRating.toFixed(1)}</span>
                <RatingStars rating={site.googleRating} />
              </span>
              <span className="text-sm text-muted">
                {site.googleReviewCount.toLocaleString("en-ZA")} Google reviews
              </span>
            </span>
            <span className="text-sm font-semibold underline underline-offset-4">View on Google</span>
          </a>
        </div>
      </div>
    </>
  );
}
