import path from "node:path";
import type { Access, CollectionConfig, Field, PayloadRequest } from "payload";
import { parseProductApplication } from "./product-application";

const administrator = ({ req }: { req: PayloadRequest }): boolean => req.user?.role === "admin";
const editor = ({ req }: { req: PayloadRequest }): boolean => ["admin", "editor"].includes(req.user?.role || "");
const published: Access = ({ req }) => editor({ req }) ? true : { _status: { equals: "published" } };
const contentAccess = { read: published, create: editor, update: editor, delete: administrator };
const slug: Field = { name: "slug", type: "text", required: true, unique: true, index: true,
  validate: (value: string | null | undefined) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value || "") || "Use lowercase letters, numbers and single hyphens." };
const provenance: Field[] = [
  { name: "sourceUrl", type: "text", unique: true, access: { update: () => false }, admin: { readOnly: true, position: "sidebar", description: "Original content URL. Used to make imports repeatable." } },
  { name: "editorialNotes", type: "textarea", admin: { position: "sidebar" } },
  { name: "seo", type: "group", fields: [
    { name: "title", type: "text" },
    { name: "description", type: "textarea" },
  ] },
];

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: { useAsTitle: "email", group: "Administration" },
  access: {
    admin: editor,
    create: administrator,
    read: ({ req }) => req.user?.role === "admin" ? true : req.user ? { id: { equals: req.user.id } } : false,
    update: ({ req }) => req.user?.role === "admin" ? true : req.user ? { id: { equals: req.user.id } } : false,
    delete: administrator,
  },
  fields: [
    { name: "name", type: "text" },
    { name: "role", type: "select", required: true, defaultValue: "editor", options: ["admin", "editor"], access: {
      create: ({ req }) => req.user?.role === "admin",
      update: ({ req }) => req.user?.role === "admin",
    } },
  ],
};

export const Media: CollectionConfig = {
  slug: "media",
  admin: { useAsTitle: "alt", group: "Content" },
  access: { read: () => true, create: editor, update: editor, delete: administrator },
  upload: {
    staticDir: path.resolve(process.env.CMS_MEDIA_DIR || ".data/media"),
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"],
    imageSizes: [
      { name: "card", width: 640, withoutEnlargement: true, formatOptions: { format: "webp", options: { quality: 85 } } },
      { name: "large", width: 1280, withoutEnlargement: true, formatOptions: { format: "webp", options: { quality: 90 } } },
    ],
    adminThumbnail: "card",
  },
  fields: [
    { name: "alt", type: "text", required: true },
    { name: "sourceUrl", type: "text", unique: true, admin: { readOnly: true }, access: { update: () => false } },
    { name: "checksum", type: "text", admin: { readOnly: true } },
  ],
};

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: { useAsTitle: "name", group: "Products", defaultColumns: ["name", "division", "parent", "_status"] },
  access: contentAccess,
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    { name: "name", type: "text", required: true }, slug,
    { name: "parent", type: "relationship", relationTo: "categories" },
    { name: "division", type: "select", required: true, options: ["metal", "doors"], defaultValue: "metal" },
    { name: "displayOrder", type: "number", defaultValue: 100 },
    { name: "importRelationshipsComplete", type: "checkbox", defaultValue: false, admin: { hidden: true }, access: { update: () => false } },
    { name: "heading", type: "text" },
    { name: "description", type: "textarea" },
    { name: "image", type: "upload", relationTo: "media" },
    { name: "faqs", type: "array", fields: [
      { name: "question", type: "text", required: true },
      { name: "answer", type: "textarea", required: true },
      { name: "group", type: "select", options: ["metal", "shingles"], defaultValue: "metal" },
    ] },
    ...provenance,
  ],
};

