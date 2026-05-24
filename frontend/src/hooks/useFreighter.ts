"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getAddress,
  isConnected,
  setAllowed,
} from "@stellar/freighter-api";

const FREIGHTER_TIMEOUT_MS = 2000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
}

export function useFreighter() {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    const connected = await withTimeout(isConnected(), FREIGHTER_TIMEOUT_MS);
    if (!connected?.isConnected) {
      setAddress(null);
      return null;
    }
    const addr = await withTimeout(getAddress(), FREIGHTER_TIMEOUT_MS);
    if (!addr || "error" in addr) {
      setAddress(null);
      return null;
    }
    setAddress(addr.address);
    return addr.address;
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const connect = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const allowed = await setAllowed();
      if (!allowed) {
        throw new Error("Freighter connection was denied.");
      }
      const addr = await getAddress();
      if ("error" in addr) {
        throw new Error(addr.error ?? "Could not read Freighter address.");
      }
      setAddress(addr.address);
      return addr.address;
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Failed to connect Freighter.";
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
  }, []);

  return { address, loading, error, connect, disconnect, refresh };
}
