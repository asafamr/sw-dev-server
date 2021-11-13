import { serve } from "esbuild";

serve(
  {
    servedir: "./public",
    port: 9898
  },
  {
    plugins: [
    ],
    bundle: true,
    format: "iife",
    target: "es2020",
    sourceRoot: "./src",
    entryPoints: ["./src/sw.ts"],
  }
);
