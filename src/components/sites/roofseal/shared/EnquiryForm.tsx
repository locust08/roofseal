"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ENQUIRY_CONSENT } from "@/enquiries/shared";
import { DiagonalButton } from "./ui";

export type EnquiryDraft = { fields?: { name: string; email: string; phone: string; company: string; message: string; consent: boolean }; attempt?: { fingerprint: string; reference: string } };

export function EnquiryForm({ kind, productIds = [], onSuccess, onPendingChange, draft, onDraftChange }: { kind: "contact" | "quote"; productIds?: number[]; onSuccess: (reference: string) => void; onPendingChange: (pending: boolean) => void; draft: EnquiryDraft; onDraftChange: (draft: EnquiryDraft) => void }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const errorRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (error && !pending) errorRef.current?.focus();
  }, [error, pending]);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  function remember(form: HTMLFormElement) {
    const values = new FormData(form);
    onDraftChange({ ...draft, fields: { name: String(values.get("name") || ""), email: String(values.get("email") || ""), phone: String(values.get("phone") || ""), company: String(values.get("company") || ""), message: String(values.get("message") || ""), consent: values.get("consent") === "on" } });
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    const fields = { kind, productIds, name: data.get("name"), email: data.get("email"), phone: data.get("phone"), company: data.get("company"), message: data.get("message"), consent: data.get("consent") === "on", website: data.get("website") };
    const fingerprint = JSON.stringify(fields);
    const attempt = draft.attempt?.fingerprint === fingerprint ? draft.attempt : { fingerprint, reference: crypto.randomUUID() };
    onDraftChange({ ...draft, attempt });
    const reference = attempt.reference;
    setPending(true);
    onPendingChange(true);
    setError("");
    try {
      const response = await fetch("/api/submit-enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...fields, reference }), signal: AbortSignal.timeout(30000) });
      const result = await response.json();
      if (!mounted.current) return;
      if (!response.ok) { setError(result.error || "Your enquiry could not be saved. Please try again."); return; }
      onSuccess(result.reference);
    } catch {
      if (mounted.current) setError("We could not confirm your submission. Please retry this form; the same enquiry will not be duplicated.");
    } finally { if (mounted.current) setPending(false); onPendingChange(false); }
  }
  return <form className="enquiry-form" onSubmit={submit} onChange={(event) => remember(event.currentTarget)} aria-busy={pending}>
    <fieldset disabled={pending}>
      <legend className="sr-only">Your contact details</legend>
      <label>Name<input name="name" defaultValue={draft.fields?.name} autoComplete="name" required minLength={2} maxLength={100} /></label>
      <label>Email<input name="email" defaultValue={draft.fields?.email} type="email" autoComplete="email" required maxLength={254} /></label>
      <label>Phone<input name="phone" defaultValue={draft.fields?.phone} type="tel" autoComplete="tel" required minLength={5} maxLength={40} /></label>
      <label>Company <span>(optional)</span><input name="company" defaultValue={draft.fields?.company} autoComplete="organization" maxLength={160} /></label>
      <label>Message<textarea name="message" defaultValue={draft.fields?.message} required minLength={5} maxLength={5000} rows={4} /></label>
      <label className="enquiry-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <label className="enquiry-consent"><input name="consent" type="checkbox" defaultChecked={draft.fields?.consent} required /><span>{ENQUIRY_CONSENT}</span></label>
      {error && <p role="alert" className="enquiry-error" tabIndex={-1} ref={errorRef}>{error}</p>}
      <DiagonalButton type="submit" disabled={pending}>{pending ? "Submitting…" : kind === "quote" ? "Request a quotation" : "Send enquiry"}</DiagonalButton>
    </fieldset>
  </form>;
}
