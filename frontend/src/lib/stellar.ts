export const RPC_URL =
  process.env.NEXT_PUBLIC_STELLAR_RPC_URL ??
  "https://soroban-testnet.stellar.org";

export const NETWORK_PASSPHRASE =
  process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE ??
  "Test SDF Network ; September 2015";

export const CONTRACT_ID =
  process.env.NEXT_PUBLIC_GUESTBOOK_CONTRACT_ID ?? "";

export const EXPLORER_BASE = "https://stellar.expert/explorer/testnet";

export function explorerContractUrl(contractId: string = CONTRACT_ID) {
  return `${EXPLORER_BASE}/contract/${contractId}`;
}

export function explorerAddressUrl(address: string) {
  return `${EXPLORER_BASE}/account/${address}`;
}

export function shortenAddress(address: string, chars = 4) {
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars + 1)}…${address.slice(-chars)}`;
}
