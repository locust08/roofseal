"use client";
import type { ReactNode } from "react";
import { useEnquiry } from "./enquiry-context";
import Link from "next/link";
import { asset } from "./assets";

export function Icon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  const icons: Record<string, string> = {
    "arrow-right": "\uf061",
    "arrow-left": "\uf060",
    "chevron-down": "\uf078",
    "chevron-left": "\uf053",
    "chevron-right": "\uf054",
    calendar: "\uf133",
    "caret-down": "\uf0d7",
    "shopping-cart": "\uf07a",
    comments: "\uf086",
    envelope: "\uf0e0",
    phone: "\uf095",
    "map-marker-alt": "\uf3c5",
    fax: "\uf1ac",
    download: "\uf019",
    close: "\uf00d",
    plus: "\uf067",
    minus: "\uf068",
    bars: "\uf0c9",
    circle: "\uf111",
    facebook: "\uf09a",
    linkedin: "\uf0e1",
    whatsapp: "\uf232",
  };
  return (
    <span
      aria-hidden="true"
      className={`${["facebook", "linkedin", "whatsapp"].includes(name) ? "icon-brand" : "icon-solid"} ${className}`}
    >
      {icons[name] || "\uf061"}
    </span>
  );
}

export function DiagonalButton({
  children,
  href,
  onClick,
  icon,
  variant = "red",
  className = "",
  type = "button",
  ariaLabel,
  corner = "black",
  disabled = false,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  icon?: string;
  variant?: "red" | "white";
  className?: string;
  type?: "button" | "submit";
  ariaLabel?: string;
  corner?: "black" | "white";
  disabled?: boolean;
}) {
  const content = (
    <>
      <span className="diagonal-button__body">
        {icon && <Icon name={icon} />}
        <span className="diagonal-button__label">{children}</span>
      </span>
      <span className="diagonal-button__tip" aria-hidden="true">
        <img
          className="diagonal-button__tip-default"
          src={asset(
            corner === "white" ? "28318:4045" : "28318:4175",
            "imgGroup1171274885",
          )}
          alt=""
          width={10}
          height={50}
        />
        <img
          className="diagonal-button__tip-hover"
          src={asset("28318:5199", "imgGroup1171274885")}
          alt=""
          width={10}
          height={50}
        />
      </span>
    </>
  );
  const cls = `diagonal-button ${variant} ${className}`;
  return href ? (
    <Link href={href} className={cls} onClick={onClick} aria-label={ariaLabel}>
      {content}
    </Link>
  ) : (
    <button
      type={type}
      disabled={disabled}
      className={cls}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}

export function ArrowLink({
  href,
  label = "View details",
}: {
  href: string;
  label?: string;
}) {
  return (
    <Link className="arrow-circle" href={href} aria-label={label}>
      <Icon name="arrow-right" />
    </Link>
  );
}

export function SectionTitle({
  children,
  description,
  className = "",
}: {
  children: ReactNode;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`section-title ${className}`}>
      <h2>{children}</h2>
      {description && <div className="description">{description}</div>}
    </div>
  );
}

export function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="breadcrumbs wide" aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      {items.map((item, i) => (
        <span key={i}>
          <span className="crumb-divider">›</span>
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span aria-current={i === items.length - 1 ? "page" : undefined}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function Banner({
  title,
  node,
  imageVariable = "imgSectionBackground",
}: {
  title: string;
  node: string;
  imageVariable?: string;
}) {
  const covering = node === "28352:2029",
    system = node === "28383:5381";
  return (
    <section
      className={`page-banner ${covering ? "covering-banner" : ""} ${system ? "system-banner" : ""}`}
    >
      <div className="banner-source">
        <img className="banner-photo" src={asset(node, imageVariable)} alt="" />
        {covering && (
          <img
            className="banner-overlay"
            src={asset(node, "imgSectionBackground1")}
            alt=""
          />
        )}
      </div>
      <div className="banner-shade" />
      {(covering || system) && (
        <Link
          className="banner-back wide"
          href={covering ? "/metal-roofing-division" : "/roof-covering"}
        >
          <Icon name="chevron-left" /> Back
        </Link>
      )}
      <h1 className="wide">{title}</h1>
      <div className="banner-cut" />
    </section>
  );
}

export function Cta() {
  const openEnquiry = useEnquiry();
  const a = (v: string) => asset("28397:5562", v);
  return (
    <section className="roof-cta">
      <img className="cta-background" src={a("imgSectionBackground")} alt="" />
      <img className="cta-top" src={a("imgSectionBackground1")} alt="" />
      <img className="cta-bottom" src={a("imgSectionBackground2")} alt="" />
      <div className="cta-copy">
        <h2>
          Need Quality Metal Roofing &amp; Door Frame Products for Your
          Projects?
        </h2>
        <p>
          Roofseal manufactures and supplies a wide range of metal roofing
          systems, insulation products, metal door frames, and fire-rated doors
          designed for residential, commercial, and industrial applications.
        </p>
        <DiagonalButton onClick={openEnquiry} icon="comments">
          Contact Us Today
        </DiagonalButton>
      </div>
      <div className="cta-decor top">
        <img src={a("imgGroup1171274889")} alt="" />
        <img src={a("imgGroup1171274887")} alt="" />
      </div>
      <div className="cta-decor bottom">
        <img src={a("imgGroup1171274887")} alt="" />
        <img src={a("imgGroup1171274886")} alt="" />
      </div>
    </section>
  );
}

export function CategoryCard({
  image,
  title,
  href,
}: {
  image: string;
  title: string;
  href: string;
}) {
  return (
    <Link href={href} className="category-card">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <span className="arrow-circle">
        <Icon name="arrow-right" />
      </span>
    </Link>
  );
}
