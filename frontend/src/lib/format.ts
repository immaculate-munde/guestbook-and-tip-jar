const STROOPS_PER_XLM = 10_000_000n;

export function xlmToStroops(xlm: string): bigint {
  const trimmed = xlm.trim();
  if (!trimmed || trimmed === "0") return 0n;
  const [whole, frac = ""] = trimmed.split(".");
  const padded = (frac + "0000000").slice(0, 7);
  return BigInt(whole || "0") * STROOPS_PER_XLM + BigInt(padded);
}

export function stroopsToXlm(stroops: bigint | number | string): string {
  const n = BigInt(stroops);
  if (n === 0n) return "0";
  const whole = n / STROOPS_PER_XLM;
  const frac = (n % STROOPS_PER_XLM).toString().padStart(7, "0").replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : whole.toString();
}
