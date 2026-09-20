import {
  getSupabaseAdmin,
  isSupabaseConfigured,
} from "../../../lib/supabaseServer";

const MAX_NAME = 80;
const MAX_EMAIL = 120;
const MAX_MESSAGE = 1200;

function clean(str, max) {
  return String(str || "")
    .trim()
    .slice(0, max);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!isSupabaseConfigured()) {
    return res.status(503).json({
      error: "mailbox_unavailable",
      message: "Mailbox is not hooked up yet. Try again later.",
    });
  }

  const name = clean(req.body?.name, MAX_NAME);
  const email = clean(req.body?.email, MAX_EMAIL);
  const message = clean(req.body?.message, MAX_MESSAGE);

  if (!message || message.length < 2) {
    return res.status(400).json({
      error: "message_required",
      message: "Write at least a couple characters.",
    });
  }

  const admin = getSupabaseAdmin();
  try {
    const { error } = await admin.from("mailbox_messages").insert({
      name: name || null,
      email: email || null,
      message,
    });
    if (error) throw error;
    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error("[api/mailbox]", err);
    return res.status(500).json({
      error: "send_failed",
      message: "Could not drop that note in the box. Try again.",
    });
  }
}
