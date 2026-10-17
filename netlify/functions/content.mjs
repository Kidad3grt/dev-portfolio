import { createHash, timingSafeEqual } from "node:crypto";
import { getStore } from "@netlify/blobs";

const allowedTypes = new Set(["projects", "experience", "testimonials"]);
const headers = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" };
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers });

function passwordMatches(candidate) {
  const expected = process.env.CMS_ADMIN_PASSWORD;
  if (!expected || typeof candidate !== "string" || !candidate) return false;
  const expectedHash = createHash("sha256").update(expected).digest();
  const candidateHash = createHash("sha256").update(candidate).digest();
  return timingSafeEqual(expectedHash, candidateHash);
}

export default async (request) => {
  if (request.method === "GET") {
    const type = new URL(request.url).searchParams.get("type");
    if (!allowedTypes.has(type)) return json({ error: "Unknown content section." }, 400);
    const items = await getStore("portfolio-content").get(type, { type: "json", consistency: "strong" });
    return items === null ? json({ error: "No published content yet." }, 404) : json({ items });
  }

  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);
  if (!process.env.CMS_ADMIN_PASSWORD) return json({ error: "CMS_ADMIN_PASSWORD is not configured in Netlify." }, 503);

  let body;
  try {
    const raw = await request.text();
    if (raw.length > 500_000) return json({ error: "Content is too large." }, 413);
    body = JSON.parse(raw);
  } catch {
    return json({ error: "Request body must be valid JSON." }, 400);
  }

  if (!passwordMatches(body.password)) return json({ error: "Incorrect admin password." }, 401);
  if (body.action === "auth") return json({ authenticated: true });
  if (!allowedTypes.has(body.type)) return json({ error: "Unknown content section." }, 400);
  if (!Array.isArray(body.items) || body.items.length > 100 || body.items.some((item) => !item || typeof item !== "object" || Array.isArray(item))) {
    return json({ error: "Content must be a list of up to 100 entries." }, 400);
  }

  await getStore("portfolio-content").setJSON(body.type, body.items);
  return json({ published: true });
};

export const config = { path: "/api/content" };
