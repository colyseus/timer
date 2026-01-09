import path from 'path';
import glob from 'fast-glob';
import { fileURLToPath } from 'url';
import ts from "typescript";
import esbuild from "esbuild";

// we need to change up how __dirname is used for ES6 purposes
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  // Absolute path to package directory
  const basePath = __dirname;
  const target = "es2017";

  // Get all .ts as input files
  const entryPoints = glob.sync(path.resolve(basePath, "src", "**.ts")
    .replace(/\\/g, '/')); // windows support

  const outdir = path.join(basePath, 'build');

  // CommonJS output
  console.log("Generating CJS build...");
  esbuild.build({
    entryPoints,
    outdir,
    format: "cjs",
    target,
    bundle: true,
    sourcemap: "external",
    platform: "node",
    outExtension: { '.js': '.cjs', },
    plugins: [{
      name: 'add-cjs',
      setup(build) {
        build.onResolve({ filter: /.*/ }, (args) => {
          if (args.importer) {
            if (args.path.startsWith('.')) {
              return { path: args.path.replace(/\.[jt]sx?$/, '.cjs'), external: true }
            }
            return { path: args.path, external: true }
          }
        })
      },
    }],
  });

  // ESM output
  console.log("Generating ESM build...");
  esbuild.build({
    entryPoints,
    outdir,
    target: "esnext",
    format: "esm",
    bundle: true,
    sourcemap: "external",
    platform: "node",
    outExtension: { '.js': '.mjs', },
    plugins: [{
      name: 'add-mjs',
      setup(build) {
        build.onResolve({ filter: /.*/ }, (args) => {
          if (args.importer) {
            if (args.path.startsWith('.')) {
              return { path: args.path.replace(/\.[jt]sx?$/, '.mjs'), external: true }
            }
            return { path: args.path, external: true }
          }
        })
      },
    }],
  });

  console.log("Done!");
}

export default await main();


