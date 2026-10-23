"use client";

import { Minus, Plus, ShoppingBasket } from "lucide-react";
import { cart, useCartItem, type CartProduct } from "@/lib/cart";
import { backOrderMessage, createWhatsAppUrl, restockEnquiryMessage } from "@/lib/whatsapp";
import { buttonClasses } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

/**
 * The primary action for a product, driven by availability:
 * in stock / low stock → add to basket (becomes a stepper once added)
 * back order → WhatsApp back-order; sold out → WhatsApp restock enquiry.
 */
export function ProductAction({
  product,
  compact = false,
}: {
  product: CartProduct;
  compact?: boolean;
}) {
  const inCart = useCartItem(product.slug);
  const height = compact ? "min-h-11" : "min-h-12";

  if (product.availability === "backorder") {
    return (
      <a
        href={createWhatsAppUrl(backOrderMessage(product))}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses("whatsapp", "md", `w-full ${height}`)}
      >
        <WhatsAppIcon className="size-4" />
        {compact ? (
          <span>
            Back-order<span className="hidden xl:inline"> on WhatsApp</span>
          </span>
        ) : (
          "Back-order on WhatsApp"
        )}
      </a>
    );
  }

  if (product.availability === "sold-out") {
    return (
      <a
        href={createWhatsAppUrl(restockEnquiryMessage(product))}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses("secondary", "md", `w-full ${height}`)}
      >
        <WhatsAppIcon className="size-4" />
        Ask about restock
      </a>
    );
  }

  if (inCart) {
    return (
      <QuantityStepper
        label={product.name}
        quantity={inCart.quantity}
        unit={product.priceUnit === "kg" ? "kg" : undefined}
        onChange={(q) => cart.setQuantity(product.slug, q)}
        className={height}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => cart.add(product)}
      className={buttonClasses("primary", "md", `w-full ${height}`)}
    >
      <ShoppingBasket className="size-4" aria-hidden="true" />
      {compact ? (
        <span>
          Add<span className="hidden sm:inline"> to basket</span>
        </span>
      ) : (
        "Add to basket"
      )}
      <span className="sr-only">: {product.name}</span>
    </button>
  );
}

export function QuantityStepper({
  label,
  quantity,
  unit,
  onChange,
  min = 0,
  className = "min-h-11",
}: {
  label: string;
  quantity: number;
  unit?: string;
  onChange: (quantity: number) => void;
  min?: number;
  className?: string;
}) {
  return (
    <div
      className={`flex w-full items-stretch overflow-hidden rounded-md border-2 border-ink bg-white ${className}`}
      role="group"
      aria-label={`Quantity for ${label}`}
    >
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        disabled={quantity <= min}
        className="flex w-11 shrink-0 items-center justify-center hover:bg-surface disabled:opacity-40"
        aria-label={quantity === 1 && min === 0 ? `Remove ${label} from basket` : "Decrease quantity"}
      >
        <Minus className="size-4" aria-hidden="true" />
      </button>
      <output
        className="flex flex-1 items-center justify-center text-sm font-bold tabular-nums"
        aria-live="polite"
      >
        {quantity}
        {unit ?? ""}
        {min === 0 && <span className="ml-1 font-medium text-muted max-[360px]:sr-only">in basket</span>}
      </output>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        disabled={quantity >= 99}
        className="flex w-11 shrink-0 items-center justify-center hover:bg-surface disabled:opacity-40"
        aria-label="Increase quantity"
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
