"use client";

import { useSyncExternalStore } from "react";
import type { Product } from "@/types/catalogue";

/**
 * Tiny cart store persisted to localStorage.
 *
 * Items keep a snapshot of the product fields needed to render the basket and
 * build the WhatsApp order, so the cart works without refetching the catalogue.
 * For per-kg products, `quantity` is an estimated number of kilograms.
 */

export type CartProduct = Pick<
  Product,
  "slug" | "name" | "category" | "price" | "priceUnit" | "packSize" | "weightLabel" | "availability" | "image"
>;

export interface CartItem extends CartProduct {
  quantity: number;
}

const STORAGE_KEY = "mop-cart-v1";
const MAX_QUANTITY = 99;
const EMPTY: CartItem[] = [];

let items: CartItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed)) items = parsed as CartItem[];
  } catch {
    items = EMPTY;
  }
}

function commit(next: CartItem[]) {
  items = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage can be unavailable (private mode); the cart still works in memory.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    loaded = false;
    load();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return items;
}

function getServerSnapshot() {
  return EMPTY;
}

function clamp(quantity: number) {
  return Math.max(0, Math.min(MAX_QUANTITY, Math.round(quantity)));
}

export const cart = {
  add(product: CartProduct, quantity = 1) {
    load();
    const existing = items.find((i) => i.slug === product.slug);
    if (existing) {
      cart.setQuantity(product.slug, existing.quantity + quantity);
      return;
    }
    commit([...items, { ...pickCartFields(product), quantity: clamp(quantity) || 1 }]);
  },
  setQuantity(slug: string, quantity: number) {
    load();
    const next = clamp(quantity);
    commit(
      next === 0
        ? items.filter((i) => i.slug !== slug)
        : items.map((i) => (i.slug === slug ? { ...i, quantity: next } : i)),
    );
  },
  remove(slug: string) {
    load();
    commit(items.filter((i) => i.slug !== slug));
  },
  clear() {
    commit(EMPTY);
  },
};

function pickCartFields(p: CartProduct): CartProduct {
  return {
    slug: p.slug,
    name: p.name,
    category: p.category,
    price: p.price,
    priceUnit: p.priceUnit,
    packSize: p.packSize,
    weightLabel: p.weightLabel,
    availability: p.availability,
    image: p.image,
  };
}

export function useCart() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useCartItem(slug: string) {
  return useCart().find((i) => i.slug === slug);
}

export function cartTotals(list: CartItem[]) {
  return {
    /** Number of distinct lines — clearer than summing kg and packs together. */
    lineCount: list.length,
    subtotal: list.reduce((sum, i) => sum + i.price * i.quantity, 0),
  };
}

const noopSubscribe = () => () => {};

/** False during prerender/hydration, true once the stored basket can be read. */
export function useCartReady() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
