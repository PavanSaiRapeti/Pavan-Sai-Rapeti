import {
  getSupabaseAdmin,
  isSupabaseConfigured,
} from "../../../lib/supabaseServer";

const SARCASTIC = [
  "Cute. It's not yours — don't try.",
  "Wrong code, detective. This mailbox isn't yours. Don't try.",
  "Nope. Not your box. Not your mail. Don't try.",
  "Bold of you. Still not yours — don't try.",
  "Access denied with style: it's not yours. Don't try.",
];

function pickSarcasm() {
  return SARCASTIC[Math.floor(Math.random() * SARCASTIC.length)];
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const passcode = String(req.body?.passcode || "").trim();
  const expected = String(process.env.MAILBOX_PASSCODE || "").trim();

  if (!expected) {
    return res.status(503).json({
      ok: false,
      error: "passcode_not_set",
      message: "Mailbox lock isn't configured on the server yet.",
    });
  }

  if (!passcode || passcode !== expected) {
    return res.status(401).json({
      ok: false,
      error: "wrong_passcode",
      message: pickSarcasm(),
    });
  }

  if (!isSupabaseConfigured()) {
    return res.status(503).json({
      ok: false,
      error: "mailbox_unavailable",
      message: "Supabase isn't configured — can't open the box yet.",
    });
  }

  const admin = getSupabaseAdmin();
  try {
    const { data, error } = await admin
      .from("mailbox_messages")
      .select("id, name, email, message, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    return res.status(200).json({ ok: true, messages: data || [] });
  } catch (err) {
    console.error("[api/mailbox/unlock]", err);
    const missing =
      err?.code === "PGRST205" ||
      /Could not find the table/i.test(err?.message || "");
    return res.status(500).json({
      ok: false,
      error: missing ? "tables_missing" : "unlock_failed",
      message: missing
        ? "Mailbox tables aren’t set up yet. Run supabase/schema.sql in the Supabase SQL editor."
        : "Lock jammed. Try again in a bit.",
    });
  }
}
