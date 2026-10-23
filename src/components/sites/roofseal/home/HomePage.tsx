"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useQuote } from "../shared/site-shell";

import Link from "next/link";

import { asset } from "../shared/assets";

import { Cta, Icon, SectionTitle } from "../shared/ui";

import s from "./home.module.css";

const a = (node: string, v: string) => asset(node, v);

const divisionHref = "/metal-roofing-division";

function Destination({
  children,
  className,
  label,
  href,
}: {
  children: ReactNode;
  className?: string;
  label: string;
  href?: string;
}) {
  const { notify } = useQuote();
  if (href)
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  return (
    <button
      type="button"
      className={className}
      aria-label={label}
      onClick={() =>
        notify(
          `${label}: the destination screen is not included in the supplied design.`,
        )
      }
    >
      {children}
    </button>
  );
}

function RoundArrow() {
  return (
    <span className={s.round}>
      <Icon name="arrow-right" />
    </span>
  );
}

function Hero() {
  const [doorsInFront, setDoorsInFront] = useState(false);
  return (
    <section className={s.hero}>
      <img
        className={s.heroBackground}
        src="/sites/roofseal/shared/hero-shader-background.png"
        alt=""
      />
      <div className={`wide ${s.heroInner}`}>
        <div className={s.heroCopy}>
          <p>Welcome to Roofseal</p>
          <h1>
            Building <span>Lasting Value</span>
          </h1>
        </div>
        <div className={s.heroCards}>
          {[
            {
              title: "Doors & Frames Division",
              image: "imgSubtract",
              href: "/doors-frames-division",
              front: doorsInFront,
            },
            {
              title: "Metal Roofing Division",
              image: "imgSubtract1",
              href: divisionHref,
              front: !doorsInFront,
            },
          ].map((card) => (
            <article
              key={card.title}
              className={card.front ? s.frontCard : s.backCard}
            >
              <button
                type="button"
                className={s.panelSwap}
                aria-label={`Swap division panels: ${card.title}`}
                aria-pressed={card.front}
                onClick={() => setDoorsInFront((value) => !value)}
              >
                <img src={a("28585:5690", card.image)} alt={card.title} />
              </button>
              <div>
                <span>{card.title}</span>
                <Link href={card.href} aria-label={`Explore ${card.title}`}>
                  <RoundArrow />
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className={s.credentials}>
          {[
            [
              "imgColor",
              <>
                35+ Years of
                <br />
                Experience
              </>,
            ],
            [
              "imgColor1",
              <>
                Customer-Centric
                <br />
                Service
              </>,
            ],
            ["imgColor2", <>Excellent Manufacturing Practice</>],
          ].map(([image, label], i) => (
            <div key={i}>
              <span className={s.credentialIcon}>
                <img src={a("28585:5690", String(image))} alt="" />
              </span>
              <strong>{label}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Intro() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const playSilently = () => {
      video.defaultMuted = true;
      video.muted = true;
      if (document.visibilityState === "visible" && video.paused) {
        void video.play().catch(() => {
          // Retry when ready, visible, or after browser-required user activation.
        });
      }
    };
    video.addEventListener("canplay", playSilently);
    document.addEventListener("visibilitychange", playSilently);
    document.addEventListener("pointerdown", playSilently, { passive: true });
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) playSilently();
    });
    observer.observe(video);
    playSilently();
    return () => {
      observer.disconnect();
      video.removeEventListener("canplay", playSilently);
      document.removeEventListener("visibilitychange", playSilently);
      document.removeEventListener("pointerdown", playSilently);
    };
  }, []);

  return (
    <section className={`wide ${s.intro}`}>
      <video
        ref={videoRef}
        className={s.manufacturingVideo}
        src="/sites/roofseal/shared/manufacturing.mp4"
        poster={a("28318:3279", "imgSubtract")}
        aria-label="Roofseal manufacturing facility"
        autoPlay
        muted
        playsInline
        loop
        preload="metadata"
      />
      <div>
        <h2>Best Metal Roofing, Doors &amp; Frames Manufacturer in Malaysia</h2>
        <p>
          Since its establishment in 1990, Roofseal Malaysia has grown from a
          metal roofing subcontractor into an established manufacturer and
          supplier serving Malaysia’s construction industry. Today, our business
          is built around two core divisions: the <b>Metal Roofing Division</b>{" "}
          and the <b>Doors &amp; Frames Division</b>. We manufacture and supply{" "}
          <b>sheet metal</b> roofing systems, roof insulation solutions, roof
          components, structural products, metal door frames, and fire-rated
          doors for residential, commercial, and industrial applications.
        </p>
        <p>
          Backed by more than three decades of experience, quality coated steel
          materials supplied by NS BlueScope Malaysia, and a skilled workforce,
          Roofseal has built a strong reputation as one of{" "}
          <b>Malaysia’s leading metal roof suppliers</b> while continuing to
          expand its expertise in doors and frames. From complete{" "}
          <b>roofing systems</b> to a dependable <b>home insulation solution</b>
          , our focus is to deliver practical, durable, and reliable building
          products that meet the needs of modern construction projects across
          Malaysia.
        </p>
        <Link className={s.learn} href="/about">
          Learn More <Icon name="chevron-down" />
        </Link>
      </div>
    </section>
  );
}

const points = [
  { x: 514, y: 94, name: "Glass Wool", href: "/glasswool" },
  { x: 620, y: 94, name: "Aluminium Foil", href: "/aluminium-foil" },
  {
    x: 726,
    y: 94,
    name: "Wire Netting",
    href: "/products/hexagonal-galvanised-wire-netting",
  },
  { x: 778, y: 134, name: "Batten", href: "/structural" },
  { x: 864, y: 436, name: "C Section", href: "/structural" },
  { x: 966, y: 436, name: "Shingles Roof", href: "/shingles-roof-system" },
  { x: 687, y: 163, name: "Gutter", href: "/gutter-system" },
  {
    x: 645,
    y: 317,
    name: "Metal Door Frame",
    href: "/products/sealframe-customisable-metal-door-frames",
  },
  { x: 554, y: 456, name: "Skylight Roofing Sheet", href: "/skylights" },
  { x: 463, y: 264, name: "Metal Roofing", href: "/metal-roof-system" },
  {
    x: 386,
    y: 134,
    name: "Corrosion Resistant Roof Fasteners",
    href: "/fasteners",
  },
] as const;

function Building() {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <section className={s.building}>
      <img
        className={s.topEdge}
        src={a("28318:3214", "imgSectionBackground")}
        alt=""
      />
      <SectionTitle description="Roofseal develops and supplies its own range of roofing products and system solutions, built to meet Malaysia’s construction needs with consistent quality, reliability, and practical performance.">
        Built Under the Roofseal Name
      </SectionTitle>
      <div className={s.buildingImage}>
        <img
          className={s.ellipse}
          src={a("28318:3214", "imgEllipse4")}
          alt=""
        />
        <div
          className={s.buildingMask}
          style={{
            maskImage: `url(${a("28318:3214", "imgRoofsealBuilding3")})`,
          }}
        >
          <img
            src={a("28318:3214", "imgRoofsealBuilding2")}
            alt="Cutaway of a building showing Roofseal roofing and door systems"
          />
        </div>
        {points.map(({ x, y, name }, i) => (
          <button
            key={i}
            className={`${s.hotspot} ${selected === i ? s.selected : ""}`}
            style={{ left: `${(x / 1240) * 100}%`, top: `${(y / 800) * 100}%` }}
            onClick={() => setSelected(selected === i ? null : i)}
            aria-label={`View ${name}`}
            aria-expanded={selected === i}
            aria-controls="homepage-product-popup"
          >
            <span />
          </button>
        ))}
        {selected !== null && (
          <div
            className={s.productPopup}
            id="homepage-product-popup"
            role="region"
            aria-label={points[selected].name}
          >
            <div>
              <strong>{points[selected].name}</strong>
              <button
                aria-label="Close product information"
                onClick={() => setSelected(null)}
              >
                <Icon name="close" />
              </button>
            </div>
            <section>
              <div className={s.hotspotImagePlaceholder} aria-hidden="true" />
              <Link href={points[selected].href} className={s.learn}>
                Learn More <Icon name="chevron-right" />
              </Link>
            </section>
          </div>
        )}
      </div>
    </section>
  );
}

const divisions = [
  {
    image: "imgProperty1Default1",
    hover: "28383:5011",
    title: "Metal Roofing Division",
    description:
      "Explore Roofseal’s range of metal roofing systems, sheet metal roofing, roof insulation, skylights, gutters, structural components, and roofing accessories for residential, commercial, and industrial projects in Malaysia.",
  },
  {
    image: "imgProperty1Default",
    hover: "28383:5029",
    title: "Doors & Frames Division",
    description:
      "Discover Roofseal’s metal door frames and fire-rated doors, manufactured for reliable performance, customisable requirements, and a wide range of commercial, residential, and industrial applications.",
  },
];

function Divisions() {
  return (
    <section className={s.divisions}>
      <img
        className={s.divisionBg}
        src={a("28318:3194", "imgSectionBackground")}
        alt=""
      />
      <div className={s.blueOverlay} />
      <img
        className={s.topEdge}
        src={a("28318:3194", "imgSectionBackground1")}
        alt=""
      />
      <div className={`wide ${s.divisionContent}`}>
        <SectionTitle description="Explore Roofseal’s comprehensive range of metal roofing, insulation, doors, and frame solutions designed for residential, commercial, and industrial projects across Malaysia.">
          What We Offer
        </SectionTitle>
        <div className={s.divisionGrid}>
          {divisions.map((card) => (
            <Destination
              href={
                card.title === "Metal Roofing Division"
                  ? divisionHref
                  : "/doors-frames-division"
              }
              label={card.title}
              key={card.title}
              className={s.divisionCard}
            >
              <img src={a("28318:3194", card.image)} alt={card.title} />
              <img
                className={s.hoverImage}
                src={a(card.hover, "imgProperty1Variant2")}
                alt=""
              />
              <div>
                <section>
                  <h2>{card.title}</h2>
                  <p>{card.description}</p>
                </section>
                <RoundArrow />
              </div>
            </Destination>
          ))}
        </div>
      </div>
      <img
        className={s.bottomEdge}
        src={a("28318:3194", "imgSectionBackground2")}
        alt=""
      />
    </section>
  );
}

const brands = [
  {
    image: "imgSubtract2",
    hover: "28520:3146",
    title: "Reliable Metal Roofing Systems",
    name: "Roofseal Metal Roofing",
    copy: " provides quality metal roofing systems, including metal deck and zinc roofing solutions, manufactured for durability, performance, and versatility across residential, commercial, and industrial applications in Malaysia.",
  },
  {
    image: "imgSubtract1",
    hover: "28520:3181",
    title: "Customisable Roofing Components",
    name: "Fix-Fas™",
    copy: " is Roofseal’s range of pressed steel roofing components, including customisable metal gutter systems, flashing, capping, and other roof accessories. Designed for durability, precision, and practical installation, Fix-Fas™ helps deliver reliable roofing solutions for residential, commercial, and industrial applications.",
  },
  {
    image: "imgSubtract",
    hover: "28520:3198",
    title: "Customisable Metal Door Frames",
    name: "Sealframe™",
    copy: " is Roofseal’s range of customisable metal door frames designed to meet modern construction requirements. Manufactured with precision and available in various profiles and specifications, Sealframe™ provides durable, versatile, and reliable door frame solutions for residential, commercial, industrial, and institutional projects.",
  },
  {
    image: "imgSubtract",
    hover: "28520:3215",
    title: "Customisable Metal Doors",
    name: "Sealdor™",
    copy: " offers customisable metal doors engineered for modern construction. Precision-manufactured in a range of profiles, finishes, and specifications, each door delivers lasting durability, dependable performance, and design flexibility for residential, commercial, industrial, and institutional projects.",
  },
];

function Brands() {
  return (
    <section className={`wide ${s.brands}`}>
      <h2>Our Brands</h2>
      <div>
        {brands.map((card) => (
          <Destination key={card.name} label={card.name}>
            <img src={a("28383:5431", card.image)} alt={card.name} />
            <div className={s.brandHover}>
              <img src={a(card.hover, "imgSubtract")} alt="" />
              <section>
                <h3>{card.title}</h3>
                <p>
                  <b>{card.name}</b>
                  {card.copy}
                </p>
              </section>
            </div>
          </Destination>
        ))}
      </div>
    </section>
  );
}

const projects = [
  {
    image: "imgSubtract",
    title: "Adelia 2 Apartment",
    location: "Bangi Avenue, Kajang",
  },
  {
    image: "imgSubtract2",
    title: "Idaman Abadi Condominium",
    location: "Tropicana Heights Kajang",
  },
  {
    image: "imgSubtract3",
    title: "Pavilion Damansara Heights",
    location: "Damansara Heights, Kuala Lumpur",
  },
];

function Projects() {
  const [tab, setTab] = useState(0);
  const [offset, setOffset] = useState(0);
  return (
    <section className={s.projects} id="projects">
      <SectionTitle description="With experience in commercial, residential, industrial, private, and government projects, Roofseal has supported a wide range of roofing, metal doors, frames, and building needs across Malaysia.">
        <span>Projects</span> Across Malaysia
      </SectionTitle>
      <div className={s.tabs} role="tablist" aria-label="Project division">
        {["Metal Roof", "Metal Doors & Frame"].map((label, i) => (
          <button
            key={label}
            role="tab"
            aria-selected={tab === i}
            className={tab === i ? s.active : ""}
            onClick={() => {
              setTab(i);
              setOffset(0);
            }}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === 1 && (
        <p className={s.projectNotice} role="status">
          The supplied prototype does not include Metal Doors &amp; Frame
          project content. Showing the available project references.
        </p>
      )}
      <div className={s.projectCarousel}>
        <button
          className={`${s.carouselArrow} ${s.previous}`}
          aria-label="Previous projects"
          onClick={() => setOffset((offset + 2) % 3)}
        >
          <Icon name="chevron-left" />
        </button>
        <div className={s.projectGrid}>
          {projects.map((_, i) => {
            const p = projects[(i + offset) % projects.length];
            return (
              <article key={p.title}>
                <img src={a("28318:3075", p.image)} alt={p.title} />
                <div
                  style={{
                    backgroundImage: `url(${a("28318:3075", "imgSubtract1")})`,
                  }}
                >
                  <strong>{p.title}</strong>
                  <p>{p.location}</p>
                </div>
              </article>
            );
          })}
        </div>
        <button
          className={`${s.carouselArrow} ${s.next}`}
          aria-label="Next projects"
          onClick={() => setOffset((offset + 1) % 3)}
        >
          <Icon name="chevron-right" />
        </button>
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <main>
      <Hero />
      <Intro />
      <Building />
      <Divisions />
      <Brands />
      <Projects />
      <Cta />
    </main>
  );
}
