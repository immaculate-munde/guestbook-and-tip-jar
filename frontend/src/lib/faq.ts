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
    question: "Do I need a wallet?",
    answer:
      "You need the Freighter browser extension to sign messages and send tips. Reading the feed works without a wallet. Switch Freighter to Testnet and fund your account with test XLM from a friendbot or faucet.",
  },
  {
    question: "Where do tips go?",
    answer:
      "Tips are transferred on-chain from your account to the admin address set when the contract was deployed. They are not held in the guestbook contract.",
  },
  {
    question: "Can I edit or delete my message?",
    answer:
      "No. Messages are append-only on the ledger. Plan your text before signing—the transaction cannot be undone.",
  },
  {
    question: "Why does signing fail or cost XLM?",
    answer:
      "Every Soroban transaction requires a small network fee paid in XLM. If you add a tip, that amount is sent in addition to the fee. Make sure your testnet account has enough XLM.",
  },
  {
    question: "Is this mainnet?",
    answer:
      "This demo uses Stellar testnet only. Balances and messages are not real money. Do not send mainnet assets expecting them to appear here.",
  },
  {
    question: "Why HTTPS on localhost?",
    answer:
      "Freighter only connects to secure origins. Local dev uses HTTPS via Next.js experimental HTTPS. If you see a certificate warning, run npm run setup:https in the frontend folder and open the app in Chrome or Firefox—not an embedded IDE browser.",
  },
  {
    question: "What if the feed does not load?",
    answer:
      "Check that NEXT_PUBLIC_GUESTBOOK_CONTRACT_ID and the RPC URL are set correctly. Public testnet RPC can be slow or rate-limited; wait a moment and refresh. View the contract on Stellar Expert via “View on Ledger.”",
  },
];
