"use client";

import { BlurHeading } from "@/components/sites/roofseal/shared/BlurHeading";
import { useState, useRef, type ReactNode } from "react";
import { useQuote } from "../shared/site-shell";

import Link from "next/link";

import { asset } from "../shared/assets";

import { Cta, Icon, SectionTitle } from "../shared/ui";

import s from "./home.module.css";
import { CardSwap, type CardSwapHandle } from "./motion/CardSwap";
import type { BuildingHotspot } from "./building-hotspots";
import { CompanyIntroduction, CompanyDetails } from "../shared/company-copy";
import { portfolioDivisions } from "../portfolio/projects";

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
  const [front, setFront] = useState(0);
  const swap = useRef<CardSwapHandle>(null);
  return (
    <section className={s.hero}>
      <img
        className={s.heroBackground}
        src="/sites/roofseal/shared/hero-shader-background.png"
        alt=""
      />
      <div className={`wide ${s.heroInner}`}>
        <div className={s.heroCopy} data-fade>
          <p>Welcome to Roofseal</p>
          <BlurHeading as="h1">
            Building <span>Lasting Value</span>
          </BlurHeading>
        </div>
        <div className={s.heroCards}>
          <CardSwap ref={swap} width={800} height={600} cardDistance={100} verticalDistance={-100} padding={0} preserveCardSize
            depth={100} skewAmount={0} visibleCards={2} autoplay={false} speed={0.65} bounce={0.25}
            parallax={0} hoverSpread={0} dim={0.8} cardRadius={0} intro={false} onChange={setFront}>
            {[
              { label: "Metal Roofing Division", href: divisionHref, image: a("28585:5690", "imgSubtract1") },
              { label: "Doors & Frames Division", href: "/doors-frames-division", image: "/sites/roofseal/home/hero-doors-frames.webp" },
            ].map((card, index) => <Link
              key={card.href}
              href={card.href}
              draggable={false}
              className={`${s.heroDivisionCard} ${index === 0 ? s.metalHeroCard : ""} ${front === index ? s.frontCard : s.backCard}`}
              role={front === index ? undefined : "button"}
              aria-label={front === index ? card.label : `Show ${card.label} card`}
              onKeyDown={(event) => {
                if (front !== index && event.key === " ") { event.preventDefault(); swap.current?.next(); }
              }}
            >
              <img src={card.image} alt="" draggable={false} />
              <div>{card.label}<RoundArrow /></div>
            </Link>)}
          </CardSwap>
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
            <div data-fade data-fade-sequence={i} key={i}>
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
  const [expanded, setExpanded] = useState(false);
  return (
    <section className={`wide ${s.intro}`}>
      <video
        className={s.manufacturingVideo}
        controls muted playsInline preload="metadata"
        poster={a("28318:3279", "imgSubtract")}
        aria-label="Roofseal metal roofing manufacturing process"
      >
        <source src="/sites/roofseal/video/roofseal-manufacturing.mp4" type="video/mp4" />
        Your browser does not support this video. <a href="/sites/roofseal/video/roofseal-manufacturing.mp4">Download the manufacturing video</a>.
      </video>
      <div>
        <BlurHeading>Best Metal Roofing, Doors &amp; Frames Manufacturer in Malaysia</BlurHeading>
        <CompanyIntroduction />
        {expanded && <div id="home-company-details"><CompanyDetails home /></div>}
        <button className={s.learn} aria-expanded={expanded} aria-controls="home-company-details" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Read Less" : "Read More"} <Icon name={expanded ? "arrow-up" : "chevron-down"} />
        </button>
        {expanded && <Link className={s.aboutLink} href="/about">Learn About Us <Icon name="arrow-right" /></Link>}
      </div>
    </section>
  );
}

function Building({ hotspots }: { hotspots: BuildingHotspot[] }) {
  const [selected, setSelected] = useState<number | null>(() => {
    const index = hotspots.findIndex((point) => point.label === "Metal Door Frame");
    return index < 0 ? null : index;
  });
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const active = selected === null ? undefined : hotspots[selected];
  function closePopup() {
    setSelected(null);
    if (selected !== null) triggers.current[selected]?.focus();
  }
  return (
    <section className={s.building} onKeyDown={(event) => { if (event.key === "Escape" && active) closePopup(); }}>
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
        {hotspots.map((point, i) => (
          <button
            key={point.label}
            ref={(element) => { triggers.current[i] = element; }}
            className={`${s.hotspot} ${selected === i ? s.selected : ""}`}
            style={{ left: `${(point.x / 1240) * 100}%`, top: `${(point.y / 800) * 100}%` }}
            onClick={() => setSelected(selected === i ? null : i)}
            aria-label={`View ${point.label}`}
            title={point.label}
            aria-expanded={selected === i}
            aria-controls={selected === i ? "building-product-information" : undefined}
          ><span /></button>
        ))}
        {active && (
          <div key={active.label} className={s.productPopup} id="building-product-information" role="region" aria-label={active.label}>
            <div><strong>{active.label}</strong><button aria-label="Close product information" onClick={closePopup}><Icon name="close" /></button></div>
            <section>
              <div className={`${s.hotspotArtwork} ${active.brand === "sealframe" ? s.frameArtwork : ""}`}>
                <img src={active.image} alt={active.label} />
                {active.brand && <img className={s.hotspotBrand} src={`/sites/roofseal/hotspots/${active.brand}-logo.webp`} alt="" />}
              </div>
              <Link href={active.href} className={s.learn} aria-label={`Learn more about ${active.label}`}>Learn More <Icon name="chevron-right" /></Link>
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
                  <BlurHeading>{card.title}</BlurHeading>
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
      <BlurHeading>Our Brands</BlurHeading>
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

function Projects() {
  const [tab, setTab] = useState(0);
  const [offset, setOffset] = useState(0);
  const division = portfolioDivisions[tab];
  const projects = division.projects;
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
      <div className={s.projectCarousel}>
        <button
          className={`${s.carouselArrow} ${s.previous}`}
          aria-label="Previous projects"
          onClick={() => setOffset((offset + projects.length - 1) % projects.length)}
        >
          <Icon name="chevron-left" />
        </button>
        <div className={s.projectGrid}>
          {projects.slice(0, 3).map((_, i) => {
            const p = projects[(i + offset) % projects.length];
            return (
              <article data-fade key={p.title}>
                <img src={p.image} alt={p.title} />
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
          onClick={() => setOffset((offset + 1) % projects.length)}
        >
          <Icon name="chevron-right" />
        </button>
      </div>
      <Link className={s.viewProjects} href={`/portfolio/${division.slug}`}>View All {division.title} Projects <Icon name="arrow-right" /></Link>
    </section>
  );
}

export function HomePage({ hotspots }: { hotspots: BuildingHotspot[] }) {
  return (
    <main>
      <Hero />
      <Intro />
      <Building hotspots={hotspots} />
      <Divisions />
      <Brands />
      <Projects />
      <Cta />
    </main>
  );
}
