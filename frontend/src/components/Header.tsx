"use client";

import { ConnectWalletButton } from "./ConnectWalletButton";
import { ThemeToggle } from "./ThemeToggle";

type Props = {
  address: string | null;
  isConnecting: boolean;
  walletError: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
};

const nav = [
  { label: "Home", href: "#" },
  { label: "Guestbook", href: "#guestbook" },
  { label: "FAQ", href: "#faq" },
] as const;

export function Header({
  address,
  isConnecting,
  walletError,
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
            key={item.label}
            href={item.href}
            className={`text-sm font-medium transition hover:text-[var(--accent)] ${
              i === 0
                ? "border-b-2 border-[var(--accent)] pb-0.5 text-[var(--foreground)]"
                : "text-[var(--muted)]"
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="flex flex-col items-end gap-1">
          <ConnectWalletButton
            address={address}
            isConnecting={isConnecting}
            onConnect={onConnect}
            onDisconnect={onDisconnect}
          />
          {walletError && (
            <p className="max-w-[12rem] text-right text-xs text-red-500 sm:max-w-xs">
              {walletError}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
