export const MAX_SEN = 999999999999999999n;

export function parseMoney(value: string, allowNegative = false): bigint {
  if (
    typeof value !== "string" ||
    !/^-?(?:0|[1-9]\d{0,15})(?:\.\d{1,2})?$/.test(value)
  )
    throw new Error("INVALID_AMOUNT");
  if (!allowNegative && value.startsWith("-"))
    throw new Error("INVALID_AMOUNT");
  const negative = value.startsWith("-");
  const [whole, fraction = ""] = (negative ? value.slice(1) : value).split(".");
  const sen = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, "0"));
  if (sen > MAX_SEN) throw new Error("INVALID_AMOUNT");
  return negative ? -sen : sen;
}

export function positiveMoney(value: string): string {
  const sen = parseMoney(value);
  if (sen <= 0n) throw new Error("INVALID_AMOUNT");
  return decimal(sen);
}

export function decimal(sen: bigint): string {
  const absolute = sen < 0n ? -sen : sen;
  return `${sen < 0n ? "-" : ""}${absolute / 100n}.${String(absolute % 100n).padStart(2, "0")}`;
}

export function money(sen: bigint): string {
  const [whole, fraction] = decimal(sen < 0n ? -sen : sen).split(".");
  return `${sen < 0n ? "−" : ""}RM ${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${fraction}`;
}

export function basisPoints(part: bigint, total: bigint): number {
  if (total <= 0n || part < 0n) return 0;
  return Number((part * 10000n + total / 2n) / total);
}
