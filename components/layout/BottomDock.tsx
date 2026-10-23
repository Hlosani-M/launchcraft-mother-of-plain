"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBasket, ArrowRight } from "lucide-react";
import { cartTotals, useCart } from "@/lib/cart";
import { formatRand } from "@/lib/format";
import { createWhatsAppUrl, generalEnquiryMessage } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

/**
 * Coordinates the fixed bottom UI so nothing overlaps:
 * - mobile basket summary bar (when the basket has items)
 * - floating WhatsApp button, lifted above whichever bar is showing
 * Product pages render their own sticky purchase bar on mobile; the cart page
 * has its own WhatsApp CTA, so the floating button is hidden there.
 */
export function BottomDock() {
  const pathname = usePathname();
  const items = useCart();
  const { lineCount, subtotal } = cartTotals(items);

  const isProductPage = /^\/shop\/[^/]+$/.test(pathname);
  const isCart = pathname === "/cart";
  const showBasketBar = lineCount > 0 && !isProductPage && !isCart;

  const waOffset = isProductPage
    ? "bottom-[calc(5.75rem+env(safe-area-inset-bottom))] lg:bottom-6"
    : showBasketBar
      ? "bottom-[calc(5.25rem+env(safe-area-inset-bottom))] lg:bottom-6"
      : "bottom-[calc(1rem+env(safe-area-inset-bottom))] lg:bottom-6";

  return (
    <>
      {!isCart && (
        <a
          href={createWhatsAppUrl(generalEnquiryMessage())}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat to Mother of Plain Foods on WhatsApp"
          className={`fixed right-4 z-30 flex size-14 items-center justify-center rounded-full bg-wa text-white shadow-lg ring-4 ring-white transition-[bottom,transform] hover:scale-105 hover:bg-wa-dark lg:right-6 ${waOffset}`}
        >
          <WhatsAppIcon className="size-7" />
        </a>
      )}

      {showBasketBar && (
        <>
          <div aria-hidden="true" className="h-20 lg:hidden" />
          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white px-4 pt-3 pb-safe shadow-[0_-4px_16px_rgb(0_0_0/0.06)] lg:hidden">
            <Link
              href="/cart"
              className="flex min-h-12 items-center justify-between gap-3 rounded-md bg-ink px-4 text-white"
            >
              <span className="flex items-center gap-2 text-sm font-semibold">
                <ShoppingBasket className="size-5" aria-hidden="true" />
                Basket • {lineCount} {lineCount === 1 ? "item" : "items"} • {formatRand(subtotal)}
              </span>
              <span className="flex items-center gap-1 text-sm font-bold">
                View <ArrowRight className="size-4" aria-hidden="true" />
              </span>
            </Link>
          </div>
        </>
      )}
    </>
  );
}
