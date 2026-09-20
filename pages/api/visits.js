import {
  getSupabaseAdmin,
  isSupabaseConfigured,
} from "../../src/lib/supabaseServer";

async function readCount(admin) {
  const { data, error } = await admin
    .from("site_stats")
    .select("visit_count")
    .eq("id", "main")
    .maybeSingle();
  if (error) throw error;
  return Number(data?.visit_count ?? 0);
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

    // Atomic-ish increment: read → write. Fine for portfolio traffic.
    const current = await readCount(admin);
    const next = current + 1;
    const { error } = await admin
      .from("site_stats")
      .upsert({
        id: "main",
        visit_count: next,
        updated_at: new Date().toISOString(),
      });
    if (error) throw error;
    return res.status(200).json({ count: next });
  } catch (err) {
    console.error("[api/visits]", err);
    return res.status(500).json({ error: "visits_failed", count: null });
  }
}
