type ProxyEnv = { ROOFSEAL_PROXY_SECRET?: string };
const publicOrigins = ["https://roofseal.sites.locus-t.com", "https://roofseal.locust-crm08.chatgpt.site"];
const upstreamOrigin = "https://roofseal.easondev.workers.dev";

// A fixed upstream prevents this Worker from becoming an open proxy.
export async function proxyRequest(request: Request, env: ProxyEnv, fetcher: typeof fetch = fetch): Promise<Response> {
  const url = new URL(request.url);
  const publicOrigin = url.origin;
  if (!publicOrigins.includes(publicOrigin)) return new Response("Not found", { status: 404 });
  if (!env.ROOFSEAL_PROXY_SECRET) return new Response("Service unavailable", { status: 503 });
  const headers = new Headers(request.headers);
  for (const name of ["forwarded", "x-forwarded-for", "x-real-ip", "x-roofseal-client-ip", "x-roofseal-proxy-time", "x-roofseal-proxy-signature"]) headers.delete(name);
  headers.set("x-forwarded-host", url.host);
  headers.set("x-forwarded-proto", "https");
  headers.delete("host");
  const address = request.headers.get("cf-connecting-ip");
  if (address) {
    const timestamp = String(Date.now());
    const message = `${timestamp}\n${address}\n${request.method}\n${url.pathname}${url.search}`;
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(env.ROOFSEAL_PROXY_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
    headers.set("x-roofseal-client-ip", address);
    headers.set("x-roofseal-proxy-time", timestamp);
    headers.set("x-roofseal-proxy-signature", Array.from(new Uint8Array(signature), byte => byte.toString(16).padStart(2, "0")).join(""));
  }
  const target = new URL(url);
  target.protocol = "https:";
  target.host = new URL(upstreamOrigin).host;
  // Keep Origin intact: the application, rather than this proxy, validates CSRF.
  const forwarded = new Request(target, new Request(request, { headers, redirect: "manual" }));
  const upstream = await fetcher(forwarded);
  const responseHeaders = new Headers(upstream.headers);
  const location = responseHeaders.get("location");
  if (location) {
    const destination = new URL(location, target);
    if (destination.origin === upstreamOrigin) responseHeaders.set("location", `${publicOrigin}${destination.pathname}${destination.search}${destination.hash}`);
  }
  return new Response(upstream.body, { status: upstream.status, statusText: upstream.statusText, headers: responseHeaders });
}

export default {
  fetch(request: Request, env: ProxyEnv): Promise<Response> {
    return proxyRequest(request, env);
  },
};
