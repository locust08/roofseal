"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { asset } from "./assets";
import { categoryHref, parseQuoteItems, type QuoteItem } from "@/cms/view-models";
import { DiagonalButton, Icon } from "./ui";
import { EnquiryContext } from "./enquiry-context";
import type { EnquiryDraft } from "./EnquiryForm";
import { PageFades } from "./PageFades";
import { resourceNavigation } from "@/lib/resource-links";

type QuoteContextValue = {
  items: QuoteItem[];
  addQuote: (product: QuoteItem) => void;
  notify: (text: string) => void;
  ready: boolean;
  removeQuote: (id: number) => void;
  clearQuote: () => void;
  drafts: Record<"contact" | "quote", EnquiryDraft>;
  setDraft: (kind: "contact" | "quote", draft: EnquiryDraft) => void;
};
const QuoteContext = createContext<QuoteContextValue>({
  items: [],
  addQuote: () => {},
  notify: () => {},
  ready: false, removeQuote: () => {}, clearQuote: () => {},
  drafts: { contact: {}, quote: {} }, setDraft: () => {},
});
export const useQuote = () => useContext(QuoteContext);

export function SiteShell({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [drafts, setDrafts] = useState<Record<"contact" | "quote", EnquiryDraft>>({ contact: {}, quote: {} });
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    let saved: QuoteItem[] = [];
    try { saved = parseQuoteItems(localStorage.getItem("roofseal-quote")); } catch {}
    const frame = requestAnimationFrame(() => { setItems(saved); setReady(true); });
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => () => { if (noticeTimer.current) clearTimeout(noticeTimer.current); }, []);
  function openEnquiry() { router.push("/contact-us"); }
  function persist(next: QuoteItem[]) {
    setItems(next);
    try { localStorage.setItem("roofseal-quote", JSON.stringify(next)); } catch {}
  }
  function notify(text: string) {
    setNotice(text);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 5000);
  }
  function addQuote(product: QuoteItem) {
    if (!items.some((item) => item.id === product.id)) {
      persist([...items, { id: product.id, title: product.title, slug: product.slug, image: product.image }]);
    }
    notify(`${product.title} added to your quote list.`);
  }
  return (
    <QuoteContext.Provider value={{ items, addQuote, notify, ready, removeQuote: (id) => persist(items.filter((item) => item.id !== id)), clearQuote: () => persist([]), drafts, setDraft: (kind, draft) => setDrafts((previous) => ({ ...previous, [kind]: draft })) }}>
      <EnquiryContext.Provider value={openEnquiry}>
      <Header quoteCount={items.length} />
      <PageFades>{children}</PageFades>
      <Footer />
      <a
        className="whatsapp-float"
        href="https://wa.me/60126388476"
        target="_blank"
        rel="noreferrer"
        aria-label="Contact Roofseal on WhatsApp"
      >
        <Icon name="whatsapp" />
      </a>
      {notice && (
        <div role="status" className="toast">
          {notice}
          <button
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            <Icon name="close" />
          </button>
        </div>
      )}
      </EnquiryContext.Provider>
    </QuoteContext.Provider>
  );
}

