import { patchWindowsNetUseProbe, viteConfig } from "./vite-shared.mjs";

patchWindowsNetUseProbe();

const { preview } = await import("vite");
const server = await preview(viteConfig);
server.printUrls();
