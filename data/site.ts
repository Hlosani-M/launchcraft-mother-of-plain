import type { SiteSettings } from "@/types/site";

function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

/**
 * Single source of truth for business details.
 *
 * BEFORE PRODUCTION: verify Friday and public-holiday hours with the owner,
 * update the Google rating snapshot, and set `demoCatalogue` to false once the
 * product catalogue and pricing have been approved.
 */
export const siteConfig: SiteSettings = {
  name: "Mother of Plain Foods",
  shortName: "Mother of Plain",
  descriptor: "Butcher • Deli • Seafood • Groceries",
  tagline: "Fresh cuts. Big value.",
  siteUrl: resolveSiteUrl(),
  phone: "021 391 6045",
  secondaryPhone: "021 391 3096",
  whatsapp: "27636851991",
  whatsappDisplay: "063 685 1991",
  email: "info@motherofplain.co.za",
  address: {
    street: "4th Avenue, Polka Place",
    area: "Town Centre",
    suburb: "Mitchell's Plain",
    city: "Cape Town",
    province: "Western Cape",
    country: "ZA",
    oneLine: "4th Avenue, Polka Place, Town Centre, Mitchell's Plain, Cape Town",
  },
  mapUrl: "https://maps.app.goo.gl/aj1D4WfiX5DhaqMP8",
  mapEmbedQuery: "Mother of Plain Foods, Polka Place, Town Centre, Mitchells Plain",
  socialLinks: {
    facebook: "https://www.facebook.com/p/Mother-of-Plain-Foods-100086933032200/",
    instagram: "https://www.instagram.com/motherofplain_mp",
    linktree: "https://linktr.ee/motherofplainfoods",
  },
  // Verify Friday and public-holiday hours with owner before production launch.
  tradingHours: [
    { day: "monday", label: "Monday", ranges: [{ open: "08:00", close: "18:00" }] },
    { day: "tuesday", label: "Tuesday", ranges: [{ open: "08:00", close: "18:00" }] },
    { day: "wednesday", label: "Wednesday", ranges: [{ open: "08:00", close: "18:00" }] },
    { day: "thursday", label: "Thursday", ranges: [{ open: "08:00", close: "18:00" }] },
    {
      day: "friday",
      label: "Friday",
      ranges: [
        { open: "08:00", close: "12:00" },
        { open: "14:00", close: "18:00" },
      ],
    },
    { day: "saturday", label: "Saturday", ranges: [{ open: "08:00", close: "17:00" }] },
    { day: "sunday", label: "Sunday", ranges: [{ open: "08:00", close: "13:00" }] },
    {
      day: "public-holidays",
      label: "Public holidays",
      ranges: [{ open: "08:00", close: "13:00" }],
    },
  ],
  tradingHoursNote: "Hours may change over holiday periods. Call or WhatsApp to confirm.",
  openDaysLabel: "Open 7 days",
  googleRating: 4.1,
  googleReviewCount: 990,
  brand: {
    logo: {
      src: "/brand/logo.png",
      width: 367,
      height: 367,
      inverse: { src: "/brand/logo-white.png", width: 298, height: 254 },
    },
    // The owner's store banner. It contains its own text, so it is never cropped.
    storeImage: {
      src: "/brand/store-banner.jpg",
      width: 1640,
      height: 624,
      alt: "Inside the Mother of Plain Foods store at the checkout tills. Open 365 days of the year. Call 021 391 3096 or 6045, WhatsApp 063 685 1991. 4th Avenue, Polka Place, Town Centre, Mitchell's Plain.",
    },
  },
  demoCatalogue: true,
  demoCatalogueNote:
    "Website demonstration. Prices from the 19th Birthday Bash catalogue (21–31 Oct 2026, while stocks last, E&OE); hamper prices are samples. Images for illustration only.",
};
