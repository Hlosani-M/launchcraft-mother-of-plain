# Mother of Plain Foods: online storefront (MVP)

A mobile-first storefront for **Mother of Plain Foods** (Butcher • Deli • Seafood • Groceries), 4th Avenue, Polka Place, Town Centre, Mitchell's Plain.

Customers browse the butchery, specials and hampers, build a basket, and **send the order to the store on WhatsApp**. The team confirms availability, final pricing and collection. There is no online payment, no login and no database in this version.

Built with Next.js 16 (App Router, Cache Components), TypeScript, Tailwind CSS 4, `next/font` and `lucide-react`. Every page is prerendered. Client JavaScript is limited to the basket, search, filters, menus and the "open now" indicator.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build    # production build (also type-checks)
npm start        # serve the production build
```

## Where things live

| What | Where |
| --- | --- |
| Business details, phone numbers, WhatsApp, address, trading hours, Google rating, `demoCatalogue` | `data/site.ts` |
| Products (from the store's current catalogue) | `data/products.ts` |
| Current promotion (name, dates, terms) | `data/specials.ts` |
| Product photos | `public/products/` |
| Categories | `data/categories.ts` |
| Domain types (Product, Category, SiteSettings) | `types/` |
| Data access (`getProducts`, `getProductBySlug`, `getSpecials`, `getCategories`, `getSiteSettings`, …) | `lib/data/` |
| WhatsApp link + message builders | `lib/whatsapp.ts` |
| Basket store (localStorage) | `lib/cart.ts` |
| Price/unit/date formatting | `lib/format.ts` |
| Brand images | `public/brand/` (see below) |

Pages and components never import the raw data arrays. They go through `lib/data/*`.

### Brand images

All brand assets live in `public/brand/` and are configured in `brand` in `data/site.ts`:

| File | Use |
| --- | --- |
| `logo.png` | The supplied red-square logo. Used in the header |
| `logo-white.png` | White mark on transparent, generated from the logo. Used in the footer and the social share image |
| `store-banner.jpg` | The owner's in-store banner (open 365 days, hours, contact). Shown full-width at the top of the homepage and on the About page |

The favicon (`app/icon.png`) and Apple touch icon (`app/apple-icon.png`) are resized from the logo. The banner has text baked into it, so it is always shown uncropped. If a clean store photo without text becomes available, it can go in the hero instead.

Product photos in `public/products/` are sample images for the MVP: photos supplied for the demo, plus a few openly licensed Wikimedia Commons photos (credited in `data/imageCredits.ts` and on `/credits`, which their licences require). Hamper images are collages of their contents. Products without a clear photo were left out of the demo catalogue rather than shown blurry. To add or replace a photo, drop it in `public/products/` and reference it with `photo()` in `data/products.ts` (`fit: "contain"` for pack shots on white, `"cover"` for full-bleed photos).

### WhatsApp ordering

All links use `https://wa.me/27636851991?text=…` via `createWhatsAppUrl()`. Message templates (general enquiry, product enquiry, back-order, restock, bulk order, search miss, full basket order) are all in `lib/whatsapp.ts`.

Availability drives each product's main button:

| Availability | Button |
| --- | --- |
| `in-stock` | Add to basket |
| `low-stock` | Add to basket + "Limited availability" label |
| `backorder` | Back-order on WhatsApp (product, pack and quantity pre-filled) |
| `sold-out` | Ask about restock (WhatsApp) |

For per-kg products the basket quantity is an **estimated number of kilograms**. The basket and the WhatsApp message both say the final weight and price may vary.

### Demo catalogue mode

`demoCatalogue: true` in `data/site.ts`:

- shows a discreet note on catalogue pages and in the footer: *"Catalogue shown for website demonstration. Product pricing and availability to be confirmed before launch."*
- **turns off Product/Offer JSON-LD**, so sample prices are never published to search engines as live inventory.

Set it to `false` once the owner has approved the catalogue. Store (LocalBusiness) structured data is always on and uses only verified details.

## Deploying to Vercel

1. Push the repo to GitHub and import it in Vercel (framework: Next.js, no extra configuration).
2. Optionally set `NEXT_PUBLIC_SITE_URL` (e.g. `https://www.motherofplain.co.za`) for canonical URLs, the sitemap and Open Graph. If it isn't set, the Vercel production URL is used.

## Future Sanity & Supabase migration

The data layer is shaped for a CMS from day one:

- **Sanity** will replace the static repositories. Each function in `lib/data/catalogue.ts` and `lib/data/site.ts` becomes a GROQ query returning the same types in `types/`, so pages and components stay largely unchanged. Sanity should manage products, categories, specials (with `specialValidFrom` / `specialValidTo`), promotional banners (e.g. the specials page header), homepage sections, trading hours and site settings. Owner edits then publish to the live site through on-demand revalidation. Expired specials should be filtered in the query at that point. Today they are shown with their "Valid until" date.
- **Supabase** is optional and only needed for transactional data: order records, customer profiles, saved baskets, inventory-related records or loyalty. The basket store in `lib/cart.ts` and the order message builder are the natural integration points.
- No Sanity or Supabase code or packages are part of this MVP.

## Before production launch

- [ ] Confirm all prices
- [ ] Confirm the product catalogue
- [ ] Confirm availability states
- [ ] Confirm trading hours are still current (they match the store banner, including Friday 08:00–12:00 / 14:00–18:00 and public holidays 08:00–13:00)
- [ ] Confirm the WhatsApp number (063 685 1991)
- [ ] Confirm phone numbers (021 391 6045 / 021 391 3096)
- [ ] Confirm the delivery/collection policy (the site currently promises neither delivery nor a collection time)
- [ ] Confirm any Halaal or other certification claims with official documentation before adding them
- [ ] Ideally get a higher-resolution or vector logo (the supplied file is 367px)
- [ ] Replace sample photos with the store's own product photography (and remove replaced entries from `data/imageCredits.ts`)
- [ ] Re-add products left out for lack of a clear photo: Henwil 5kg mix portions, Country Range drumsticks, Chapmans seafood mix, pickled corned tongues, cheese, Golden Yolk eggs
- [ ] Confirm prices for items not in the catalogue (hampers, Rainbow leg quarters/drumsticks/thighs are samples)
- [ ] Update `data/specials.ts` and product prices when the next catalogue goes out
- [ ] Update the Google rating / review count in `data/site.ts`
- [ ] Set `demoCatalogue: false`, which also turns on verified Product structured data
