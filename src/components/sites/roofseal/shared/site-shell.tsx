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
import { DiagonalButton, Icon } from "./ui";

type QuoteContextValue = {
  quoted: boolean;
  addQuote: () => void;
  notify: (text: string) => void;
};
const QuoteContext = createContext<QuoteContextValue>({
  quoted: false,
  addQuote: () => {},
  notify: () => {},
});
export const useQuote = () => useContext(QuoteContext);

export function SiteShell({ children }: { children: ReactNode }) {
  const [quoted, setQuoted] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const value = localStorage.getItem("roofseal-quote");
    if (value === "deck762") {
      requestAnimationFrame(() => setQuoted(true));
    }
  }, []);
  function notify(text: string) {
    setNotice(text);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 5000);
  }
  function addQuote() {
    setQuoted(true);
    localStorage.setItem("roofseal-quote", "deck762");
    notify("Roofseal Deck762 added to your quote list.");
  }
  return (
    <QuoteContext.Provider value={{ quoted, addQuote, notify }}>
      <Header quoteCount={quoted ? 1 : 0} onQuote={() => setQuoteOpen(true)} />
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
      {quoteOpen && (
        <div className="modal-backdrop" onClick={() => setQuoteOpen(false)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-title"
            className="quote-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              autoFocus
              aria-label="Close quote list"
              onClick={() => setQuoteOpen(false)}
            >
              <Icon name="close" />
            </button>
            <h2 id="quote-title">Quote List</h2>
            {quoted ? (
              <>
                <div className="quote-item">
                  <img
                    src={asset("28318:4413", "imgProductImage")}
                    alt="Roofseal Deck762"
                  />
                  <Link
                    href="/products/roofseal-deck762"
                    onClick={() => setQuoteOpen(false)}
                  >
                    Roofseal Deck762
                  </Link>
                  <button
                    onClick={() => {
                      setQuoted(false);
                      localStorage.removeItem("roofseal-quote");
                    }}
                  >
                    Remove
                  </button>
                </div>
                <DiagonalButton href="mailto:enquiry@roofseal.com.my?subject=Roofseal%20Deck762%20quotation">
                  Request a quotation
                </DiagonalButton>
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
  const pathname = usePathname();
  const { notify } = useQuote();
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
    { name: "Insulation" },
    { name: "Gutter & Roof Component" },
    { name: "Structural" },
    { name: "Skylight" },
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
          <button
            onClick={() =>
              notify("Resource pages were not supplied with this prototype.")
            }
          >
            Resources <Icon name="caret-down" />
          </button>
          <a href="mailto:enquiry@roofseal.com.my">Contact Us</a>
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
              Metal Roofing Division <Icon name="caret-down" />
            </Link>
            <button
              className={division === "doors" ? "active" : ""}
              onClick={() => setDivision("doors")}
              onMouseEnter={() => setDivision("doors")}
            >
              Doors &amp; Frames Division <Icon name="caret-down" />
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
                <a href="mailto:enquiry@roofseal.com.my">Metal Door Frames</a>
                <a href="mailto:enquiry@roofseal.com.my">Fire-Rated Door</a>
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
        ["Insulation", ""],
        ["Gutter & Roof Component", ""],
        ["Structural", ""],
        ["Skylights", ""],
      ],
    },
    {
      title: "Doors & Frames Division",
      items: [
        ["Metal Door Frames", "mailto:enquiry@roofseal.com.my"],
        ["Fire-Rated Door", "mailto:enquiry@roofseal.com.my"],
      ],
    },
    {
      title: "Resources",
      items: [
        ["Catalogues", ""],
        ["News & Events", ""],
        ["Materials", ""],
        ["Blogs", ""],
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
