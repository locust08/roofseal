"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import styles from "./page-fades.module.css";

/** Progressive enhancement: content remains visible without JavaScript or motion support. */
export function PageFades({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const container = root.current;
    if (!container || !("IntersectionObserver" in window)) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    let updates: MutationObserver | undefined;
    let elements: HTMLElement[] = [];

    function reset() {
      observer?.disconnect();
      updates?.disconnect();
      elements.forEach((element) => element.removeAttribute("data-fade-state"));
      elements = [];
    }

    function observe() {
      reset();
      if (preference.matches || !container) return;
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          entry.target.setAttribute("data-fade-state", entry.isIntersecting && entry.intersectionRatio >= 0.08 ? "visible" : "hidden");
        });
      }, { threshold: 0.08, rootMargin: "-32px 0px -32px 0px" });
      function discover() {
        if (!container) return;
        const candidates = Array.from(container.querySelectorAll<HTMLElement>(
          "[data-fade], [data-benefit], .section-title, .page-banner h1, .category-card, .cta-copy, section > h2, section > h3",
        ));
        // Animate a composed block once, rather than multiplying opacity on its children.
        candidates.filter((element) => !candidates.some((parent) => parent !== element && parent.contains(element))).forEach((element) => {
          if (elements.includes(element)) return;
          elements.push(element);
          element.setAttribute("data-fade-state", "hidden");
          observer?.observe(element);
        });
      }
      discover();
      // CMS routes can stream additional blocks after the shared shell mounts.
      updates = new MutationObserver(discover);
      updates.observe(container, { childList: true, subtree: true });
    }

    observe();
    preference.addEventListener("change", observe);
    return () => {
      reset();
      preference.removeEventListener("change", observe);
    };
  }, [pathname]);

  return <div ref={root} className={styles.root}>{children}</div>;
}
