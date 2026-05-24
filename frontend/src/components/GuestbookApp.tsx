"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Message } from "guestbook_client";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { GuestbookCard } from "./GuestbookCard";
import { Faq } from "./Faq";
import { MobileWalletBanner } from "./MobileWalletBanner";
import { useWallet } from "@/hooks/useWallet";
import { createGuestbookClient } from "@/lib/contract";
import { stroopsToXlm, xlmToStroops } from "@/lib/format";

export function GuestbookApp() {
  const { address, isConnecting, error: walletError, connect, disconnect } =
    useWallet();
  const [messages, setMessages] = useState<Message[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [feedError, setFeedError] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    setFeedError(null);
    try {
      const client = createGuestbookClient();
      const tx = await client.get_messages();
      const result = await tx.simulate();
      setMessages(result.result ?? []);
    } catch (e) {
      setFeedError(
        e instanceof Error ? e.message : "Could not load guestbook messages."
      );
    } finally {
      setFeedLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
    const id = setInterval(loadMessages, 15_000);
    return () => clearInterval(id);
  }, [loadMessages]);

  const totalTipsXlm = useMemo(() => {
    const sum = messages.reduce((acc, m) => acc + BigInt(m.tip_amount), 0n);
    return stroopsToXlm(sum);
  }, [messages]);

  const handleSign = useCallback(
    async (message: string, tipXlm: string) => {
      if (!address) throw new Error("Connect a wallet first.");
      const client = createGuestbookClient(address);
      const tx = await client.sign_guestbook({
        user: address,
        message,
        tip_amount: xlmToStroops(tipXlm),
      });
      await tx.signAndSend();
      await loadMessages();
    },
    [address, loadMessages]
  );

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Header
        address={address}
        isConnecting={isConnecting}
        walletError={walletError}
        onConnect={() => void connect()}
        onDisconnect={() => void disconnect()}
      />
      <MobileWalletBanner />
      <Hero messageCount={messages.length} totalTipsXlm={totalTipsXlm} />
      {feedError && (
        <p className="mx-auto max-w-6xl px-6 pb-4 text-center text-sm text-red-500">
          {feedError}
        </p>
      )}
      {feedLoading ? (
        <p className="pb-16 text-center text-sm text-[var(--muted)]">
          Loading on-chain messages…
        </p>
      ) : (
        <div className="pb-20">
          <GuestbookCard
            messages={messages}
            connectedAddress={address}
            onSign={handleSign}
            onConnect={() => void connect()}
          />
        </div>
      )}
      <Faq />
      <footer className="mx-auto flex max-w-6xl items-center justify-between px-6 pb-8 text-xs text-[var(--muted)]">
        <span>Stellar testnet · Soroban guestbook</span>
        <a
          href="https://stellar.org"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--accent)]"
        >
          stellar.org
        </a>
      </footer>
    </div>
  );
}
