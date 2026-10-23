import { getCategories, getProducts } from "@/lib/data/catalogue";
import { getSiteSettings } from "@/lib/data/site";
import { packLabel } from "@/lib/format";
import { Logo } from "@/components/layout/Logo";
import { DesktopNav, HeaderActions } from "@/components/layout/HeaderControls";
import type { SearchItem } from "@/components/commerce/SearchPanel";

export async function AnnouncementBar() {
  const site = await getSiteSettings();
  return (
    <div className="bg-brand text-white">
      <p className="container-page flex min-h-8 items-center justify-center gap-2 py-1 text-center text-[0.8rem] font-semibold tracking-wide">
        <span>{site.openDaysLabel}</span>
        <span aria-hidden="true">•</span>
        <span className="max-[400px]:hidden">Shop the latest specials</span>
        <span aria-hidden="true" className="max-[400px]:hidden">•</span>
        <span>Reserve on WhatsApp</span>
      </p>
    </div>
  );
}

export async function Header() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const categoryNames = new Map(categories.map((c) => [c.slug, c.shortName]));

  const searchItems: SearchItem[] = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    categoryName: categoryNames.get(p.category) ?? "",
    tags: p.tags,
    price: p.price,
    priceUnit: p.priceUnit,
    pack: packLabel(p),
    image: p.image,
  }));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
        <Logo />
        <DesktopNav />
        <HeaderActions categories={categories} searchItems={searchItems} />
      </div>
    </header>
  );
}
