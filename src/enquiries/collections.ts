import type { CollectionConfig, Field, PayloadRequest } from "payload";

const admin = ({ req }: { req: PayloadRequest }) => req.user?.role === "admin";
const delivery = (name: string): Field => ({ name, type: "group", admin: { readOnly: true }, access: { update: () => false }, fields: [
  { name: "status", type: "select", required: true, defaultValue: "pending", options: ["pending", "sending", "sent", "failed", "review"] },
  { name: "attempts", type: "number", defaultValue: 0, required: true },
  { name: "lastAttemptAt", type: "date" },
  { name: "nextAttemptAt", type: "date" },
  { name: "lastError", type: "text" },
  { name: "providerId", type: "text" },
] });

export const Enquiries: CollectionConfig = {
  slug: "enquiries",
  admin: { group: "Enquiries", useAsTitle: "reference", defaultColumns: ["createdAt", "kind", "name", "email", "status", "emailDelivery.status", "sheetDelivery.status"], description: "Private contact and quotation submissions. Delivery is processed separately by the enquiry worker." },
  access: { read: admin, create: () => false, update: admin, delete: admin },
  fields: [
    { name: "reference", type: "text", required: true, unique: true, admin: { readOnly: true }, access: { update: () => false } },
    { name: "requestHash", type: "text", required: true, admin: { hidden: true }, access: { update: () => false } },
    { name: "kind", type: "select", required: true, options: ["contact", "quote"], admin: { readOnly: true }, access: { update: () => false } },
    ...["name", "email", "phone", "company"].map((name): Field => ({ name, type: "text", required: name !== "company", admin: { readOnly: true }, access: { update: () => false } })),
    { name: "message", type: "textarea", required: true, admin: { readOnly: true }, access: { update: () => false } },
    { name: "consentAt", type: "date", required: true, admin: { readOnly: true }, access: { update: () => false } },
    { name: "consentText", type: "text", required: true, admin: { readOnly: true }, access: { update: () => false } },
    { name: "products", type: "array", admin: { readOnly: true, description: "Names and URLs at the time of submission; retained if catalogue entries change." }, access: { update: () => false }, fields: [
      { name: "productId", type: "number", required: true },
      { name: "title", type: "text", required: true },
      { name: "slug", type: "text", required: true },
    ] },
    { name: "status", type: "select", required: true, defaultValue: "new", options: ["new", "in-progress", "closed"] },
    { name: "internalNotes", type: "textarea" },
    delivery("emailDelivery"), delivery("sheetDelivery"),
  ],
};

// SQLite's atomic UPSERT is used by submission.ts. Keep its SQL columns aligned.
export const EnquiryLimits: CollectionConfig = {
  slug: "enquiry-limits", dbName: "enquiry_limits",
  admin: { hidden: true },
  access: { read: () => false, create: () => false, update: () => false, delete: () => false },
  fields: [
    { name: "key", type: "text", unique: true, required: true },
    { name: "count", type: "number", required: true },
  ],
};
