// Webpack loads this build-time transform as CommonJS.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('node:path');

// Next externalizes built-in crypto before resolver plugins run. Rewrite only
// Payload auth imports before that step, preserving native crypto elsewhere.
module.exports = function payloadAuthLoader(source) {
  const shim = path.resolve(__dirname, '../../src/cms/cloudflare-crypto.ts');
  return source.replace(/from ['"](?:node:)?crypto['"]/g, `from ${JSON.stringify(shim)}`);
};
