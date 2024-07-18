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
    sourcemap: "external",
    platform: "node",
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
  });

  console.log("Done!");
}

export default await main();


