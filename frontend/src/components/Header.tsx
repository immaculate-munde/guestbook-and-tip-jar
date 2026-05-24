"use client";

import { ConnectWalletButton } from "./ConnectWalletButton";
import { ThemeToggle } from "./ThemeToggle";

type Props = {
  address: string | null;
  walletLoading: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
};

const nav = ["Home", "Guestbook", "FAQ"];

export function Header({
  address,
  walletLoading,
  onConnect,
  onDisconnect,
}: Props) {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)] text-lg font-bold text-[var(--accent-fg)]">
          G
        </div>
        <span className="text-lg font-semibold tracking-tight">Guestbook</span>
      </div>

      <nav className="hidden items-center gap-8 md:flex">
        {nav.map((item, i) => (
          <a
            key={item}
            href={i === 0 ? "#" : `#${item.toLowerCase()}`}
            className={`text-sm font-medium transition hover:text-[var(--accent)] ${
              i === 0
                ? "border-b-2 border-[var(--accent)] pb-0.5 text-[var(--foreground)]"
                : "text-[var(--muted)]"
            }`}
          >
            {item}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <ConnectWalletButton
          address={address}
          loading={walletLoading}
          onConnect={onConnect}
          onDisconnect={onDisconnect}
        />
      </div>
    </header>
  );
}
