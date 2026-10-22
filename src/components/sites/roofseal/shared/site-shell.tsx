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
import { usePathname } from "next/navigation";
import { asset } from "./assets";
import { categoryHref, parseQuoteItems, type QuoteItem } from "@/cms/view-models";
import { DiagonalButton, Icon } from "./ui";
import { EnquiryContext, useEnquiry } from "./enquiry-context";
import { EnquiryForm, type EnquiryDraft } from "./EnquiryForm";

type QuoteContextValue = {
  items: QuoteItem[];
  addQuote: (product: QuoteItem) => void;
  notify: (text: string) => void;
};
const QuoteContext = createContext<QuoteContextValue>({
  items: [],
  addQuote: () => {},
  notify: () => {},
});
export const useQuote = () => useContext(QuoteContext);

export function SiteShell({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [submitted, setSubmitted] = useState("");
  const [dialogPending, setDialogPending] = useState(false);
  const pendingRef = useRef(false);
  const [contactDraft, setContactDraft] = useState<EnquiryDraft>({});
  const [quoteDraft, setQuoteDraft] = useState<EnquiryDraft>({});
  const dialogOpen = quoteOpen || contactOpen;
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (submitted) panelRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
  }, [submitted]);
  useEffect(() => {
    if (dialogPending) panelRef.current?.focus();
  }, [dialogPending]);
  useEffect(() => {
    let saved: QuoteItem[] = [];
    try { saved = parseQuoteItems(localStorage.getItem("roofseal-quote")); } catch {}
    const frame = requestAnimationFrame(() => setItems(saved));
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (!dialogOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function keyboard(event: KeyboardEvent) {
      if (event.key === "Escape" && !pendingRef.current) { setQuoteOpen(false); setContactOpen(false); }
      if (event.key === "Tab") {
        const controls = panelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not(:disabled), input:not(:disabled):not([tabindex="-1"]), textarea:not(:disabled)');
        if (!controls?.length) { event.preventDefault(); panelRef.current?.focus(); return; }
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener("keydown", keyboard);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", keyboard);
      triggerRef.current?.focus();
    };
  }, [dialogOpen]);
  function openEnquiry() {
    if (pendingRef.current) return;
    triggerRef.current = document.activeElement as HTMLElement;
    setSubmitted(""); setQuoteOpen(false); setContactOpen(true);
  }
  function closeDialog() { if (!pendingRef.current) { setQuoteOpen(false); setContactOpen(false); } }
  function submissionPending(pending: boolean) { pendingRef.current = pending; setDialogPending(pending); }
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
    <QuoteContext.Provider value={{ items, addQuote, notify }}>
      <EnquiryContext.Provider value={openEnquiry}>
      <Header quoteCount={items.length} onQuote={() => { if (pendingRef.current) return; triggerRef.current = document.activeElement as HTMLElement; setSubmitted(""); setContactOpen(false); setQuoteOpen(true); }} />
      {children}
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
      {dialogOpen && (
        <div className="modal-backdrop" onClick={closeDialog}>
          <section
            ref={panelRef}
            role="dialog"
            tabIndex={-1}
            aria-modal="true"
            aria-labelledby="quote-title"
            className="quote-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              disabled={dialogPending}
              autoFocus
              aria-label={contactOpen ? "Close enquiry" : "Close quote list"}
              onClick={closeDialog}
            >
              <Icon name="close" />
            </button>
            <h2 id="quote-title">{contactOpen ? "Contact Us" : "Quote List"}</h2>
            {submitted ? <div role="status" className="enquiry-success"><p>Thank you. Your {quoteOpen ? "quotation request" : "enquiry"} has been received.</p><p>Reference: <strong>{submitted}</strong></p></div> : contactOpen ? <EnquiryForm kind="contact" draft={contactDraft} onDraftChange={setContactDraft} onPendingChange={submissionPending} onSuccess={(reference) => { setContactDraft({}); setSubmitted(reference); }} /> : items.length > 0 ? (
              <>
                {items.map((item) => <div className="quote-item" key={item.id}>
                  <img src={item.image} alt={item.title} />
                  <Link href={`/products/${item.slug}`} onClick={(event) => { if (pendingRef.current) event.preventDefault(); else setQuoteOpen(false); }}>{item.title}</Link>
                  <button disabled={dialogPending} onClick={() => persist(items.filter((other) => other.id !== item.id))}>Remove</button>
                </div>)}
                <EnquiryForm kind="quote" draft={quoteDraft} onDraftChange={setQuoteDraft} onPendingChange={submissionPending} productIds={items.map((item) => item.id)} onSuccess={(reference) => { setQuoteDraft({}); setSubmitted(reference); persist([]); }} />
              </>
            ) : (
              <>
                <p>Your quote list is empty.</p>
                <DiagonalButton
                  href="/metal-roof-system"
                  onClick={() => setQuoteOpen(false)}
                >
                  Browse Products
                </DiagonalButton>
              </>
            )}
          </section>
        </div>
      )}
      </EnquiryContext.Provider>
    </QuoteContext.Provider>
  );
}

