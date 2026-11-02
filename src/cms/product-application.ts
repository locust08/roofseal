export type ProductApplication = {
  sourceUrl: string;
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  columns: string[];
  rows: string[][];
};

const text = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0 && value.length <= 250;
const dimension = (value: unknown): value is number => typeof value === "number" && Number.isInteger(value) && value > 0 && value <= 4000;

/** JSON remains data: no raw HTML, arbitrary URLs or inconsistent table cells. */
export function parseProductApplication(value: unknown): ProductApplication | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  if (typeof item.sourceUrl !== "string" || !/^https:\/\/www\.roofseal\.com\.my\/product\/[a-z0-9-]+\/$/.test(item.sourceUrl)) return null;
  if (typeof item.image !== "string" || !/^\/sites\/roofseal\/fasteners\/[A-Za-z0-9-]+\.jpg$/.test(item.image)) return null;
  if (!text(item.imageAlt) || !dimension(item.imageWidth) || !dimension(item.imageHeight)) return null;
  if (!Array.isArray(item.columns) || item.columns.length < 1 || item.columns.length > 3 || !item.columns.every(text)) return null;
  const columns = item.columns as string[];
  if (!Array.isArray(item.rows) || item.rows.length < 1 || item.rows.length > 20 || !item.rows.every((row: unknown) => Array.isArray(row) && row.length === columns.length && row.every(text))) return null;
  return { sourceUrl: item.sourceUrl, image: item.image, imageAlt: item.imageAlt, imageWidth: item.imageWidth, imageHeight: item.imageHeight, columns, rows: item.rows as string[][] };
}
