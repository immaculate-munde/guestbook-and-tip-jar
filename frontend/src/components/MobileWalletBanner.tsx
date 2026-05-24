"use client";

import { hasWalletConnect, isMobileDevice, mobileConnectHint } from "@/lib/wallet-kit";

export function MobileWalletBanner() {
  if (!isMobileDevice()) return null;
  const hint = mobileConnectHint();
  if (!hint) return null;
  const needsWc = !hasWalletConnect();
  return (
    <div className="mx-auto max-w-6xl px-6 pb-4">
      <p
        className={`rounded-2xl border px-4 py-3 text-sm leading-relaxed ${
          needsWc
            ? "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-200"
            : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]"
        }`}
      >
        <span className="font-semibold">Mobile: </span>
        {hint}
      </p>
    </div>
  );
}