export const Products: CollectionConfig = {
  slug: "products",
  admin: { useAsTitle: "title", group: "Products", defaultColumns: ["title", "categories", "_status"],
    preview: (doc) => `/api/preview?collection=products&slug=${encodeURIComponent(String(doc.slug))}` },
  access: contentAccess,
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    { name: "title", type: "text", required: true }, slug,
    { name: "sourceId", type: "text", unique: true, admin: { readOnly: true }, access: { update: () => false } },
    { name: "sku", type: "text" },
    { name: "categories", type: "relationship", relationTo: "categories", hasMany: true, required: true },
    { name: "displayOrder", type: "number", defaultValue: 100 },
    { name: "description", type: "textarea", required: true, admin: { description: "Paragraph description, shown when there are no bullet rows.", condition: (_data, siblingData) => !siblingData.features?.length } },
    { name: "features", label: "Product description bullets", type: "array", fields: [{ name: "text", type: "textarea", required: true }] },
    { name: "cardImage", type: "upload", relationTo: "media" },
    { name: "gallery", type: "upload", relationTo: "media", hasMany: true },
    { name: "catalogue", type: "upload", relationTo: "media", filterOptions: { mimeType: { equals: "application/pdf" } } },
    { name: "specifications", type: "array", fields: [
      { name: "label", type: "text", required: true },
      { name: "value", type: "text", required: true },
    ] },
    { name: "applicationInformation", label: "Application table and illustration", type: "json",
      admin: { description: "Verified application content: sourceUrl, local image and alt/dimensions, columns, and rows. Each row must have one cell per column." },
      validate: (value: unknown) => value == null || !!parseProductApplication(value) || "Provide a valid application table with matching columns and a local fastener illustration.",
    },
    { name: "relatedProducts", type: "relationship", relationTo: "products", hasMany: true },
    { name: "importRelationshipsComplete", type: "checkbox", defaultValue: false, admin: { hidden: true }, access: { update: () => false } },
    ...provenance,
  ],
};

export const Resources: CollectionConfig = {
  slug: "resources",
  admin: { useAsTitle: "title", group: "Content", defaultColumns: ["title", "type", "_status"],
    preview: (doc) => `/api/preview?collection=resources&slug=${encodeURIComponent(String(doc.slug))}` },
  access: contentAccess,
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    { name: "title", type: "text", required: true }, slug,
    { name: "type", type: "select", required: true, options: [
      { label: "Catalogue", value: "catalogue" }, { label: "Materials", value: "material" },
      { label: "Blog post", value: "article" }, { label: "Image Gallery", value: "gallery" },
    ] },
    { name: "postCategory", label: "Blog category", type: "select", defaultValue: "article",
      options: [{ label: "Articles", value: "article" }, { label: "News", value: "news" }, { label: "Events", value: "event" }],
      admin: { condition: (_data, siblingData) => siblingData.type === "article" },
    },
    { name: "excerpt", type: "textarea" },
    { name: "content", type: "richText" },
    { name: "file", type: "upload", relationTo: "media" },
    { name: "coverImage", type: "upload", relationTo: "media" },
    { name: "images", type: "upload", relationTo: "media", hasMany: true },
    { name: "attachments", type: "upload", relationTo: "media", hasMany: true },
    { name: "products", type: "relationship", relationTo: "products", hasMany: true },
    { name: "materials", type: "array", fields: [
      { name: "name", type: "text", required: true },
      { name: "coatingMass", type: "text" },
      { name: "warranty", type: "text" },
    ] },
    ...provenance,
  ],
};

export const Careers: CollectionConfig = {
  slug: "careers",
  labels: { singular: "Career position", plural: "Career positions" },
  admin: {
    useAsTitle: "title", group: "Content",
    defaultColumns: ["title", "department", "isPlaceholder", "_status"],
    description: "Positions shown on the careers page. Applications remain disabled. Mark example roles as placeholders; publish only approved vacancies when hiring is confirmed.",
  },
  access: contentAccess,
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    { name: "title", type: "text", required: true }, slug,
    { name: "isPlaceholder", label: "Placeholder position", type: "checkbox", defaultValue: true,
      admin: { position: "sidebar", description: "Internal editorial flag for sample positions. It is not displayed on the careers page." } },
    { name: "department", type: "text" },
    { name: "location", type: "text" },
    { name: "employmentType", type: "select", options: [
      { label: "Full-time", value: "full-time" }, { label: "Part-time", value: "part-time" },
      { label: "Contract", value: "contract" }, { label: "Internship", value: "internship" },
    ] },
    { name: "summary", type: "textarea", required: true },
    { name: "description", label: "Job description", type: "textarea", required: true },
    { name: "responsibilities", label: "Job scope", type: "textarea", required: true,
      admin: { description: "One responsibility per line; displayed as bullet points." } },
    { name: "requirements", type: "textarea", required: true,
      admin: { description: "One requirement per line; displayed as bullet points." } },
    { name: "displayOrder", type: "number", defaultValue: 100 },
    { name: "sourceKey", type: "text", unique: true, admin: { readOnly: true, position: "sidebar" }, access: { update: () => false } },
    { name: "editorialNotes", type: "textarea", access: { read: editor }, admin: { position: "sidebar" } },
  ],
};
