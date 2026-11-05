import { writeFile, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'dotenv';

// OpenNext includes .env values in this private server module by default.
// Keep runtime credentials exclusively in Worker bindings, and fail publication
// if a local credential remains anywhere in the generated deployment output.
const root = '.open-next';
const server = await readFile(path.join(root, 'server-functions/default/handler.mjs'), 'utf8');
if (!server.includes('Password hashing failed')) {
  throw new Error('Payload auth compatibility layer was not bundled. Refusing publication.');
}
const publicEnv = { NEXT_PUBLIC_SERVER_URL: 'https://roofseal.sites.locus-t.com' };
await writeFile(path.join(root, 'cloudflare/next-env.mjs'),
  `export const production = ${JSON.stringify(publicEnv)};\nexport const development = ${JSON.stringify(publicEnv)};\nexport const test = {};\n`);
const local = await readFile('.env.local', 'utf8').then(parse).catch(() => ({}));
const secrets = Object.entries(local).filter(([key, value]) =>
  /SECRET|PASSWORD|PRIVATE_KEY|API_KEY/.test(key) && value.length >= 12).map(([, value]) => value);
async function check(directory) {
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, item.name);
    if (item.isDirectory()) await check(file);
    else if (item.isFile()) {
      const buffer = await readFile(file);
      if (secrets.some((secret) => buffer.includes(secret))) {
        throw new Error('Local credentials remain in deployment output. Refusing publication.');
      }
    }
  }
}
await check(root);
console.log('Cloudflare bundle checked: runtime secrets excluded.');
