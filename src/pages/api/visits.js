import {
  getSupabaseAdmin,
  isSupabaseConfigured,
} from "../../lib/supabaseServer";

function cleanVisitorId(raw) {
  const id = String(raw || "").trim();
  if (id.length < 8 || id.length > 80) return null;
  if (!/^[A-Za-z0-9_-]+$/.test(id)) return null;
  return id;
}

async function readCount(admin) {
  const { data, error } = await admin
    .from("site_stats")
    .select("visit_count")
    .eq("id", "main")
    .maybeSingle();
  if (error) throw error;
  return Number(data?.visit_count ?? 0);
}

/** Record visitor; increment only if this visitor_id is new. */
async function recordUniqueVisit(admin, visitorId) {
  const { data, error } = await admin.rpc("record_unique_visit", {
    p_visitor_id: visitorId,
  });
  if (!error && data) {
    const count = Number(data.count ?? data?.count);
    if (Number.isFinite(count)) {
      return {
        count,
        isNew: Boolean(data.isNew ?? data.is_new),
      };
    }
  }

  // Fallback without RPC: insert visitor row, bump only on first insert
  const { error: insertError } = await admin.from("site_visitors").insert({
    visitor_id: visitorId,
  });

  if (!insertError) {
    const { data: rpcCount, error: bumpError } = await admin.rpc(
      "increment_visit_count"
    );
    if (!bumpError && rpcCount != null) {
      return { count: Number(rpcCount), isNew: true };
    }
    const current = await readCount(admin);
    const next = current + 1;
    await admin.from("site_stats").upsert({
      id: "main",
      visit_count: next,
      updated_at: new Date().toISOString(),
    });
    return { count: next, isNew: true };
  }

  // Duplicate visitor (unique violation) or other — refresh last_seen, no bump
  if (insertError.code === "23505" || /duplicate|unique/i.test(insertError.message || "")) {
    await admin
      .from("site_visitors")
      .update({ last_seen: new Date().toISOString() })
      .eq("visitor_id", visitorId);
    const count = await readCount(admin);
    return { count, isNew: false };
  }

  throw insertError;
}

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!isSupabaseConfigured()) {
    return res.status(503).json({
      error: "visits_unavailable",
      message: "Supabase is not configured yet.",
      count: null,
    });
  }

  const admin = getSupabaseAdmin();
  try {
    if (req.method === "GET") {
      const count = await readCount(admin);
      return res.status(200).json({ count });
    }

    const visitorId = cleanVisitorId(req.body?.visitorId);
    if (!visitorId) {
      return res.status(400).json({
        error: "visitor_required",
        message: "visitorId is required.",
        count: null,
      });
    }

    const result = await recordUniqueVisit(admin, visitorId);
    return res.status(200).json(result);
  } catch (err) {
    console.error("[api/visits]", err);
    return res.status(500).json({
      error: "visits_failed",
      message: err?.message || "visits_failed",
      count: null,
    });
  }
}
