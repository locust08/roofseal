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
    const copyHeadings = new WeakMap<Element, HTMLElement>();

    function reset() {
      observer?.disconnect();
      updates?.disconnect();
      elements.forEach((element) => {
        element.removeAttribute("data-fade-state");
        element.style.removeProperty("--fade-delay");
      });
      elements = [];
    }

    function observe() {
      reset();
      if (preference.matches || !container) return;
      observer = new IntersectionObserver((entries) => {
        const revealedByParent = new Map<Element | null, number>();
        entries.forEach((entry) => {
          const visible = entry.isIntersecting && entry.intersectionRatio >= 0.08;
          const element = entry.target as HTMLElement;
          // Stagger only siblings entering together, so long grids never
          // accumulate a delay for cards further down the page.
          const sequence = element.getAttribute("data-fade-sequence");
          const position = sequence !== null ? Number(sequence) : revealedByParent.get(element.parentElement) ?? 0;
          const heading = copyHeadings.get(element) || element.previousElementSibling;
          const remaining = heading?.hasAttribute("data-blur-heading")
            ? Math.max(120, Number(heading.getAttribute("data-blur-duration")) - (performance.now() - Number((heading as HTMLElement).dataset.blurStartedAt || performance.now())) + 120)
            : 120;
          const stagger = sequence !== null ? 320 : 120;
          element.style.setProperty("--fade-delay", `${visible ? remaining + Math.min(position, 4) * stagger : 0}ms`);
          if (visible) revealedByParent.set(element.parentElement, position + 1);
          element.setAttribute("data-fade-state", visible ? "visible" : "hidden");
        });
      }, { threshold: 0.08, rootMargin: "-32px 0px -32px 0px" });
      function discover() {
        if (!container) return;
        elements = elements.filter(element => {
          if (container.contains(element)) return true;
          observer?.unobserve(element);
          return false;
        });
        container.querySelectorAll<HTMLElement>("[data-blur-heading]").forEach((heading) => {
          let copy = heading.nextElementSibling || (heading.parentElement?.tagName === "HEADER" ? heading.parentElement.nextElementSibling : null);
          while (copy?.matches("p, ul, ol, .payload-richtext")) {
            copy.setAttribute("data-fade", "");
            copyHeadings.set(copy, heading);
            copy = copy.nextElementSibling;
          }
        });
        const candidates = Array.from(container.querySelectorAll<HTMLElement>(
          "[data-fade], [data-benefit], .section-title, .page-banner h1, .category-card, .cta-copy, section > h2, section > h3",
        ));
        // Animate a composed block once, rather than multiplying opacity on its children.
        const blocks = candidates.filter((element) => !element.hasAttribute("data-blur-heading") && !element.querySelector("[data-blur-heading]"));
        blocks.filter((element) => !blocks.some((parent) => parent !== element && parent.contains(element))).forEach((element) => {
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
