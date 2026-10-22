import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { getCms } from "@/lib/cms-content";

export async function GET(request: Request) {
  const { user } = await (await getCms()).auth({ headers: request.headers });
  if (!user || !["admin", "editor"].includes(user.role)) return NextResponse.json({ error: "Sign in to preview drafts." }, { status: 401 });
  const url = new URL(request.url);
  const collection = url.searchParams.get("collection");
  const slug = url.searchParams.get("slug") || "";
  if (!["products", "resources"].includes(collection || "") || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return NextResponse.json({ error: "Invalid preview target." }, { status: 400 });
  }
  (await draftMode()).enable();
  // A relative redirect keeps the admin's actual origin and its auth cookies.
  return new NextResponse(null, { status: 307, headers: { Location: `/${collection}/${slug}` } });
}
