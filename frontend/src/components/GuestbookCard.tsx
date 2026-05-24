"use client";

import { useMemo, useState } from "react";
import type { Message } from "guestbook_client";
import { MessageFeed } from "./MessageFeed";
import { SignGuestbookModal } from "./SignGuestbookModal";
import { explorerContractUrl } from "@/lib/stellar";

type Filter = "all" | "tips" | "mine";

type Props = {
  messages: Message[];
  connectedAddress: string | null;
  onSign: (message: string, tipXlm: string) => Promise<void>;
  onConnect: () => void | Promise<void>;
};

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All Messages" },
  { id: "tips", label: "Top Tips" },
  { id: "mine", label: "My Posts" },
];

export function GuestbookCard({
  messages,
  connectedAddress,
  onSign,
  onConnect,
}: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...messages];
    if (filter === "tips") {
      list = list
        .filter((m) => BigInt(m.tip_amount) > 0n)
        .sort((a, b) => Number(BigInt(b.tip_amount) - BigInt(a.tip_amount)));
    } else if (filter === "mine" && connectedAddress) {
      list = list.filter((m) => m.author === connectedAddress);
    }
    return list;
  }, [messages, filter, connectedAddress]);

  return (
    <>
      <section
        id="guestbook"
        className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)] px-6 pb-6 pt-6 shadow-2xl"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(70, 100, 126, 0.35), transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(250, 204, 21, 0.12), transparent 45%),
              linear-gradient(135deg, #0a0f14 0%, #000 50%, #0d1520 100%)
            `,
          }}
        />

        <div className="relative z-10 flex min-h-[480px] flex-col">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium backdrop-blur transition ${
                  filter === f.id
                    ? "border-[var(--accent)] bg-[var(--accent)]/20 text-[var(--accent)]"
                    : "border-white/20 bg-black/30 text-white/80 hover:border-white/40"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-1 flex-col">
            <MessageFeed
              messages={filtered}
              connectedAddress={connectedAddress}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                if (!connectedAddress) {
                  onConnect();
                  return;
                }
                setModalOpen(true);
              }}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              {connectedAddress ? "Sign Guestbook" : "Connect to Sign"}
            </button>
            <a
              href={explorerContractUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-fg)] transition hover:opacity-90"
            >
              View on Ledger
            </a>
          </div>

          {!connectedAddress && (
            <p className="mt-3 text-xs text-white/60">
              Connect Freighter to sign the guestbook.
            </p>
          )}
        </div>
      </section>

      <SignGuestbookModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={onSign}
      />
    </>
  );
}
