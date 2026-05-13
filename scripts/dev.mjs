import { patchWindowsNetUseProbe, viteConfig } from "./vite-shared.mjs";

patchWindowsNetUseProbe();

const { createServer } = await import("vite");
const server = await createServer(viteConfig);
await server.listen();
server.printUrls();
