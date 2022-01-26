import { build } from 'esbuild'

build({
  entryPoints: ['./src/node/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: 'dist/node.js',
  sourcemap: true,
  sourcesContent: false,
  minifySyntax: true,
  treeShaking: true,
}).catch(() => process.exit(1))

build({
  entryPoints: ['./src/client/index.ts'],
  bundle: true,
  format: 'esm',
  outfile: 'dist/client.js',
  sourcemap: true,
  sourcesContent: false,
  minifySyntax: true,
  treeShaking: true,
}).catch(() => process.exit(1))
