import { env } from "cloudflare:workers";

export const dynamic = "force-dynamic";
const HISTORY_VIEWS = 2000;
const headers = { "Cache-Control": "no-store, max-age=0" };

function reply(body: unknown, status = 200, cookie?: string) {
  return Response.json(body, {
    status,
    headers: { ...headers, ...(cookie ? { "Set-Cookie": cookie } : {}) },
  });
}

export async function GET() {
  try {
    if (!env.DB) throw new Error("Counter database unavailable");
    const row = await env.DB.prepare(
      "SELECT actual_count FROM portfolio_totals WHERE metric_key = ?"
    ).bind("portfolio").first<{ actual_count: number }>();
    return reply({ total: HISTORY_VIEWS + Number(row?.actual_count ?? 0) });
  } catch {
    return reply({ total: null, error: "counter_unavailable" }, 503);
  }
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const origin = request.headers.get("Origin");
  if ((origin && origin !== url.origin) || request.headers.get("Sec-Fetch-Site") === "cross-site") {
    return reply({ error: "invalid_origin" }, 403);
  }
  // Link previews and known crawlers should not create visitor records.
  if (/bot\b|crawler|spider|facebookexternalhit|preview|whatsapp|telegrambot/i.test(request.headers.get("User-Agent") ?? "")) {
    return GET();
  }
  try {
    if (!env.DB) throw new Error("Counter database unavailable");
    const secure = url.protocol === "https:";
    const cookieName = secure ? "__Host-czr-visitor" : "czr-visitor";
    const current = request.headers.get("Cookie")?.split(";").map(v => v.trim())
      .find(v => v.startsWith(cookieName + "="))?.slice(cookieName.length + 1);
    const validId = current && /^[a-f0-9-]{36}$/i.test(current) ? current : null;
    const visitor = validId ?? crypto.randomUUID();
    const day = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(visitor + ":" + day));
    const key = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
    const result = await env.DB.batch([
      env.DB.prepare("INSERT OR IGNORE INTO portfolio_visits (visitor_hash, visit_day, created_at) VALUES (?, ?, ?)")
        .bind(key, day, Date.now()),
      env.DB.prepare("SELECT actual_count FROM portfolio_totals WHERE metric_key = ?").bind("portfolio"),
    ]);
    const actual = Number((result[1].results?.[0] as { actual_count?: number } | undefined)?.actual_count ?? 0);
    const cookie = validId ? undefined : `${cookieName}=${visitor}; Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax${secure ? "; Secure" : ""}`;
    return reply({ total: HISTORY_VIEWS + actual, added: Number(result[0].meta.changes ?? 0) > 0 }, 200, cookie);
  } catch {
    return reply({ total: null, error: "counter_unavailable" }, 503);
  }
}
