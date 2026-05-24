"use client";

import { Buffer } from "buffer";

if (typeof globalThis !== "undefined") {
  (globalThis as typeof globalThis & { Buffer?: typeof Buffer }).Buffer ??=
    Buffer;
}

import { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit/sdk";
import { defaultModules } from "@creit.tech/stellar-wallets-kit/modules/utils";
import { AlbedoModule } from "@creit.tech/stellar-wallets-kit/modules/albedo";
import { WalletConnectModule } from "@creit.tech/stellar-wallets-kit/modules/wallet-connect";
import { Networks } from "@creit.tech/stellar-wallets-kit/types";
import type { ModuleInterface } from "@creit.tech/stellar-wallets-kit/types";
import { NETWORK_PASSPHRASE } from "./stellar";

let initialized = false;
const CONNECT_TIMEOUT_MS = 90_000;

export function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

export function hasWalletConnect(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim());
}

function walletConnectModule(): WalletConnectModule | null {
  const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim();
  if (!projectId) return null;
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://localhost:3000";
  return new WalletConnectModule({
    projectId,
    metadata: {
      name: "Stellar Guestbook",
      description: "Decentralized Guestbook & Tip Jar on Soroban",
      url: origin,
      icons: [`${origin}/favicon.ico`],
    },
  });
}

function buildModules(): ModuleInterface[] {
  const wc = walletConnectModule();
  if (isMobileDevice()) {
    const modules: ModuleInterface[] = [new AlbedoModule()];
    if (wc) modules.unshift(wc);
    return modules;
  }
  // defaultModules: Freighter, xBull, Albedo, Rabet, LOBSTR, Hana, etc.
  // Ledger/Trezor/HOT omitted — they break Next.js/Turbopack bundling on Vercel.
  const modules: ModuleInterface[] = [...defaultModules()];
  if (wc) modules.push(wc);
  return modules;
}

export function initWalletKit() {
  if (initialized || typeof window === "undefined") return;
  StellarWalletsKit.init({
    modules: buildModules(),
    network: Networks.TESTNET,
    authModal: { hideUnsupportedWallets: true, showInstallLabel: true },
  });
  initialized = true;
}

function withTimeout<T>(promise: Promise<T>, ms: number, message: string) {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(message)), ms)
    ),
  ]);
}

export function mobileConnectHint(): string | null {
  if (!isMobileDevice()) return null;
  if (hasWalletConnect()) {
    return "Tap Connect Wallet, choose WalletConnect, then approve in your wallet app (LOBSTR, Freighter, etc.).";
  }
  return "WalletConnect is not configured on this site. Try Albedo, or ask the host to add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID.";
}

export async function connectWallet(): Promise<string> {
  initWalletKit();
  const { address } = await withTimeout(
    StellarWalletsKit.authModal(),
    CONNECT_TIMEOUT_MS,
    "Connection timed out. Approve the request in your wallet app."
  );
  return address;
}

export async function disconnectWallet(): Promise<void> {
  initWalletKit();
  await StellarWalletsKit.disconnect();
}

export async function getConnectedAddress(): Promise<string | null> {
  initWalletKit();
  try {
    const { address } = await withTimeout(
      StellarWalletsKit.getAddress(),
      5000,
      ""
    );
    return address;
  } catch {
    return null;
  }
}

export async function signWithWallet(xdr: string, address: string) {
  initWalletKit();
  const { signedTxXdr } = await withTimeout(
    StellarWalletsKit.signTransaction(xdr, {
      networkPassphrase: NETWORK_PASSPHRASE,
      address,
    }),
    CONNECT_TIMEOUT_MS,
    "Signing timed out. Confirm in your wallet app."
  );
  return signedTxXdr;
}
