import { patchWindowsNetUseProbe, viteConfig } from "./vite-shared.mjs";

patchWindowsNetUseProbe();

const { build } = await import("vite");
await build(viteConfig);
