"use client";

import { BlurHeading } from "@/components/sites/roofseal/shared/BlurHeading";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useQuote } from "../shared/site-shell";
import { EnquiryForm } from "../shared/EnquiryForm";
import { Banner, Breadcrumbs, DiagonalButton, Icon } from "../shared/ui";
import styles from "./enquiry.module.css";

function ContactDetails() {
  return <div className={styles.details}>
    <BlurHeading>Roofseal Resources (M) Sdn Bhd</BlurHeading>
    <p><Icon name="map-marker-alt" /><span>No.1 &amp; 1-A, Jalan 1/7, Seksyen 1,<br />Bandar Teknologi Kajang,<br />43500 Semenyih, Selangor, Malaysia</span></p>
    <p><Icon name="envelope" /><a href="mailto:enquiry@roofseal.com.my">enquiry@roofseal.com.my</a></p>
    <p><Icon name="phone" /><span><a href="tel:+60387234776">+(60)3 8723 4776</a><br /><a href="tel:+60126388476">+(60)12 638 8476</a></span></p>
    <h3>Opening Hours</h3>
    <dl><div><dt>Weekdays</dt><dd>8.30AM – 5PM</dd></div><div><dt>Sunday</dt><dd>8.30AM – 12.30PM</dd></div></dl>
  </div>;
}

export function EnquiryPage({ kind }: { kind: "contact" | "quote" }) {
  const { items, ready, removeQuote, clearQuote, drafts, setDraft } = useQuote();
  const [pending, setPending] = useState(false);
  const [reference, setReference] = useState("");
  const successRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (reference) successRef.current?.focus(); }, [reference]);
  const isQuote = kind === "quote";
  const title = isQuote ? "Quote List" : "Contact Us";
  return <main>
    <Breadcrumbs items={[{ label: title }]} />
    {!isQuote && <Banner title="Contact Us" />}
    <section className={`${styles.intro} wide`}>
      <p className={styles.eyebrow}>{isQuote ? "Your project. Our expertise." : "Get in touch"}</p>
      {isQuote ? <BlurHeading as="h1">Let’s Build Your Next Project.</BlurHeading> : <BlurHeading>Talk to Our Team.</BlurHeading>}
      <p>{isQuote ? "Review your selected products and share your project requirements with our team." : "Speak to Roofseal about your roofing, insulation, doors and frames requirements."}</p>
    </section>
    <section className={`${styles.layout} wide`} aria-label={title}>
      <aside className={styles.sidebar}>
        {isQuote ? <>
          <BlurHeading>Your Selected Products</BlurHeading>
          {!ready ? <p role="status">Loading your quote list…</p> : items.length ? <>
            <p>{items.length} {items.length === 1 ? "product" : "products"} in your quote list.</p>
            <ul className={styles.products}>{items.map((item) => <li key={item.id}>
              <Link href={`/products/${item.slug}`} tabIndex={pending ? -1 : undefined}><img src={item.image} alt="" /><span>{item.title}</span></Link>
              <button type="button" disabled={pending} aria-label={`Remove ${item.title}`} onClick={() => removeQuote(item.id)}>Remove <Icon name="close" /></button>
            </li>)}</ul>
          </> : <p>Your quote list is empty. Browse our products to add items for a quotation.</p>}
          <DiagonalButton href="/metal-roof-system" variant="white">Browse Products</DiagonalButton>
          <div className={styles.assistance}><h3>Need assistance?</h3><a href="mailto:enquiry@roofseal.com.my">enquiry@roofseal.com.my</a><a href="tel:+60387234776">+(60)3 8723 4776</a></div>
        </> : <ContactDetails />}
      </aside>
      <div className={styles.formCard}>
        {reference ? <div role="status" tabIndex={-1} ref={successRef} className="enquiry-success"><BlurHeading>Thank You</BlurHeading><p>Your {isQuote ? "quotation request" : "enquiry"} has been received.</p><p>Reference: <strong>{reference}</strong></p><button className={styles.again} onClick={() => setReference("")}>Start a new {isQuote ? "quotation request" : "enquiry"}</button></div> : <>
          <BlurHeading>{isQuote ? "Your Enquiry Details" : "Send Us an Enquiry"}</BlurHeading>
          <p className={styles.required}>Fields marked * are required.</p>
          {isQuote && (!ready || !items.length) ? <p>{ready ? "Add a product to your quote list to complete your quotation request." : "Loading your selected products…"}</p> : <EnquiryForm kind={kind} productIds={isQuote ? items.map((item) => item.id) : []} draft={drafts[kind]} onDraftChange={(draft) => setDraft(kind, draft)} onPendingChange={setPending} onSuccess={(savedReference) => { setDraft(kind, {}); if (isQuote) clearQuote(); setReference(savedReference); }} />}
        </>}
      </div>
    </section>
    {!isQuote && <section className={styles.map} aria-label="Find Roofseal"><iframe title="Roofseal location on Google Maps" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=Roofseal%20Resources%20No.%201%20Jalan%201%2F7%20Bandar%20Teknologi%20Kajang&output=embed" /><a href="https://www.google.com/maps/search/?api=1&query=Roofseal+Resources+Bandar+Teknologi+Kajang" target="_blank" rel="noreferrer">Open in Google Maps <Icon name="arrow-right" /></a></section>}
  </main>;
}
