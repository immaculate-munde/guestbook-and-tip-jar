"use client";

import type { Message } from "guestbook_client";
import { explorerAddressUrl, shortenAddress } from "@/lib/stellar";
import { stroopsToXlm } from "@/lib/format";

type Props = {
  messages: Message[];
  connectedAddress: string | null;
};

export function MessageFeed({ messages, connectedAddress }: Props) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center text-[var(--muted)]">
        <p className="text-lg font-medium text-[var(--foreground)]">
          No messages yet
        </p>
        <p className="max-w-sm text-sm">
          Be the first to sign the guestbook on Stellar testnet.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex max-h-[420px] flex-1 flex-col gap-3 overflow-y-auto pr-1">
      {messages.map((msg, i) => (
        <li
          key={`${msg.author}-${msg.ledger}-${i}`}
          className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm"
        >
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <a
              href={explorerAddressUrl(msg.author)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-[var(--accent)] hover:underline"
            >
              {shortenAddress(msg.author, 8)}
              {connectedAddress === msg.author ? " (you)" : ""}
            </a>
            <span className="text-xs text-[var(--muted)]">
              ledger {msg.ledger}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-[var(--foreground)]">
            {msg.text}
          </p>
          {BigInt(msg.tip_amount) > 0n && (
            <p className="mt-2 text-xs font-medium text-[var(--accent)]">
              Tip: {stroopsToXlm(msg.tip_amount)} XLM
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
