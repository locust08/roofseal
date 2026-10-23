"use client";
import Link from "next/link";
import { useState } from "react";
import { useQuoteList } from "./quote-store";
import { Breadcrumbs, DiagonalButton } from "./ui";
export function QuotePage() {
  const { items, remove, setQuantity } = useQuoteList();
  const [message, setMessage] = useState("");
  return (
    <main>
      <Breadcrumbs items={[{ label: "Quote List" }]} />
      <section className="narrow quote-page">
        <h1>Request a Quote</h1>
        <div className="quote-table">
          {items.length ? (
            items.map((item) => (
              <div key={item.slug} className="quote-row">
                <Link href={`/products/${item.slug}`}>{item.name}</Link>
                <label>
                  Quantity
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      setQuantity(item.slug, Number(e.target.value))
                    }
                  />
                </label>
                <button onClick={() => remove(item.slug)}>Remove</button>
              </div>
            ))
          ) : (
            <p>
              Your quote list is empty.{" "}
              <Link href="/metal-roofing-division">Browse products</Link>
            </p>
          )}
        </div>
        <h2>Your inquiry</h2>
        <p>
          Inquiry delivery is not connected yet. Contact{" "}
          <a href="mailto:enquiry@roofseal.com.my">enquiry@roofseal.com.my</a>{" "}
          for assistance.
        </p>
        <form
          className="inquiry-form"
          onSubmit={(e) => {
            e.preventDefault();
            setMessage(
              "Your inquiry has not been sent. Delivery will be available once the inquiry endpoint is connected.",
            );
          }}
        >
          {["Name", "Email", "Phone", "Company"].map((label) => (
            <label key={label}>
              {label}
              <input
                name={label.toLowerCase()}
                type={
                  label === "Email"
                    ? "email"
                    : label === "Phone"
                      ? "tel"
                      : "text"
                }
                required={label !== "Company"}
              />
            </label>
          ))}
          <label className="inquiry-message">
            Message
            <textarea name="message" rows={5} required />
          </label>
          <DiagonalButton type="submit" icon="envelope">
            Request a Quote
          </DiagonalButton>
          <p role="status">{message}</p>
        </form>
      </section>
    </main>
  );
}