function Header({
  quoteCount,
  onQuote,
}: {
  quoteCount: number;
  onQuote: () => void;
}) {
  const openEnquiry = useEnquiry();
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [division, setDivision] = useState<"metal" | "doors">("metal");
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    function close(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenu(false);
        setMobile(false);
      }
    }
    function outside(e: MouseEvent) {
      if (!headerRef.current?.contains(e.target as Node)) {
        setMenu(false);
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
          <button onClick={() => setMenu(!menu)} aria-expanded={menu}>
            Our Products <Icon name="caret-down" />
          </button>
          <Link href="/about#core-values" onClick={close}>
            Why Roofseal
          </Link>
          <Link href="/#projects" onClick={close}>
            Portfolio <Icon name="caret-down" />
          </Link>
          <Link href="/resources" onClick={close}>Resources <Icon name="caret-down" /></Link>
          <button onClick={() => { close(); openEnquiry(); }}>Contact Us</button>
        </nav>
        <DiagonalButton
          icon="shopping-cart"
          onClick={onQuote}
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
        <div className="mega-menu">
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
            <button
              className={division === "doors" ? "active" : ""}
              onClick={() => setDivision("doors")}
              onMouseEnter={() => setDivision("doors")}
            >
              Doors &amp; Frames Division{" "}
              <span className="mega-arrow">
                <Icon name="arrow-right" />
              </span>
            </button>
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
  const openEnquiry = useEnquiry();
  const { notify } = useQuote();
  const groups = [
    {
      title: "Quick Links",
      items: [
        ["About Us", "/about"],
        ["Why Roofseal", "/about#core-values"],
        ["Portfolio", "/#projects"],
        ["Career", "mailto:enquiry@roofseal.com.my"],
        ["Contact Us", "mailto:enquiry@roofseal.com.my"],
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
      items: [
        ["Catalogues", "/resources?type=catalogue"],
        ["News & Events", "/resources?type=article"],
        ["Materials", "/resources?type=material"],
        ["Blogs", "/resources?type=article"],
      ],
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
              <button
                aria-label="Roofseal Facebook"
                onClick={() =>
                  notify(
                    "The Facebook destination was not supplied with this prototype.",
                  )
                }
              >
                <Icon name="facebook" />
              </button>
              <button
                aria-label="Roofseal LinkedIn"
                onClick={() =>
                  notify(
                    "The LinkedIn destination was not supplied with this prototype.",
                  )
                }
              >
                <Icon name="linkedin" />
              </button>
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
                    {name === "Contact Us" ? <button className="footer-link" onClick={openEnquiry}>{name}</button> : href ? (
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
            <button
              onClick={() =>
                notify(
                  "Terms & Conditions were not supplied with this prototype.",
                )
              }
            >
              Terms &amp; Conditions
            </button>
            <span />
            <button
              onClick={() =>
                notify(
                  "Privacy Policy content was not supplied with this prototype.",
                )
              }
            >
              Privacy Policy
            </button>
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
