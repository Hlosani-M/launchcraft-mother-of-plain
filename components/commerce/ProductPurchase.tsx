"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, ShoppingBasket } from "lucide-react";
import { cart, useCartItem, type CartProduct } from "@/lib/cart";
import { formatRand, priceUnitLabel } from "@/lib/format";
import {
  backOrderMessage,
  createWhatsAppUrl,
  productEnquiryMessage,
  restockEnquiryMessage,
} from "@/lib/whatsapp";
import { buttonClasses } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { QuantityStepper } from "@/components/commerce/ProductAction";

/** Quantity + primary CTA on the product page, plus the mobile sticky bar. */
export function ProductPurchase({ product }: { product: CartProduct }) {
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const inCart = useCartItem(product.slug);
  const isKg = product.priceUnit === "kg";
  const orderable = product.availability === "in-stock" || product.availability === "low-stock";

  function addToBasket() {
    cart.add(product, quantity);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2000);
  }

  const primary = orderable ? (
    <button type="button" onClick={addToBasket} className={buttonClasses("primary", "lg", "w-full")}>
      {justAdded ? (
        <>
          <Check className="size-5" aria-hidden="true" /> Added to basket
        </>
      ) : (
        <>
          <ShoppingBasket className="size-5" aria-hidden="true" /> Add to basket
        </>
      )}
    </button>
  ) : product.availability === "backorder" ? (
    <a
      href={createWhatsAppUrl(backOrderMessage(product, quantity))}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClasses("whatsapp", "lg", "w-full")}
    >
      <WhatsAppIcon /> Back-order on WhatsApp
    </a>
  ) : (
    <a
      href={createWhatsAppUrl(restockEnquiryMessage(product))}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClasses("secondary", "lg", "w-full")}
    >
      <WhatsAppIcon /> Ask about restock
    </a>
  );

  return (
    <>
      <div className="space-y-3">
        {product.availability !== "sold-out" && (
          <div>
            <p className="mb-1.5 text-sm font-semibold" aria-hidden="true">
              {isKg ? "Quantity (approx. kg)" : "Quantity"}
            </p>
            <div className="max-w-48">
              <QuantityStepper
                label={product.name}
                quantity={quantity}
                unit={isKg ? "kg" : undefined}
                min={1}
                onChange={(q) => setQuantity(Math.max(1, q))}
                className="min-h-12"
              />
            </div>
          </div>
        )}

        {product.availability === "backorder" && (
          <p className="text-sm text-muted">Tell us what you need and the team can confirm availability.</p>
        )}

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {primary}
          {product.availability !== "backorder" && product.availability !== "sold-out" && (
            <a
              href={createWhatsAppUrl(productEnquiryMessage(product))}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses("secondary", "lg", "w-full")}
            >
              <WhatsAppIcon className="size-5 text-wa" /> Ask on WhatsApp
            </a>
          )}
        </div>

        <p aria-live="polite" className="min-h-5 text-sm">
          {inCart && (
            <>
              <span className="font-semibold text-success">
                {inCart.quantity}
                {isKg ? "kg" : ""} in your basket.
              </span>{" "}
              <Link href="/cart" className="font-semibold underline underline-offset-4 hover:text-brand">
                View basket
              </Link>
            </>
          )}
        </p>
      </div>

      {/* Mobile sticky purchase bar */}
      <div aria-hidden="true" className="h-20 lg:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white px-4 pt-3 pb-safe shadow-[0_-4px_16px_rgb(0_0_0/0.08)] lg:hidden">
        <div className="flex items-center gap-3">
          <div className="shrink-0 leading-tight">
            <span className="block font-display text-2xl font-extrabold">{formatRand(product.price)}</span>
            <span className="text-xs font-semibold text-muted">{priceUnitLabel[product.priceUnit]}</span>
          </div>
          <div className="flex-1">{primary}</div>
        </div>
      </div>
    </>
  );
}
