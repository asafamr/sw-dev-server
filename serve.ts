import { serve } from "esbuild";

serve(
  {
    servedir: "./public",
    host:'localhost',
    port: parseInt(process.env.port || '9898')
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
).then(r=>{
  console.log(`Serving at http://${r.host}:${r.port}`)
});
