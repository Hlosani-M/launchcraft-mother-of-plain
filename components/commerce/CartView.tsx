"use client";

import Link from "next/link";
import { ShoppingBasket, Trash2 } from "lucide-react";
import { cart, cartTotals, useCart, useCartReady } from "@/lib/cart";
import { formatRand, formatUnitPrice, packLabel } from "@/lib/format";
import { createWhatsAppUrl, orderMessage } from "@/lib/whatsapp";
import { siteConfig } from "@/data/site";
import { buttonClasses } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { QuantityStepper } from "@/components/commerce/ProductAction";
import { ProductThumb } from "@/components/product/ProductImage";

export function CartView() {
  const items = useCart();
  const ready = useCartReady();
  const { lineCount, subtotal } = cartTotals(items);

  if (!ready) {
    return (
      <div className="grid gap-3" aria-busy="true" aria-label="Loading your basket">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-(--radius-card) bg-surface" />
        ))}
      </div>
    );
  }

  if (lineCount === 0) {
    return (
      <div className="mx-auto max-w-md py-10 text-center">
        <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-brand-tint text-brand">
          <ShoppingBasket className="size-10" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-4xl font-extrabold uppercase">Your basket is empty.</h2>
        <p className="mt-2 text-muted">Add a few favourites, then send your order to the team on WhatsApp.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/shop" className={buttonClasses("primary", "lg")}>
            Start shopping
          </Link>
          <Link href="/specials" className={buttonClasses("secondary", "lg")}>
            View specials
          </Link>
        </div>
      </div>
    );
  }

  const hasVariableWeight = items.some((i) => i.priceUnit === "kg");
  const sendHref = createWhatsAppUrl(orderMessage(items));

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_24rem] lg:items-start">
      <section aria-labelledby="basket-items">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="basket-items" className="text-2xl font-bold uppercase">
            {lineCount} {lineCount === 1 ? "item" : "items"}
          </h2>
          <button
            type="button"
            onClick={() => cart.clear()}
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-muted hover:text-brand"
          >
            <Trash2 className="size-4" aria-hidden="true" /> Clear basket
          </button>
        </div>
        <ul className="divide-y divide-line rounded-(--radius-card) border border-line">
          {items.map((item) => {
            const isKg = item.priceUnit === "kg";
            return (
              <li key={item.slug} className="flex gap-3 p-3 sm:gap-4 sm:p-4">
                <ProductThumb product={item} className="size-16 sm:size-20" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link href={`/shop/${item.slug}`} className="font-semibold hover:text-brand">
                        {item.name}
                      </Link>
                      <p className="text-sm text-muted">
                        {packLabel(item) && `${packLabel(item)} • `}
                        {formatUnitPrice(item)}
                      </p>
                    </div>
                    <p className="shrink-0 text-right font-display text-xl font-extrabold">
                      {formatRand(item.price * item.quantity)}
                      {isKg && <span className="block text-xs font-sans font-medium text-muted">estimated</span>}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="w-40">
                      <QuantityStepper
                        label={item.name}
                        quantity={item.quantity}
                        unit={isKg ? "kg" : undefined}
                        min={1}
                        onChange={(q) => cart.setQuantity(item.slug, q)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => cart.remove(item.slug)}
                      className="inline-flex min-h-11 items-center gap-1 px-2 text-sm font-semibold text-muted hover:text-brand"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                      Remove<span className="sr-only"> {item.name}</span>
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <Link href="/shop" className="mt-4 inline-flex min-h-11 items-center font-semibold underline decoration-brand decoration-2 underline-offset-4">
          Continue shopping
        </Link>
      </section>

      <aside aria-labelledby="summary-title" className="rounded-(--radius-card) border-2 border-ink p-5 lg:sticky lg:top-24">
        <h2 id="summary-title" className="text-2xl font-bold uppercase">
          Order summary
        </h2>
        <div className="mt-4 flex items-end justify-between border-b border-line pb-4">
          <span className="font-semibold">Estimated subtotal</span>
          <span className="font-display text-4xl leading-none font-extrabold">{formatRand(subtotal)}</span>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-muted">
          <li>Final price and availability are confirmed by {siteConfig.name}.</li>
          {hasVariableWeight && <li>Per-kg items are estimated. Final amount may vary with packed weight.</li>}
          <li>Collection details will be confirmed by the store.</li>
        </ul>
        <a
          href={sendHref}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses("whatsapp", "lg", "mt-5 hidden w-full text-lg lg:flex")}
        >
          <WhatsAppIcon /> Send order on WhatsApp
        </a>
        <p className="mt-3 hidden text-center text-xs text-muted lg:block">
          Opens WhatsApp with your order ready to send to {siteConfig.whatsappDisplay}.
        </p>
      </aside>

      {/* Mobile sticky send bar */}
      <div aria-hidden="true" className="h-16 lg:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white px-4 pt-3 pb-safe shadow-[0_-4px_16px_rgb(0_0_0/0.08)] lg:hidden">
        <a href={sendHref} target="_blank" rel="noopener noreferrer" className={buttonClasses("whatsapp", "lg", "w-full")}>
          <WhatsAppIcon /> Send order on WhatsApp • {formatRand(subtotal)}
        </a>
      </div>
    </div>
  );
}
