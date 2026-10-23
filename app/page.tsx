import { getCategories, getHampers, getProducts, getSpecials } from "@/lib/data/catalogue";
import { getSiteSettings } from "@/lib/data/site";
import type { CategorySlug } from "@/types/catalogue";
import { Hero } from "@/components/home/Hero";
import {
  BackOrderSection,
  CategorySection,
  FinalCta,
  HampersSection,
  QuickInfoStrip,
  SpecialsSection,
  VisitSection,
  WhySection,
} from "@/components/home/Sections";

export default async function HomePage() {
  const [site, categories, products, specials, hampers] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getProducts(),
    getSpecials(),
    getHampers(),
  ]);

  const featuredSpecials = specials.filter((p) => p.isFeatured);
  const counts = new Map<CategorySlug, number>();
  for (const p of products) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);

  return (
    <>
      <Hero site={site} specials={featuredSpecials.slice(0, 4)} />
      <QuickInfoStrip site={site} />
      <CategorySection categories={categories} counts={counts} />
      <SpecialsSection specials={featuredSpecials.slice(0, 8)} categories={categories} />
      <HampersSection hampers={hampers.slice(0, 3)} />
      <BackOrderSection />
      <WhySection />
      <VisitSection site={site} />
      <FinalCta />
    </>
  );
}
