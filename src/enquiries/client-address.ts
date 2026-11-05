import { createHmac, timingSafeEqual } from "node:crypto";
import { isIP } from "node:net";

// Cross-account Worker subrequests replace CF-Connecting-IP. Only accept the
// original visitor address when this deployment's proxy authenticates it.
export function enquiryClientAddress(request: Request, env: Record<string, string | undefined>, now = Date.now()): string {
  const address = request.headers.get("x-roofseal-client-ip") || "";
  const timestamp = request.headers.get("x-roofseal-proxy-time") || "";
  const signature = request.headers.get("x-roofseal-proxy-signature") || "";
  if (env.ROOFSEAL_PROXY_SECRET && isIP(address) && /^\d{13}$/.test(timestamp) && Math.abs(now - Number(timestamp)) <= 300_000 && /^[a-f0-9]{64}$/.test(signature)) {
    const url = new URL(request.url);
    const message = `${timestamp}\n${address}\n${request.method}\n${url.pathname}${url.search}`;
    const expected = createHmac("sha256", env.ROOFSEAL_PROXY_SECRET).update(message).digest();
    if (timingSafeEqual(expected, Buffer.from(signature, "hex"))) return address;
  }
  const trusted = env.ENQUIRY_IP_HEADER;
  return (trusted ? request.headers.get(trusted)?.slice(0, 200) : null) || "shared";
}
