import React, { useEffect, useState } from "react";
import staticText from "../../content/staticText.json";

/**
 * Leave a note (public) + locked inbox (passcode).
 */
export default function MailboxModal({ onClose }) {
  const copy = staticText.mailbox ?? {};
  const [tab, setTab] = useState("leave"); // leave | inbox
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [passcode, setPasscode] = useState("");
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submitNote = async (e) => {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch("/api/mailbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({
          type: "error",
          text: data.message || copy.sendError || "Could not send.",
        });
      } else {
        setStatus({
          type: "ok",
          text: copy.sendOk || "Dropped in the box. Thanks!",
        });
        setMessage("");
        setName("");
        setEmail("");
      }
    } catch {
      setStatus({
        type: "error",
        text: copy.sendError || "Could not send.",
      });
    } finally {
      setBusy(false);
    }
  };

  const unlockInbox = async (e) => {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch("/api/mailbox/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setUnlocked(false);
        setMessages([]);
        setStatus({
          type: "deny",
          text:
            data.message ||
            copy.denyDefault ||
            "It's not yours — don't try.",
        });
      } else {
        setUnlocked(true);
        setMessages(data.messages || []);
        setStatus(null);
        setPasscode("");
      }
    } catch {
      setStatus({
        type: "error",
        text: copy.unlockError || "Lock jammed. Try again.",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="mailbox-modal"
      role="dialog"
      aria-modal="true"
      aria-label={copy.title ?? "Mailbox"}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="mailbox-modal__panel">
        <header className="mailbox-modal__head">
          <div>
            <p className="mailbox-modal__eyebrow">
              {copy.eyebrow ?? "DESK · MAILBOX"}
            </p>
            <h2 className="mailbox-modal__title">
              {copy.title ?? "Leave a note"}
            </h2>
          </div>
          <button
            type="button"
            className="mailbox-modal__close"
            onClick={onClose}
          >
            {copy.close ?? "Close"}
          </button>
        </header>

        <div className="mailbox-modal__tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "leave"}
            className={`mailbox-modal__tab${
              tab === "leave" ? " mailbox-modal__tab--active" : ""
            }`}
            onClick={() => {
              setTab("leave");
              setStatus(null);
            }}
          >
            {copy.tabLeave ?? "Leave a note"}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "inbox"}
            className={`mailbox-modal__tab${
              tab === "inbox" ? " mailbox-modal__tab--active" : ""
            }`}
            onClick={() => {
              setTab("inbox");
              setStatus(null);
            }}
          >
            {copy.tabInbox ?? "Open mailbox"}
          </button>
        </div>

        {tab === "leave" ? (
          <form className="mailbox-modal__form" onSubmit={submitNote}>
            <p className="mailbox-modal__hint">
              {copy.leaveHint ??
                "Say hi, ask about a role, or drop feedback — it goes straight into my box."}
            </p>
            <label className="mailbox-modal__label">
              {copy.nameLabel ?? "Name"}
              <input
                className="mailbox-modal__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
                autoComplete="name"
              />
            </label>
            <label className="mailbox-modal__label">
              {copy.emailLabel ?? "Email"}
              <input
                className="mailbox-modal__input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={120}
                autoComplete="email"
              />
            </label>
            <label className="mailbox-modal__label">
              {copy.messageLabel ?? "Message"}
              <textarea
                className="mailbox-modal__textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={1200}
                rows={5}
                required
              />
            </label>
            <button
              type="submit"
              className="mailbox-modal__cta"
              disabled={busy || !message.trim()}
            >
              {busy
                ? copy.sending ?? "Sending…"
                : copy.send ?? "Drop in the box"}
            </button>
          </form>
        ) : (
          <div className="mailbox-modal__inbox">
            {!unlocked ? (
              <form className="mailbox-modal__form" onSubmit={unlockInbox}>
                <p className="mailbox-modal__hint">
                  {copy.lockHint ??
                    "Locked. Only the owner can read what's inside."}
                </p>
                <label className="mailbox-modal__label">
                  {copy.passLabel ?? "Passcode"}
                  <input
                    className="mailbox-modal__input"
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </label>
                <button
                  type="submit"
                  className="mailbox-modal__cta"
                  disabled={busy || !passcode.trim()}
                >
                  {busy
                    ? copy.unlocking ?? "Checking…"
                    : copy.unlock ?? "Unlock"}
                </button>
              </form>
            ) : (
              <div className="mailbox-modal__list-wrap">
                <p className="mailbox-modal__hint">
                  {messages.length
                    ? `${messages.length} note${messages.length === 1 ? "" : "s"}`
                    : copy.empty ?? "Empty box. Quiet day."}
                </p>
                <ul className="mailbox-modal__list">
                  {messages.map((m) => (
                    <li key={m.id} className="mailbox-modal__note">
                      <div className="mailbox-modal__note-meta">
                        <strong>{m.name || copy.anon || "Anonymous"}</strong>
                        {m.email ? <span>{m.email}</span> : null}
                        <time dateTime={m.created_at}>
                          {m.created_at
                            ? new Date(m.created_at).toLocaleString()
                            : ""}
                        </time>
                      </div>
                      <p>{m.message}</p>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="mailbox-modal__lock-again"
                  onClick={() => {
                    setUnlocked(false);
                    setMessages([]);
                  }}
                >
                  {copy.lockAgain ?? "Lock again"}
                </button>
              </div>
            )}
          </div>
        )}

        {status ? (
          <p
            className={`mailbox-modal__status mailbox-modal__status--${status.type}`}
            role="status"
          >
            {status.text}
          </p>
        ) : null}
      </div>
    </div>
  );
}
