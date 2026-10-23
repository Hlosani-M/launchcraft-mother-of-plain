import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { getCategories } from "@/lib/data/catalogue";
import { getSiteSettings } from "@/lib/data/site";
import { categoryHref } from "@/lib/routes";
import { createWhatsAppUrl, generalEnquiryMessage } from "@/lib/whatsapp";
import { Logo } from "@/components/layout/Logo";
import { TradingHours } from "@/components/store/TradingHours";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { primaryNav } from "@/components/layout/navigation";

export async function Footer() {
  const [site, categories] = await Promise.all([getSiteSettings(), getCategories()]);
  const tel = (n: string) => `tel:${n.replace(/\s/g, "")}`;

  return (
    <footer className="bg-ink text-white">
      <div className="container-page grid grid-cols-1 gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:py-16">
        <div className="space-y-4">
          <Logo inverse />
          <p className="font-display text-lg font-semibold tracking-wide text-white/80 uppercase">
            {site.descriptor}
          </p>
          <address className="space-y-3 text-sm text-white/80 not-italic">
            <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className="flex gap-3 hover:text-white">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>
                {site.address.street}
                <br />
                {site.address.area}, {site.address.suburb}
                <br />
                {site.address.city}
              </span>
            </a>
            <a href={tel(site.phone)} className="flex items-center gap-3 hover:text-white">
              <Phone className="size-4 shrink-0" aria-hidden="true" />
              {site.phone} / {site.secondaryPhone}
            </a>
            <a
              href={createWhatsAppUrl(generalEnquiryMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:text-white"
            >
              <WhatsAppIcon className="size-4 shrink-0" />
              WhatsApp {site.whatsappDisplay}
            </a>
            <a href={`mailto:${site.email}`} className="flex items-center gap-3 hover:text-white">
              <Mail className="size-4 shrink-0" aria-hidden="true" />
              {site.email}
            </a>
          </address>
        </div>

        <nav aria-label="Footer">
          <h2 className="mb-3 text-lg font-bold tracking-wide uppercase">Shop</h2>
          <ul className="space-y-1 text-sm text-white/80">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={categoryHref(c.slug)} className="inline-block py-1 hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-3 text-lg font-bold tracking-wide uppercase">Explore</h2>
          <ul className="space-y-1 text-sm text-white/80">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-block py-1 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/cart" className="inline-block py-1 hover:text-white">
                Your basket
              </Link>
            </li>
            <li>
              <a href={site.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="inline-block py-1 hover:text-white">
                Facebook
              </a>
            </li>
            <li>
              <a href={site.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="inline-block py-1 hover:text-white">
                Instagram
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-bold tracking-wide uppercase">Trading hours</h2>
          <div className="[&_dl]:divide-white/15">
            <TradingHours hours={site.tradingHours} compact />
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-white/65 sm:flex-row sm:justify-between">
          <p>
            {site.name} • {site.address.suburb}, {site.address.city}
          </p>
          <p>
            {site.demoCatalogue && <>{site.demoCatalogueNote} </>}
            <Link href="/credits" className="underline underline-offset-2 hover:text-white">
              Image credits
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
