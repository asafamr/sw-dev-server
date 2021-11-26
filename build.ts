import { build } from "esbuild";

build(
  {
    bundle: true,
    minify:true,
    treeShaking:true,
    format: "iife",
    target: "es2020",
    sourceRoot: "./src",
    outdir:"public",
    entryPoints: ["./src/sw.ts"],
  }
);
