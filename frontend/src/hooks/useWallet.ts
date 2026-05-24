"use client";

import { useCallback, useEffect, useState } from "react";
import { KitEventType } from "@creit.tech/stellar-wallets-kit/types";
import { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit/sdk";
import {
  connectWallet,
  disconnectWallet,
  getConnectedAddress,
  initWalletKit,
} from "@/lib/wallet-kit";

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const restore = async () => {
      try {
        initWalletKit();
        const addr = await getConnectedAddress();
        if (!cancelled && addr) setAddress(addr);
      } catch {
        /* no prior session */
      }
    };

    void restore();

    initWalletKit();

    const offDisconnect = StellarWalletsKit.on(
      KitEventType.DISCONNECT,
      () => setAddress(null)
    );

    const offState = StellarWalletsKit.on(
      KitEventType.STATE_UPDATED,
      async () => {
        const addr = await getConnectedAddress();
        if (!cancelled) setAddress(addr);
      }
    );

    return () => {
      cancelled = true;
      offDisconnect();
      offState();
    };
  }, []);

  const connect = useCallback(async () => {
    setError(null);
    setIsConnecting(true);
    try {
      const addr = await connectWallet();
      setAddress(addr);
      return addr;
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Failed to connect wallet.";
      setError(msg);
      throw e;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    setError(null);
    await disconnectWallet();
    setAddress(null);
  }, []);

  return { address, isConnecting, error, connect, disconnect };
}
