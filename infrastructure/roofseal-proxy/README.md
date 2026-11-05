# Roofseal custom-domain proxy

Public URL: https://roofseal.sites.locus-t.com

The proxy is hosted through Sites, matching Intergo Furniture's custom-domain setup. It forwards to the existing `roofseal` Worker at https://roofseal.easondev.workers.dev. D1, R2, CMS accounts and enquiries remain in that Worker’s account.

- Sites project: `appgprj_6ae94403a3a48191aa69e5c34ee026c8`
- Source checkout: `.data/roofseal-domain-site` (ignored; Sites retains a separate source repository)
- Published proxy source: `3e978b35baadf8b4d0e8bb35b953e39b8a7c0a26`, version 1
- Backend Worker version: `dfa6f5fc-0d76-4c00-84a4-49748c84da1d`
- Custom domain ID: `appgdom_6ae94685d3408191b4ad584988857a93`

`worker.ts` is the typed proxy source. Run `node scripts/cloudflare/prepare-domain-proxy.mjs` to update the Sites checkout's `worker/index.js`, then use the Sites skill's source workflow to build, push, package, save and deploy the new version. If the ignored checkout is missing, open the existing Site source with a fresh Sites source credential; do not register another Site.

`ROOFSEAL_PROXY_SECRET` must match in the Sites runtime and original Worker's secrets. Never commit its value. The proxy authenticates the visitor address with a short-lived HMAC bound to the request method and path. The enquiry backend ignores forged, stale or missing signatures and falls back to its configured Cloudflare address header. Only explicitly configured website origins can submit enquiries.

DNS in the `locus-t.com` zone:

- CNAME `roofseal.sites` → `custom-domains.chatgpt.site` (DNS only)
- TXT `_openai-site-verification.roofseal.sites` → value returned by Sites
- TXT `_cf-custom-hostname.roofseal.sites` → value returned by Sites

The custom domain and certificate were confirmed active. No database content or product publication state was changed. Email and Google Sheets delivery remain disabled, as do career applications.

Validation: production OpenNext build, TypeScript, proxy/enquiry tests (10 passing), and live custom-domain checks for page responses, same-domain redirects, 38 published products, no public drafts, private enquiries, and valid/invalid origin validation. The full `npm test` includes localhost HTTP tests and could not pass with localhost stopped; it also requires permission to listen for its D1 emulator. No localhost server was started for this deployment.
