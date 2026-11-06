"use client";

import { Children, cloneElement, isValidElement, useEffect, useRef, type CSSProperties, type HTMLAttributes, type ReactElement, type ReactNode } from "react";
import styles from "./blur-heading.module.css";

type Props = HTMLAttributes<HTMLHeadingElement> & { as?: "h1" | "h2" };

function headingText(content: ReactNode): string {
  return Children.toArray(content).map(child => {
    if (typeof child === "string" || typeof child === "number") return String(child);
    if (isValidElement(child)) return child.type === "br" ? " " : headingText((child as ReactElement<{ children?: ReactNode }>).props.children);
    return "";
  }).join("");
}

/** Word-by-word blur reveal based on React Bits Blur Text's soft-focus effect.
 * https://reactbits.dev/text-animations/blur-text
 * Keep the actual heading element, inline emphasis, spaces and line breaks.
 */
export function BlurHeading({ as: Tag = "h2", children, ...props }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  let words = 0;
  const textKey = headingText(children).replace(/\s+/g, " ").trim();
  function pieces(content: ReactNode): ReactNode {
    return Children.map(content, (child): ReactNode => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child).split(/(\s+)/).map((part, index) => {
          if (!part.trim()) return part;
          const delay = Math.min(words++ * 90, 1200);
          return <span data-blur-word className={styles.word} style={{ "--word-delay": `${delay}ms` } as CSSProperties} key={index}>{part}</span>;
        });
      }
      if (isValidElement(child) && typeof child.type === "string") {
        const element = child as ReactElement<{ children?: ReactNode }>;
        return element.props.children === undefined ? element : cloneElement(element, undefined, pieces(element.props.children));
      }
      return child;
    });
  }
  const content = pieces(children);
  const duration = 900 + Math.min(Math.max(0, words - 1) * 90, 1200);

  useEffect(() => {
    const heading = ref.current;
    if (!heading || !("IntersectionObserver" in window)) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    function observe() {
      observer?.disconnect();
      heading!.removeAttribute("data-blur-state");
      delete heading!.dataset.blurStartedAt;
      if (preference.matches) return;
      heading!.dataset.blurState = "hidden";
      observer = new IntersectionObserver(([entry]) => {
        const visible = entry.isIntersecting;
        if (visible && heading!.dataset.blurState !== "visible") heading!.dataset.blurStartedAt = String(performance.now());
        heading!.dataset.blurState = visible ? "visible" : "hidden";
      }, { threshold: 0.1, rootMargin: "-32px 0px -32px 0px" });
      observer.observe(heading!);
    }
    observe();
    preference.addEventListener("change", observe);
    return () => { observer?.disconnect(); preference.removeEventListener("change", observe); heading.removeAttribute("data-blur-state"); };
  }, [textKey]);

  return <Tag {...props} aria-label={props["aria-label"] ?? textKey} ref={ref} data-blur-heading data-blur-duration={duration}>{content}</Tag>;
}
