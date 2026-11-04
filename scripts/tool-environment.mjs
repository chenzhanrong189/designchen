import path from "node:path";

// Shared defaults for Vite and standalone Wrangler commands. Managed Linux
// supplies its own checkout-local paths before these defaults are applied.
export function configureToolEnvironment(projectRoot) {
  const runtimeRoot =
    process.env.SITES_RUNTIME_ROOT || path.join(projectRoot, ".sites-runtime");
  const defaults = {
    CLOUDFLARE_CF_FETCH_ENABLED: "false",
    WRANGLER_SEND_METRICS: "false",
    WRANGLER_WRITE_LOGS: "false",
    WRANGLER_LOG_PATH: path.join(runtimeRoot, "wrangler/logs"),
    WRANGLER_REGISTRY_PATH: path.join(runtimeRoot, "wrangler/dev-registry"),
    MINIFLARE_REGISTRY_PATH: path.join(runtimeRoot, "wrangler/registry"),
    // Keep default local Wrangler state in the writable checkout on Windows.
    XDG_CONFIG_HOME: path.join(runtimeRoot, "xdg/config"),
    XDG_CACHE_HOME: path.join(runtimeRoot, "xdg/cache"),
    XDG_DATA_HOME: path.join(runtimeRoot, "xdg/data"),
    XDG_STATE_HOME: path.join(runtimeRoot, "xdg/state"),
  };
  for (const [name, value] of Object.entries(defaults)) {
    process.env[name] ??= value;
  }
}
