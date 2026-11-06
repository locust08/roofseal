"use client";
import { BlurHeading } from "@/components/sites/roofseal/shared/BlurHeading";
import { useState, useSyncExternalStore, type CSSProperties } from "react";
import { asset } from "../shared/assets";
import { Breadcrumbs, Icon } from "../shared/ui";
import styles from "./about.module.css";
import { CompanyIntroduction, CompanyDetails } from "../shared/company-copy";
const a = (node: string, name: string) => asset(`28318:${node}`, name);
const values = [
  ["Quality & Reliability", "imgColor4"],
  ["Customer Commitment", "imgColor5"],
  ["Innovation & Practical Solutions", "imgColor"],
  ["Integrity & Professionalism", "imgColor1"],
  ["Continuous Improvement", "imgColor2"],
  ["Safety & Responsibility", "imgColor3"],
];
const milestones = [
  [
    "1990",
    "Established as a metal roofing subcontractor in Malaysia",
    "imgImage214",
  ],
  [
    "2000",
    "Expanded into trading & stockist of metal roofing, insulation and roof related products",
    "imgImage215",
  ],
  [
    "2005",
    "Expanded into manufacturing of lightweight steel roof trusses, customizable gutter, flashing, capping & other roof accessories",
    "imgImage216",
  ],
];
function subscribeMilestoneLayout(callback: () => void) {
  const query = window.matchMedia("(max-width: 1100px)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const compactMilestones = () => window.matchMedia("(max-width: 1100px)").matches;
const desktopMilestones = () => false;
const environmental = [
  "Promote energy-efficient roofing and insulation systems that help reduce heat transfer and energy consumption",
  "Encourage the use of durable and recyclable metal roofing materials for long-term sustainability",
  "Continuously improve manufacturing efficiency to minimise material wastage and environmental impact",
];
const esgCommitments = [
  { title: "Environmental", bullets: environmental },
  { title: "Social", bullets: [
    "Safe and healthy working environment",
    "Long-term relationships with clients, suppliers and business partners",
    "Workforce development",
    "Training and skills improvement",
  ] },
  { title: "Governance", bullets: [
    "Ethical business practices",
    "Transparency and accountability",
    "Compliance with industry standards, safety regulations and quality requirements",
    "Continuous improvement and operational excellence",
  ] },
];
export function AboutPage() {
  const [expanded, setExpanded] = useState(false);
  const [offset, setOffset] = useState(milestones.length);
  const [sliding, setSliding] = useState(false);
  const compact = useSyncExternalStore(subscribeMilestoneLayout, compactMilestones, desktopMilestones);
  const visibleMilestones = compact ? 2 : 3;
  const [esg, setEsg] = useState(0);
  function moveMilestones(direction: -1 | 1) {
    if (sliding) return;
    const next = offset + direction;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOffset(milestones.length + ((next % milestones.length) + milestones.length) % milestones.length);
      return;
    }
    setSliding(true);
    setOffset(next);
  }
  return (
    <main className={styles.about}>
      <Breadcrumbs items={[{ label: "About Us" }]} />
      <section className={styles.intro}>
        <img
          className={styles.introBackground}
          src={a("3860", "imgSectionBackground")}
          alt=""
        />
        <div className={`wide ${styles.introGrid}`}>
          <div className={styles.introCopy}>
            <BlurHeading as="h1">
              A <em>Trusted Manufacturer of Metal Roofing</em>,
              <em> Doors &amp; Frames</em> In Malaysia
            </BlurHeading>
            <CompanyIntroduction />
            {expanded && <div id="about-company-details"><CompanyDetails /></div>}
            <button
              className={styles.readMore}
              aria-expanded={expanded}
              aria-controls="about-company-details"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Read Less" : "Read More"}{" "}
              <Icon name={expanded ? "arrow-up" : "chevron-down"} />
            </button>
          </div>
          <div className={styles.collage}>
            <div className={styles.collageTop}>
              <img
                src={a("3860", "imgSectionBackground4")}
                alt="Roofseal manufacturing facility"
              />
            </div>
            <div className={styles.collageBottom}>
              <img
                src={a("3860", "imgSectionBackground3")}
                alt="Roofseal metal roofing manufacturing"
              />
            </div>
            <div className={styles.collageRight}>
              <img
                src={a("3860", "imgSectionBackground1")}
                alt="Roofseal industrial roofing"
              />
            </div>
            <img
              className={styles.decor}
              src={a("3860", "imgGroup1171274887")}
              alt=""
            />
            <img
              className={styles.decorSmall}
              src={a("3860", "imgGroup1171274886")}
              alt=""
            />
          </div>
        </div>
      </section>
      <section className={styles.values} id="core-values">
        <div className={styles.responsiveValuesBackground} aria-hidden="true">
          <img src="/sites/roofseal/about/core-values-mobile.webp" alt="" />
        </div>
        <img
          className={styles.valuesBackground}
          src="/sites/roofseal/about/core-values-desktop.webp"
          alt=""
        />
        <div className={`wide ${styles.valuesGrid}`}>
          <div className={styles.core}>
            <BlurHeading>
              <em>Core Values</em>
            </BlurHeading>
            <div className={styles.valueGrid}>
              {values.map(([label, img]) => (
                <article data-fade key={label}>
                  <div className={styles.valueIcon}>
                    <span style={{ maskImage: `url(${a("3878", img)})` }} />
                  </div>
                  <h3>{label}</h3>
                </article>
              ))}
            </div>
          </div>
          <div className={styles.statements}>
            {[
              [
                "Our Vision",
                "imgColor6",
                "To become a trusted and leading roofing solutions provider locally and internationally through innovation, quality workmanship, and continuous improvement.",
              ],
              [
                "Our Mission",
                "imgColor7",
                "To provide high-quality and reliable roofing solutions that meet industry standards while delivering value-added products and services to our clients.",
              ],
            ].map(([title, img, copy]) => (
              <article key={title}>
                <header>
                  <div className={styles.valueIcon}>
                    <span style={{ maskImage: `url(${a("3878", img)})` }} />
                  </div>
                  <BlurHeading>{title}</BlurHeading>
                </header>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className={styles.team}>
        <img
          className={styles.teamLayer}
          src={a("3787", "imgSectionBackground1")}
          alt=""
        />
        <img
          className={styles.teamPhoto}
          src={a("3787", "imgSectionBackground2")}
          alt="Roofseal team"
        />
        <div className={styles.teamCopy}>
          <BlurHeading>
            <em>Experienced Roofing Specialists </em>Behind Every Solution
          </BlurHeading>
          <p>
            Our team brings practical industry knowledge, technical experience,
            and strong product understanding to support every roofing,
            insulation, and metal frame requirement.
          </p>
        </div>
        <img
          className={styles.bottomCut}
          src={a("3787", "imgSectionBackground3")}
          alt=""
        />
      </section>
      <section className={styles.certificates}>
        <div className={`narrow ${styles.certGrid}`}>
          <div>
            <BlurHeading>
              <em>Quality Standards</em>
              <br />
              You Can Rely On
            </BlurHeading>
            <p>
              Roofseal is committed to maintaining reliable product quality,
              proper manufacturing practices, and trusted material standards to
              support construction projects across Malaysia.
            </p>
            <div className={styles.logos}>
              {["imgImage264", "imgImage263", "imgImage262"].map((img, i) => (
                <div key={img} className={styles[`logo${i}`]}>
                  <img
                    src={a("3774", img)}
                    alt={
                      [
                        "Quality certification",
                        "BlueScope certification",
                        "Industry certification",
                      ][i]
                    }
                  />
                </div>
              ))}
            </div>
          </div>
          <div className={styles.certificateImages}>
            {["imgImage252", "imgImage268"].map((img, i) => (
              <div key={img}>
                <img
                  className={
                    i ? styles.certificateSecond : styles.certificateFirst
                  }
                  src={a("3774", img)}
                  alt="Roofseal quality certificate"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className={styles.milestones}>
        <img
          className={styles.topCut}
          src={a("3735", "imgSectionBackground")}
          alt=""
        />
        <div className="narrow">
          <div className={styles.centerHeading}>
            <BlurHeading>
              Over 30 Years of Roofing <em>Experience</em>
            </BlurHeading>
            <p>
              Since 1990, Roofseal has grown from a metal roofing subcontractor
              into a trusted manufacturer and supplier of complete roofing
              system solutions in Malaysia.
            </p>
          </div>
          <div className={styles.timeline}>
            <div className={styles.timelineLine} />
            <button
              className={`${styles.timelineArrow} ${styles.previous}`}
              onClick={() => moveMilestones(-1)}
              disabled={sliding}
              aria-label="Previous milestones"
            >
              <Icon name="chevron-left" />
            </button>
            <button
              className={`${styles.timelineArrow} ${styles.next}`}
              onClick={() => moveMilestones(1)}
              disabled={sliding}
              aria-label="Next milestones"
            >
              <Icon name="chevron-right" />
            </button>
            <div className={styles.milestoneViewport} aria-label="Roofseal milestones" aria-roledescription="carousel">
            <div
              className={styles.milestoneCards}
              data-sliding={sliding}
              style={{ "--milestone-index": offset } as CSSProperties}
              onTransitionEnd={(event) => {
                if (event.target !== event.currentTarget || event.propertyName !== "transform") return;
                // Identical copies let the track wrap without a visible jump.
                setSliding(false);
                setOffset(milestones.length + offset % milestones.length);
              }}
            >
              {Array.from({ length: milestones.length * 3 }, (_, n) => {
                const [year, copy, img] = milestones[n % milestones.length];
                return (
                  <article key={n} aria-hidden={n < offset || n >= offset + visibleMilestones}>
                    <span className={styles.calendar}>
                      <Icon name="calendar" />
                    </span>
                    <BlurHeading>
                      <em>{year}</em>
                    </BlurHeading>
                    <img src={a("3735", img)} alt={`Roofseal in ${year}`} />
                    <p>{copy}</p>
                  </article>
                );
              })}
            </div>
            </div>
          </div>
        </div>
        <img
          className={styles.bottomCut}
          src={a("3735", "imgSectionBackground1")}
          alt=""
        />
      </section>
      <section className={styles.esg}>
        <div className={styles.esgHeading}>
          <BlurHeading>
            <em>ESG</em> Commitment
          </BlurHeading>
          <p>
            Roofseal is committed to integrating sustainable practices into our
            operations and product solutions through Environmental, Social, and
            Governance (ESG) principles.
          </p>
        </div>
        <div className={`wide ${styles.esgPanels}`}>
          {esgCommitments.map(({ title, bullets }, i) => (
            <button
              key={title}
              onClick={() => setEsg(i)}
              onMouseEnter={() => setEsg(i)}
              className={`${styles.esgPanel} ${esg === i ? styles.esgActive : ""}`}
              aria-expanded={esg === i}
            >
              <img src={a("3966", `imgSectionBackground${i + 1}`)} alt="" />
              <span className={styles.esgShade} />
              <span className={styles.esgCopy}>
                <h3>{title}</h3>
                <ul>
                  {bullets.map((copy) => (
                    <li key={copy}>{copy}</li>
                  ))}
                </ul>
              </span>
            </button>
          ))}
          <img
            className={styles.panelTop}
            src={a("3966", "imgSectionBackground4")}
            alt=""
          />
          <img
            className={styles.panelBottom}
            src={a("3966", "imgSectionBackground5")}
            alt=""
          />
        </div>
        <img
          className={styles.bottomCut}
          src={a("3966", "imgSectionBackground")}
          alt=""
        />
      </section>
    </main>
  );
}
