import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { CartView } from "@/components/commerce/CartView";

export const metadata: Metadata = {
  title: "Your Basket",
  description: "Review your basket and send your order to Mother of Plain Foods on WhatsApp.",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <>
      <PageHeader crumbs={[{ href: "/", label: "Home" }, { label: "Basket" }]} title="Your basket" />
      <div className="container-page py-8 sm:py-10">
        <CartView />
      </div>
    </>
  );
}
