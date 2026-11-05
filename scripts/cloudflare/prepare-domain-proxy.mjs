import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const checkout = path.join(root, '.data/roofseal-domain-site');
const manifest = JSON.parse(await readFile(path.join(checkout, '.openai/hosting.json'), 'utf8'));
if (manifest.project_id !== 'appgprj_6ae94403a3a48191aa69e5c34ee026c8') throw new Error('Open the existing Roofseal Site source checkout before preparing the proxy.');
const source = await readFile(path.join(root, 'infrastructure/roofseal-proxy/worker.ts'), 'utf8');
const result = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } });
await writeFile(path.join(checkout, 'worker/index.js'), result.outputText);
console.log('Roofseal proxy source prepared for the Sites source workflow.');
