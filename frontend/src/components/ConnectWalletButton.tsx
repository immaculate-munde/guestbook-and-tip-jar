"use client";

import { shortenAddress } from "@/lib/stellar";

type Props = {
  address: string | null;
  isConnecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
};

export function ConnectWalletButton({
  address,
  isConnecting,
  onConnect,
  onDisconnect,
}: Props) {
  if (address) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--muted)] sm:text-sm">
          {shortenAddress(address, 4)}
        </span>
        <button
          type="button"
          onClick={onDisconnect}
          className="rounded-full border border-[var(--border)] px-3 py-2 text-xs font-medium transition hover:border-[var(--muted)] sm:px-4 sm:text-sm"
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
      disabled={isConnecting}
      className="rounded-full bg-[var(--accent)] px-4 py-2.5 text-xs font-semibold text-[var(--accent-fg)] shadow transition hover:opacity-90 disabled:opacity-60 sm:px-5 sm:text-sm"
    >
      {isConnecting ? "Connecting…" : "Connect Wallet"}
    </button>
  );
}
