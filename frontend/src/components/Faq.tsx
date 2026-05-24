import { FAQ_ITEMS } from "@/lib/faq";

export function Faq() {
  return (
    <section
      id="faq"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 pb-20"
    >
      <h2 className="text-center text-3xl font-bold tracking-tight">
        Frequently asked <span className="text-[var(--accent)]">questions</span>
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-[var(--muted)]">
        Quick answers about wallets, tips, and how this guestbook works on
        Stellar.
      </p>

      <ul className="mt-10 space-y-3">
        {FAQ_ITEMS.map((item) => (
          <li key={item.question}>
            <details className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] open:border-[var(--accent)]/40">
              <summary className="cursor-pointer list-none px-5 py-4 text-sm font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {item.question}
                  <span
                    className="text-[var(--muted)] transition group-open:rotate-45"
                    aria-hidden
                  >
                    +
                  </span>
                </span>
              </summary>
              <p className="border-t border-[var(--border)] px-5 py-4 text-sm leading-relaxed text-[var(--muted)]">
                {item.answer}
              </p>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
