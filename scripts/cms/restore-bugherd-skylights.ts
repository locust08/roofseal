import { mkdir, writeFile } from "node:fs/promises";
import { getPayload } from "payload";
import config from "../../payload.config";

// Local-only reconciliation of the user's explicit #18 approval on 29 October.
const slugs = ["solid-polycarbonate-sheet-colour-selection", "multiwall-profiled-polycarbonate-sheet-colour-selection"];
const marker = "[BugHerd #18 approval 2026-10-29]";
const payload = await getPayload({ config });
try {
  const docs = (await payload.find({ collection: "products", where: { slug: { in: slugs } }, limit: 2, depth: 0, overrideAccess: true })).docs;
  if (docs.length !== 2) throw new Error("Both original skylight records must exist before restoration.");
  if (docs.some((doc) => !doc.cardImage || !doc.gallery?.length)) throw new Error("Original media must be present before publication.");
  await mkdir(".data/backups", { recursive: true });
  try { await writeFile(".data/backups/before-bugherd-18-20261029.json", JSON.stringify(docs, null, 2), { flag: "wx", mode: 0o600 }); }
  catch (error) { if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error; }
  for (const doc of docs) {
    if (doc.editorialNotes?.includes(marker)) continue;
    await payload.update({ collection: "products", id: doc.id, draft: false, overrideAccess: true, data: {
      _status: "published",
      editorialNotes: [doc.editorialNotes, `${marker} User explicitly approved restoring both Solid Polycarbonate Sheet and Multiwall Profiled Polycarbonate Sheet for task #18. This supersedes their earlier Drive removal instruction. Original IDs, content and media retained.`].filter(Boolean).join("\n\n"),
    } });
    console.log(`Restored ${doc.slug}`);
  }
} finally { await payload.destroy(); }
