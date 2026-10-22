import { getPayload } from "payload";
import config from "@payload-config";
import { submitEnquiry } from "@/enquiries/submission";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = await getPayload({ config });
    return await submitEnquiry(request, payload);
  } catch {
    return Response.json({ error: "Enquiries are temporarily unavailable. Please try again later." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
