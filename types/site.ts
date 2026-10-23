export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

/** 24-hour "HH:MM" strings. */
export interface TimeRange {
  open: string;
  close: string;
}

export interface TradingDay {
  day: Weekday | "public-holidays";
  label: string;
  ranges: TimeRange[];
}

export interface SiteSettings {
  name: string;
  shortName: string;
  descriptor: string;
  tagline: string;
  siteUrl: string;
  phone: string;
  secondaryPhone: string;
  /** International format without "+" or spaces, as used by wa.me links. */
  whatsapp: string;
  whatsappDisplay: string;
  email: string;
  address: {
    street: string;
    area: string;
    suburb: string;
    city: string;
    province: string;
    postalCode?: string;
    country: string;
    /** Single-line address for maps queries and structured data. */
    oneLine: string;
  };
  mapUrl: string;
  mapEmbedQuery: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    linktree: string;
  };
  tradingHours: TradingDay[];
  tradingHoursNote: string;
  openDaysLabel: string;
  googleRating: number;
  googleReviewCount: number;
  brand: {
    /**
     * Paths under /public, or null to use the text wordmark. `src` is the red
     * square logo; `inverse` is the white mark on transparent for dark surfaces.
     */
    logo: {
      src: string;
      width: number;
      height: number;
      inverse: { src: string; width: number; height: number };
    } | null;
    /** Wide in-store banner shown at its natural aspect ratio, or null to omit it. */
    storeImage: { src: string; width: number; height: number; alt: string } | null;
  };
  /** Shows the discreet demo-catalogue notice and disables Product JSON-LD. */
  demoCatalogue: boolean;
  demoCatalogueNote: string;
}