function Header({
  quoteCount,
}: {
  quoteCount: number;
}) {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [division, setDivision] = useState<"metal" | "doors">("metal");
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    function close(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenu(false);
        setPortfolioOpen(false);
        setResourcesOpen(false);
        setMobile(false);
        if (window.matchMedia("(max-width: 1150px)").matches && headerRef.current?.contains(document.activeElement)) {
          headerRef.current.querySelector<HTMLButtonElement>(".mobile-toggle")?.focus();
        }
      }
    }
    function outside(e: MouseEvent) {
      if (!headerRef.current?.contains(e.target as Node)) {
        setMenu(false);
        setPortfolioOpen(false);
        setResourcesOpen(false);
        setMobile(false);
      }
    }
    document.addEventListener("keydown", close);
    document.addEventListener("click", outside);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("click", outside);
    };
  }, []);
  function close() {
    setPortfolioOpen(false);
    setResourcesOpen(false);
    setMenu(false);
    setMobile(false);
  }
  const metal = [
    { name: "Roof Covering", href: "/roof-covering" },
    { name: "Insulation", href: categoryHref("insulation") },
    { name: "Gutter & Roof Component", href: categoryHref("gutter-roof-component") },
    { name: "Structural", href: categoryHref("structural") },
    { name: "Skylights", href: categoryHref("skylights") },
  ];
  return (
    <header
      ref={headerRef}
      className={`site-header ${pathname === "/" ? "home-header" : ""}`}
    >
      <div className="header-inner wide">
        <Link
          href="/"
          onClick={close}
          className="main-logo"
          aria-label="Roofseal Home"
        >
          <img
            src={asset("28318:4175", "imgMainLogo")}
            alt="Roofseal — The Building Solution"
          />
        </Link>
        <nav
          className={mobile ? "main-nav mobile-open" : "main-nav"}
          aria-label="Main navigation"
        >
          <Link href="/about" onClick={close}>
            About Us
          </Link>
          <button className="desktop-products-trigger" onClick={() => { setMenu(!menu); setPortfolioOpen(false); setResourcesOpen(false); }} aria-expanded={menu} aria-controls="desktop-product-menu">
            Our Products <Icon name="caret-down" />
          </button>
          <div className="mobile-products-nav">
            <button onClick={() => { setMenu(!menu); setPortfolioOpen(false); setResourcesOpen(false); }} aria-expanded={menu} aria-controls="mobile-product-menu">
              Our Products <Icon name="caret-down" />
            </button>
            {menu && <nav id="mobile-product-menu" aria-label="Product divisions">
              <div>
                <Link className="mobile-division-link" href="/metal-roofing-division" onClick={close}>Metal Roofing Division</Link>
                <ul>{metal.map((item) => <li key={item.href}><Link href={item.href} onClick={close}>{item.name}</Link></li>)}</ul>
              </div>
              <div>
                <Link className="mobile-division-link" href="/doors-frames-division" onClick={close}>Doors &amp; Frames Division</Link>
                <ul>
                  <li><Link href={categoryHref("metal-door-frames")} onClick={close}>Metal Door Frames</Link></li>
                  <li><Link href={categoryHref("fire-rated-doors-supplier-malaysia")} onClick={close}>Fire-Rated Door</Link></li>
                </ul>
              </div>
            </nav>}
          </div>
          <Link href="/why-roofseal" onClick={close}>
            Why Roofseal
          </Link>
          <div className="portfolio-nav">
            <button onClick={() => { setPortfolioOpen(!portfolioOpen); setMenu(false); setResourcesOpen(false); }} aria-expanded={portfolioOpen} aria-controls="portfolio-menu">Portfolio <Icon name="caret-down" /></button>
            {portfolioOpen && <nav id="portfolio-menu" aria-label="Portfolio divisions">
              <Link href="/portfolio/metal-roof" onClick={close}>Metal Roof</Link>
              <Link href="/portfolio/metal-doors-frames" onClick={close}>Metal Doors &amp; Frame</Link>
            </nav>}
          </div>
          <div className="portfolio-nav">
            <button onClick={() => { setResourcesOpen(!resourcesOpen); setPortfolioOpen(false); setMenu(false); }} aria-expanded={resourcesOpen} aria-controls="resources-menu">Resources <Icon name="caret-down" /></button>
            {resourcesOpen && <nav id="resources-menu" aria-label="Resources sections">{resourceNavigation.map((item) => <Link key={item.href} href={item.href} onClick={close}>{item.label}</Link>)}</nav>}
          </div>
          <Link href="/contact-us" onClick={close}>Contact Us</Link>
        </nav>
        <DiagonalButton
          icon="shopping-cart"
          href="/quote-list"
          className="quote-button"
          ariaLabel="Quote List"
        >
          Quote List
          {quoteCount > 0 && <span className="quote-count">{quoteCount}</span>}
        </DiagonalButton>
        <button
          className="mobile-toggle"
          aria-label={mobile ? "Close navigation" : "Open navigation"}
          aria-expanded={mobile}
          onClick={() => {
            if (mobile) {
              close();
            } else {
              setMobile(true);
            }
          }}
        >
          <Icon name={mobile ? "close" : "bars"} />
        </button>
      </div>
      {menu && (
        <div className="mega-menu" id="desktop-product-menu">
          <div className="mega-divisions">
            <Link
              className={division === "metal" ? "active" : ""}
              href="/metal-roofing-division"
              onMouseEnter={() => setDivision("metal")}
              onFocus={() => setDivision("metal")}
              onClick={close}
            >
              Metal Roofing Division{" "}
              <span className="mega-arrow">
                <Icon name="arrow-right" />
              </span>
            </Link>
            <Link
              className={division === "doors" ? "active" : ""}
              href="/doors-frames-division"
              onClick={close}
              onMouseEnter={() => setDivision("doors")}
              onFocus={() => setDivision("doors")}
            >
              Doors &amp; Frames Division{" "}
              <span className="mega-arrow">
                <Icon name="arrow-right" />
              </span>
            </Link>
          </div>
          <div className="mega-categories">
            {division === "metal" ? (
              <>
                <Link
                  href="/metal-roofing-division"
                  className="division-overview"
                  onClick={close}
                >
                  View Metal Roofing Division <Icon name="arrow-right" />
                </Link>
                {metal.map((x) =>
                  x.href ? (
                    <Link key={x.name} href={x.href} onClick={close}>
                      {x.name}
                    </Link>
                  ) : (
                    <a key={x.name} href="mailto:enquiry@roofseal.com.my">
                      {x.name}
                    </a>
                  ),
                )}
              </>
            ) : (
              <>
                <Link href="/doors-frames-division" className="division-overview" onClick={close}>
                  View Doors &amp; Frames Division <Icon name="arrow-right" />
                </Link>
                <Link href={categoryHref("metal-door-frames")} onClick={close}>Metal Door Frames</Link>
                <Link href={categoryHref("fire-rated-doors-supplier-malaysia")} onClick={close}>Fire-Rated Door</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const { notify } = useQuote();
  const groups = [
    {
      title: "Quick Links",
      items: [
        ["About Us", "/about"],
        ["Why Roofseal", "/why-roofseal"],
        ["Portfolio", "/#projects"],
        ["Career", "/career"],
        ["Contact Us", "/contact-us"],
      ],
    },
    {
      title: "Metal Roofing Division",
      items: [
        ["Roof Covering", "/roof-covering"],
        ["Insulation", categoryHref("insulation")],
        ["Gutter & Roof Component", categoryHref("gutter-roof-component")],
        ["Structural", categoryHref("structural")],
        ["Skylights", categoryHref("skylights")],
      ],
    },
    {
      title: "Doors & Frames Division",
      items: [
        ["Metal Door Frames", categoryHref("metal-door-frames")],
        ["Fire-Rated Door", categoryHref("fire-rated-doors-supplier-malaysia")],
      ],
    },
    {
      title: "Resources",
      items: resourceNavigation.map((item) => [item.label, item.href]),
    },
  ];
  return (
    <footer className="site-footer">
      <div className="footer-inner wide">
        <div className="footer-top">
          <div>
            <Link href="/" className="main-logo">
              <img src={asset("28318:4045", "imgMainLogo")} alt="Roofseal" />
            </Link>
            <div className="social-links">
              <a aria-label="Roofseal Facebook" href="https://www.facebook.com/roofsealmalaysia/" target="_blank" rel="noreferrer">
                <Icon name="facebook" />
              </a>
              <a aria-label="Roofseal LinkedIn" href="https://www.linkedin.com/company/roofseal-resources-m-sdn-bhd/home/" target="_blank" rel="noreferrer">
                <Icon name="linkedin" />
              </a>
            </div>
          </div>
          <div className="newsletter">
            <h3>Stay Updated with Our Newsletter</h3>
            <p>
              Subscribe to get the latest news, insights, and exclusive offers
              directly to your inbox.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                notify(
                  "Thank you. Newsletter signup is a local preview; your email has not been submitted.",
                );
                e.currentTarget.reset();
              }}
            >
              <label className="sr-only" htmlFor="newsletter-email">
                Email
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="EMAIL"
                required
              />
              <DiagonalButton type="submit" icon="envelope" corner="white">
                Submit
              </DiagonalButton>
            </form>
          </div>
        </div>
        <div className="footer-columns">
          {groups.map((group) => (
            <div key={group.title}>
              <h3>{group.title}</h3>
              <ul>
                {group.items.map(([name, href]) => (
                  <li key={name}>
                    {href ? (
                      <Link href={href}>{name}</Link>
                    ) : (
                      <button
                        className="footer-link"
                        onClick={() =>
                          notify(
                            `${name} content was not supplied with this prototype.`,
                          )
                        }
                      >
                        {name}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="contact-details">
            <h3>Contact Details</h3>
            <p>
              <Icon name="map-marker-alt" />
              <span>
                No.1 &amp; 1-A, Jalan 1/7,Seksyen 1,
                <br />
                Bandar Teknologi Kajang,
                <br />
                43500 Semenyih, Selangor, Malaysia
              </span>
            </p>
            <p>
              <Icon name="envelope" />
              <a href="mailto:enquiry@roofseal.com.my">
                enquiry@roofseal.com.my
              </a>
            </p>
            <p>
              <Icon name="phone" />
              <span>
                <a href="tel:+60387234776">+(60)3 8723 4776</a>
                <br />
                <a href="tel:+60126388476">+(60)12 638 8476</a>
              </span>
            </p>
            <p>
              <Icon name="fax" />
              <span className="hours">
                <span>
                  <strong>Weekdays</strong>
                  <br />
                  8.30AM - 5PM
                </span>
                <span>
                  <strong>Sunday</strong>
                  <br />
                  8.30AM - 12.30PM
                </span>
              </span>
            </p>
          </div>
        </div>
        <div className="footer-credits">
          <div className="legal-links">
            <Link href="/terms-and-conditions">
              Terms &amp; Conditions
            </Link>
            <span />
            <Link href="/privacy-policy">
              Privacy Policy
            </Link>
          </div>
          <div>
            <p>
              © 2026 Roofseal (M) Sdn. Bhd. 0209374K (199001017705) | All
              rights reserved.
            </p>
            <p className="attribution">
              Disclaimer: Some images on this website are sourced from Freepik,
              Unsplash &amp; Flaticon. We strive to adhere to mentioned
              resource’s terms of use and provide proper attribution. If there
              are any concerns about the usage of these images, please contact
              us directly. We appreciate the contributions of mentioned
              resources.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
