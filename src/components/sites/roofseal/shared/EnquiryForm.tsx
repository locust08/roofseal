"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ENQUIRY_CONSENT, ENQUIRY_TYPES, PROJECT_TYPES } from "@/enquiries/shared";
import { DiagonalButton } from "./ui";

const textFields = ["name", "email", "phone", "company", "message", "enquiryType", "state", "projectType", "projectLocation", "estimatedRequirements"] as const;
type FormFields = Record<(typeof textFields)[number], string> & { consent: boolean };
export type EnquiryDraft = { fields?: FormFields; attempt?: { fingerprint: string; reference: string } };

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
    const fields = Object.fromEntries(textFields.map((key) => [key, String(values.get(key) || "")])) as Record<(typeof textFields)[number], string>;
    onDraftChange({ ...draft, fields: { ...fields, consent: values.get("consent") === "on" } });
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    const fields = { kind, productIds, ...Object.fromEntries(textFields.map((key) => [key, data.get(key) || ""])), consent: data.get("consent") === "on", website: data.get("website") };
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
      <div className="enquiry-fields">
        <label>Full Name *<input name="name" defaultValue={draft.fields?.name} autoComplete="name" required minLength={2} maxLength={100} /></label>
        <label>Company Name *<input name="company" defaultValue={draft.fields?.company} autoComplete="organization" required maxLength={160} /></label>
        <label>Email Address *<input name="email" defaultValue={draft.fields?.email} type="email" autoComplete="email" required maxLength={254} /></label>
        <label>Contact Number *<input name="phone" defaultValue={draft.fields?.phone} type="tel" autoComplete="tel" required minLength={5} maxLength={40} /></label>
        {kind === "contact" ? <label className="enquiry-full">Enquiry Type *<select name="enquiryType" defaultValue={draft.fields?.enquiryType || ""} required><option value="" disabled>Select enquiry type</option>{ENQUIRY_TYPES.map((type) => <option key={type}>{type}</option>)}</select></label> : <>
          <label>State / Location *<input name="state" autoComplete="address-level1" defaultValue={draft.fields?.state} required maxLength={160} /></label>
          <label>Project Type *<select name="projectType" defaultValue={draft.fields?.projectType || ""} required><option value="" disabled>Select project type</option>{PROJECT_TYPES.map((type) => <option key={type}>{type}</option>)}</select></label>
          <label>Project Location <span>(optional)</span><input name="projectLocation" defaultValue={draft.fields?.projectLocation} maxLength={300} /></label>
          <label>Estimated Quantity / Requirements <span>(optional)</span><input name="estimatedRequirements" defaultValue={draft.fields?.estimatedRequirements} maxLength={1000} /></label>
        </>}
        <label className="enquiry-full">Message / Enquiry Details *<textarea name="message" defaultValue={draft.fields?.message} placeholder="Tell us about your project or product requirements" required minLength={5} maxLength={5000} rows={5} /></label>
      </div>
      <label className="enquiry-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <label className="enquiry-consent"><input name="consent" type="checkbox" defaultChecked={draft.fields?.consent} required /><span>{ENQUIRY_CONSENT}</span></label>
      {error && <p role="alert" className="enquiry-error" tabIndex={-1} ref={errorRef}>{error}</p>}
      <DiagonalButton type="submit" disabled={pending}>{pending ? "Submitting…" : kind === "quote" ? "Request a quotation" : "Send enquiry"}</DiagonalButton>
    </fieldset>
  </form>;
}
