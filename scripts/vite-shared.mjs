import childProcess from "node:child_process";
import { EventEmitter } from "node:events";
import { syncBuiltinESMExports } from "node:module";

export function patchWindowsNetUseProbe() {
  const originalExec = childProcess.exec;
  childProcess.exec = function patchedExec(command, options, callback) {
    const normalized = Array.isArray(command) ? command.join(" ") : String(command);
    if (process.platform === "win32" && normalized.trim().toLowerCase() === "net use") {
      const cb = typeof options === "function" ? options : callback;
      const fake = new EventEmitter();
      fake.kill = () => true;
      fake.killed = false;
      fake.pid = 0;
      fake.stdin = null;
      fake.stdout = null;
      fake.stderr = null;
      queueMicrotask(() => {
        cb?.(null, "", "");
        fake.emit("exit", 0);
        fake.emit("close", 0);
      });
      return fake;
    }
    return originalExec(command, options, callback);
  };
  syncBuiltinESMExports();
}

export function getFlagValue(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index >= 0 && process.argv[index + 1]) return process.argv[index + 1];
  const equals = process.argv.find((arg) => arg.startsWith(`${name}=`));
  return equals ? equals.slice(name.length + 1) : fallback;
}

export const viteConfig = {
  configFile: false,
  esbuild: false,
  resolve: {
    preserveSymlinks: true
  },
  optimizeDeps: {
    noDiscovery: true,
    include: []
  },
  build: {
    emptyOutDir: false,
    minify: "esbuild",
    chunkSizeWarningLimit: 4096
  },
  server: {
    host: "0.0.0.0",
    port: Number(getFlagValue("--port", "6173")),
    strictPort: true
  },
  preview: {
    host: "0.0.0.0",
    port: Number(getFlagValue("--port", "4175"))
  }
};
