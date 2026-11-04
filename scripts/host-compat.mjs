import os from "node:os";
import { syncBuiltinESMExports } from "node:module";

// Some managed Windows sessions cannot resolve the host account through libuv.
// Keep the host values whenever available; the fallback only supports local tools.
const original = os.userInfo;
try {
  original();
} catch {
  os.userInfo = () => ({
    uid: -1,
    gid: -1,
    username: process.env.USERNAME || "codex",
    homedir: process.env.USERPROFILE || os.homedir(),
    shell: null,
  });
  syncBuiltinESMExports();
}
