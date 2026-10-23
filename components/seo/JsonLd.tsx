import type { Product } from "@/types/catalogue";
import { siteConfig } from "@/data/site";

function JsonLdScript({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so JSON cannot break out of the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

const schemaDays: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

/** Store details from verified business information only. */
export function LocalBusinessJsonLd() {
  const site = siteConfig;
  const data = {
    "@context": "https://schema.org",
    "@type": "GroceryStore",
    name: site.name,
    description: `${site.descriptor} in ${site.address.suburb}, ${site.address.city}.`,
    url: site.siteUrl,
    telephone: `+27 ${site.phone.replace(/^0/, "")}`,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.suburb,
      addressRegion: site.address.province,
      addressCountry: site.address.country,
    },
    hasMap: site.mapUrl,
    sameAs: [site.socialLinks.facebook, site.socialLinks.instagram],
    openingHoursSpecification: site.tradingHours
      .filter((d) => d.day in schemaDays)
      .flatMap((d) =>
        d.ranges.map((r) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: schemaDays[d.day],
          opens: r.open,
          closes: r.close,
        })),
      ),
  };
  return <JsonLdScript data={data} />;
}

/**
 * Product/Offer data is only emitted once the catalogue is owner-approved
 * (`demoCatalogue: false`), so demo pricing is never published as live inventory.
 */
export function ProductJsonLd({ product }: { product: Product }) {
  if (siteConfig.demoCatalogue) return null;

  const availability = {
    "in-stock": "https://schema.org/InStock",
    "low-stock": "https://schema.org/LimitedAvailability",
    backorder: "https://schema.org/BackOrder",
    "sold-out": "https://schema.org/OutOfStock",
  }[product.availability];

  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    ...(product.image ? { image: new URL(product.image.src, siteConfig.siteUrl).toString() } : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "ZAR",
      price: product.price.toFixed(2),
      availability,
      url: `${siteConfig.siteUrl}/shop/${product.slug}`,
      ...(product.specialValidTo ? { priceValidUntil: product.specialValidTo } : {}),
    },
  };
  return <JsonLdScript data={data} />;
}
