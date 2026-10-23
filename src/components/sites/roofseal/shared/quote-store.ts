"use client";
import { useSyncExternalStore } from "react";
export type QuoteItem = { slug: string; name: string; quantity: number };
const key = "roofseal-quotes";

function read() {
  if (typeof window === "undefined") return "[]";
  return (
    localStorage.getItem(key) ||
    (localStorage.getItem("roofseal-quote") === "deck762"
      ? '[{"slug":"roofseal-deck762","name":"Roofseal Deck762","quantity":1}]'
      : "[]")
  );
}
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(key, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(key, callback);
  };
}
function items(): QuoteItem[] {
  try {
    return JSON.parse(read());
  } catch {
    return [];
  }
}
function save(next: QuoteItem[]) {
  localStorage.setItem(key, JSON.stringify(next));
  localStorage.removeItem("roofseal-quote");
  window.dispatchEvent(new Event(key));
}
export function useQuoteList() {
  const snapshot = useSyncExternalStore(subscribe, read, () => "[]");
  let current: QuoteItem[];
  try {
    current = JSON.parse(snapshot);
  } catch {
    current = [];
  }
  return {
    items: current,
    add(slug: string, name: string) {
      const next = items();
      if (!next.some((i) => i.slug === slug))
        next.push({ slug, name, quantity: 1 });
      save(next);
    },
    remove(slug: string) {
      save(items().filter((i) => i.slug !== slug));
    },
    setQuantity(slug: string, quantity: number) {
      save(
        items().map((i) =>
          i.slug === slug
            ? { ...i, quantity: Math.max(1, Math.floor(quantity) || 1) }
            : i,
        ),
      );
    },
  };
}
