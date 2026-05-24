type Props = {
  messageCount: number;
  totalTipsXlm: string;
};

export function Hero({ messageCount, totalTipsXlm }: Props) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-10 pt-4 text-center">
      <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
        Sign the{" "}
        <span className="text-[var(--accent)]">Decentralized Guestbook</span>
        <br />
        on <span className="text-[var(--accent)]">Stellar</span>
      </h1>

      <div className="mx-auto mt-12 grid max-w-5xl gap-10 text-left md:grid-cols-2 md:items-start">
        <div className="flex flex-col gap-4">
          <div className="flex -space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--background)] bg-[var(--accent)] text-xs font-bold text-[var(--accent-fg)]"
              >
                ★
              </div>
            ))}
          </div>
          <p className="text-sm text-[var(--muted)]">
            On-chain messages{" "}
            <span className="font-semibold text-[var(--foreground)]">
              {messageCount} signed
            </span>
          </p>
          <p className="text-sm text-[var(--muted)]">
            Tips collected{" "}
            <span className="font-semibold text-[var(--foreground)]">
              {totalTipsXlm} XLM
            </span>
          </p>
        </div>

        <p className="text-base leading-relaxed text-[var(--muted)]">
          Connect any supported Stellar wallet, leave a short message on the
          Soroban ledger, and
          optionally send a testnet tip directly to the host wallet. Every
          signature is permanent, verifiable, and readable by anyone.
        </p>
      </div>
    </section>
  );
}
