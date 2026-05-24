export type FaqItem = {
  question: string;
  answer: string;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What is this app?",
    answer:
      "A decentralized guestbook on Stellar testnet. Messages are stored permanently by a Soroban smart contract. You can optionally attach a small XLM tip that goes directly to the site host.",
  },
  {
    question: "How do I connect on my phone?",
    answer:
      "Tap Connect Wallet, then WalletConnect, and pick your app (LOBSTR, Freighter, etc.). Approve the connection in the wallet app when it opens. If you only see Albedo, the host must add WalletConnect (NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID).",
  },
  {
    question: "Which wallets are supported?",
    answer:
      "Desktop: Freighter, xBull, Albedo, Rabet, LOBSTR, Hana, and more. Phone: WalletConnect or Albedo.",
  },
  {
    question: "Do I need a wallet?",
    answer:
      "You need a Stellar wallet to sign messages and send tips. Reading the feed works without a wallet. Use Testnet with test XLM from a friendbot or faucet.",
  },
  {
    question: "Where do tips go?",
    answer:
      "Tips are transferred on-chain from your account to the admin address set when the contract was deployed.",
  },
  {
    question: "Can I edit or delete my message?",
    answer:
      "No. Messages are append-only on the ledger.",
  },
  {
    question: "Why does signing fail or cost XLM?",
    answer:
      "Every Soroban transaction requires a small network fee in XLM. Tips are additional. Keep enough testnet XLM in your account.",
  },
  {
    question: "Is this mainnet?",
    answer:
      "No—this demo uses Stellar testnet only.",
  },
  {
    question: "What if the feed does not load?",
    answer:
      "Check contract ID and RPC env vars. Public testnet RPC can be slow; refresh or use View on Ledger.",
  },
];
