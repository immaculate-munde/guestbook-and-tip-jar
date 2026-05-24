"use client";

import { shortenAddress } from "@/lib/stellar";

type Props = {
  address: string | null;
  loading: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
};

export function ConnectWalletButton({
  address,
  loading,
  onConnect,
  onDisconnect,
}: Props) {
  if (address) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden text-sm text-[var(--muted)] sm:inline">
          {shortenAddress(address, 6)}
        </span>
        <button
          type="button"
          onClick={onDisconnect}
          className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium transition hover:border-[var(--muted)]"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onConnect}
      disabled={loading}
      className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-fg)] shadow transition hover:opacity-90 disabled:opacity-60"
    >
      {loading ? "Connecting…" : "Connect Wallet"}
    </button>
  );
}
