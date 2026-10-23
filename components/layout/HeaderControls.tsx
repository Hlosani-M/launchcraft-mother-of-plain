"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Phone, Search, ShoppingBasket, ChevronRight } from "lucide-react";
import type { Category } from "@/types/catalogue";
import { siteConfig } from "@/data/site";
import { useCart } from "@/lib/cart";
import { createWhatsAppUrl, generalEnquiryMessage } from "@/lib/whatsapp";
import { categoryHref } from "@/lib/routes";
import { Sheet } from "@/components/ui/Sheet";
import { buttonClasses } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { SearchPanel, type SearchItem } from "@/components/commerce/SearchPanel";
import { primaryNav } from "@/components/layout/navigation";

function isActive(pathname: string, href: string) {
  if (href === "/shop") return pathname === "/shop" || pathname.startsWith("/shop/") || pathname.startsWith("/category/");
  return pathname === href;
}

export function DesktopNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {primaryNav.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative inline-flex min-h-11 items-center px-3 font-display text-lg font-bold tracking-wide uppercase transition-colors hover:text-brand ${active ? "text-brand" : "text-ink"}`}
              >
                {item.label}
                {active && <span className="absolute inset-x-3 bottom-1 h-0.5 bg-brand" aria-hidden="true" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function HeaderActions({
  categories,
  searchItems,
}: {
  categories: Category[];
  searchItems: SearchItem[];
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const items = useCart();
  const count = items.length;

  return (
    <div className="flex items-center gap-0.5 sm:gap-1">
      <button
        type="button"
        onClick={() => setSearchOpen(true)}
        className="flex size-11 items-center justify-center rounded-md hover:bg-surface lg:w-auto lg:gap-2 lg:border lg:border-line lg:px-3 lg:text-sm lg:text-muted"
        aria-label="Search products"
      >
        <Search className="size-5 text-ink" aria-hidden="true" />
        <span className="hidden lg:inline">Search</span>
      </button>

      <Link
        href="/cart"
        className="relative flex size-11 items-center justify-center rounded-md hover:bg-surface"
        aria-label={count ? `Basket, ${count} ${count === 1 ? "item" : "items"}` : "Basket, empty"}
      >
        <ShoppingBasket className="size-6" aria-hidden="true" />
        {count > 0 && (
          <span className="absolute top-1 right-0.5 flex min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[0.7rem] leading-5 font-bold text-white">
            {count}
          </span>
        )}
      </Link>

      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        className="flex size-11 items-center justify-center rounded-md hover:bg-surface lg:hidden"
        aria-label="Open menu"
        aria-expanded={menuOpen}
      >
        <Menu className="size-6" aria-hidden="true" />
      </button>

      <Sheet open={searchOpen} onClose={() => setSearchOpen(false)} title="Search" side="top">
        {searchOpen && (
          <SearchPanel
            items={searchItems}
            categories={categories}
            onNavigate={() => setSearchOpen(false)}
          />
        )}
      </Sheet>

      <Sheet
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title="Menu"
        footer={
          <div className="grid gap-2">
            <a
              href={createWhatsAppUrl(generalEnquiryMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses("whatsapp", "lg", "w-full")}
            >
              <WhatsAppIcon /> Chat on WhatsApp
            </a>
            <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className={buttonClasses("secondary", "lg", "w-full")}>
              <Phone className="size-5" aria-hidden="true" /> Call {siteConfig.phone}
            </a>
          </div>
        }
      >
        <nav aria-label="Mobile">
          <ul className="border-b border-line py-2">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-12 items-center justify-between px-4 font-display text-2xl font-bold uppercase hover:text-brand"
                >
                  {item.label}
                  <ChevronRight className="size-5 text-muted" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <p className="px-4 pt-4 pb-1 text-xs font-semibold tracking-wider text-muted uppercase">
            Shop by category
          </p>
          <ul className="grid grid-cols-2 gap-x-2 px-2 pb-4">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={categoryHref(c.slug)}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-11 items-center rounded-md px-2 text-[0.95rem] font-medium hover:bg-surface"
                >
                  {c.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Sheet>
    </div>
  );
}
