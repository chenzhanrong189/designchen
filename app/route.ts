import portfolio from "../content/portfolio.html?raw";

export const dynamic = "force-dynamic";

export function GET() {
  return new Response(portfolio, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=60",
    },
  });
}
