import { siteConfig } from "@/data/site";
import type { Product } from "@/types/catalogue";
import { formatRand, formatUnitPrice, packLabel } from "@/lib/format";

/**
 * All WhatsApp messages are generated here so copy stays consistent and is
 * easy to tweak. Links use Meta's documented wa.me format with pre-filled text.
 */

const GREETING = `Hi ${siteConfig.name} 👋`;

export function createWhatsAppUrl(message: string, phone = siteConfig.whatsapp) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

type ProductLike = Pick<Product, "name" | "price" | "priceUnit" | "packSize" | "weightLabel">;

function productLines(product: ProductLike) {
  const pack = packLabel(product);
  return pack ? [product.name, pack] : [product.name];
}

export function generalEnquiryMessage() {
  return `${GREETING} I'm browsing your website and would like some help.`;
}

export function productEnquiryMessage(product: ProductLike) {
  return [
    GREETING,
    "",
    "I'm interested in:",
    "",
    ...productLines(product),
    `Website price: ${formatUnitPrice(product)}`,
    "",
    "Could you please confirm availability?",
    "",
    "Thank you.",
  ].join("\n");
}

export function backOrderMessage(product: ProductLike, quantity = 1) {
  return [
    GREETING,
    "",
    "I'd like to back-order:",
    "",
    ...productLines(product),
    "",
    `Quantity needed: ${quantity}`,
    "",
    "Could you please let me know when it will be available?",
    "",
    "Thank you.",
  ].join("\n");
}

export function restockEnquiryMessage(product: ProductLike) {
  return [
    GREETING,
    "",
    "I see this is sold out on your website:",
    "",
    ...productLines(product),
    "",
    "Could you let me know when it will be back in stock?",
    "",
    "Thank you.",
  ].join("\n");
}

export function bulkOrderMessage(request = "", quantity = "") {
  return [
    GREETING,
    "",
    "I'm interested in placing a bulk order.",
    "",
    "Product / request:",
    request,
    "",
    "Quantity:",
    quantity,
    "",
    "Please let me know availability and collection details.",
    "",
    "Thank you.",
  ].join("\n");
}

export function searchEnquiryMessage(query: string) {
  return `${GREETING} I'm looking for ${query.trim()}. Do you stock it?`;
}

export interface OrderLine extends ProductLike {
  quantity: number;
}

export function orderMessage(lines: OrderLine[]) {
  const items = lines.map((line, i) => {
    const pack = packLabel(line);
    const unit =
      line.priceUnit === "kg"
        ? `approx. ${line.quantity}kg @ ${formatUnitPrice(line)}`
        : `${line.quantity} × ${pack || line.priceUnit}`;
    return `${i + 1}. ${line.name} — ${unit} — ${formatRand(line.price * line.quantity)}`;
  });
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const hasVariableWeight = lines.some((l) => l.priceUnit === "kg");

  return [
    GREETING,
    "",
    "I'd like to reserve the following order:",
    "",
    ...items,
    "",
    `Estimated website subtotal: ${formatRand(subtotal)}`,
    ...(hasVariableWeight ? ["(Per-kg items are estimated. Final weight and price may vary.)"] : []),
    "",
    "Please confirm availability, final pricing and collection details.",
    "",
    "Name:",
    "Preferred collection day:",
    "",
    "Thank you.",
  ].join("\n");
}
