import { Client } from "guestbook_client";
import { CONTRACT_ID, NETWORK_PASSPHRASE, RPC_URL } from "./stellar";
import { signWithWallet } from "./wallet-kit";

export type GuestbookClient = Client;

export function createGuestbookClient(publicKey?: string): Client {
  if (!CONTRACT_ID) {
    throw new Error(
      "NEXT_PUBLIC_GUESTBOOK_CONTRACT_ID is not set. Run npm run setup from the repo root."
    );
  }

  const options: ConstructorParameters<typeof Client>[0] = {
    contractId: CONTRACT_ID,
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: RPC_URL,
    publicKey,
  };

  if (publicKey) {
    options.signTransaction = async (xdr: string) => {
      const signedTxXdr = await signWithWallet(xdr, publicKey);
      return { signedTxXdr };
    };
  }

  return new Client(options);
}
