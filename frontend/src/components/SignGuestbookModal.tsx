"use client";

import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (message: string, tipXlm: string) => Promise<void>;
};

export function SignGuestbookModal({ open, onClose, onSubmit }: Props) {
  const [message, setMessage] = useState("");
  const [tipXlm, setTipXlm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit(message, tipXlm);
      setMessage("");
      setTipXlm("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transaction failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl"
      >
        <h2 className="text-xl font-bold">Sign the guestbook</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Your message is stored on the Stellar ledger.
        </p>

        <label className="mt-5 block text-sm font-medium">
          Message
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={280}
            required
            rows={4}
            placeholder="Awesome project!"
            className="mt-2 w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
          />
        </label>

        <label className="mt-4 block text-sm font-medium">
          Tip (optional, XLM)
          <input
            type="text"
            inputMode="decimal"
            value={tipXlm}
            onChange={(e) => setTipXlm(e.target.value)}
            placeholder="0.5"
            className="mt-2 w-full rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
          />
        </label>

        {error && (
          <p className="mt-3 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-[var(--border)] py-2.5 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !message.trim()}
            className="flex-1 rounded-full bg-[var(--accent)] py-2.5 text-sm font-semibold text-[var(--accent-fg)] disabled:opacity-50"
          >
            {submitting ? "Signing…" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
