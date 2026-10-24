import { describe, expect, it } from "vitest";
import fc from "fast-check";
import {
  decimal,
  parseMoney,
  positiveMoney,
  money,
} from "@/domain/finance/money";
import {
  balances,
  totals,
  weeklyComparison,
} from "@/domain/finance/calculations";
import { periodFor, localInstant, inPeriod } from "@/domain/finance/periods";
import { csvCell } from "@/domain/finance/csv";
import { emptySnapshot } from "@/domain/finance/types";

describe("exact MYR", () => {
  it("adds fractional sen correctly and preserves values beyond JS safe integer", () => {
    expect(decimal(parseMoney("0.10") + parseMoney("0.20"))).toBe("0.30");
    expect(decimal(parseMoney("9999999999999999.99"))).toBe(
      "9999999999999999.99",
    );
    expect(money(-123456n)).toBe("−RM 1,234.56");
  });
  it.each([
    "0",
    "-1",
    "NaN",
    "Infinity",
    "0.001",
    "1,000",
    " 1",
    "1e3",
    "10000000000000000",
    "01.2",
  ])("rejects non-positive/ambiguous amount %s", (v) =>
    expect(() => positiveMoney(v)).toThrow(),
  );
  it("round trips bounded sen without rounding", () =>
    fc.assert(
      fc.property(fc.bigInt({ min: 0n, max: 999999999999999999n }), (v) => {
        expect(parseMoney(decimal(v))).toBe(v);
      }),
      { numRuns: 1000 },
    ));
  it("transfers conserve total funds and do not affect flow", () =>
    fc.assert(
      fc.property(fc.bigInt({ min: 1n, max: 1000000000000000n }), (sen) => {
        const data = emptySnapshot();
        data.accounts = ["a", "b"].map((id) => ({
          id,
          name: id,
          type: "cash",
          provider: "",
          opening_balance: "100.00",
          opened_at: "2026-01-01T00:00:00Z",
          archived: false,
        }));
        data.transfers = [
          {
            id: "t",
            source_id: "a",
            destination_id: "b",
            amount: decimal(sen),
            occurred_at: "2026-01-02T00:00:00Z",
            note: "",
          },
        ];
        const b = balances(data, "2026-02-01T00:00:00Z");
        expect(b.get("a")! + b.get("b")!).toBe(20000n);
        expect(
          totals(data.transactions, {
            start: null,
            end: "2026-02-01T00:00:00Z",
          }).net,
        ).toBe(0n);
      }),
      { numRuns: 500 },
    ));
  it("suppresses comparisons for sparse records", () =>
    expect(weeklyComparison(emptySnapshot())).toBeNull());
});
describe("Malaysia dates and half-open ranges", () => {
  it("includes midnight once and leap day correctly", () => {
    const period = periodFor("custom", new Date(), "2024-02-29", "2024-02-29");
    expect(period).toEqual({
      start: "2024-02-28T16:00:00.000Z",
      end: "2024-02-29T16:00:00.000Z",
    });
    expect(inPeriod("2024-02-29T15:59:59Z", period)).toBe(true);
    expect(inPeriod("2024-02-29T16:00:00Z", period)).toBe(false);
  });
  it("starts the week on Monday local time", () =>
    expect(periodFor("week", new Date("2026-10-24T01:00:00Z")).start).toBe(
      "2026-10-18T16:00:00.000Z",
    ));
  it.each(["2026-02-30T12:00", "2026-01-01T24:01", "2026-10-24T12:60"])(
    "rejects invalid local time %s",
    (value) => expect(() => localInstant(value)).toThrow(),
  );
  it("converts local instant explicitly", () =>
    expect(localInstant("2026-10-24T08:30")).toBe("2026-10-24T00:30:00.000Z"));
});
describe("CSV injection", () => {
  it.each(["=SUM(A1:A3)", "+cmd", "-1+2", "@SUM()", " \t=1", "\nformula"])(
    "neutralizes %j",
    (value) => expect(csvCell(value).startsWith("\"'")).toBe(true),
  );
  it("escapes quotes, newlines and Unicode", () =>
    expect(csvCell('makan, "sedap"\nlagi')).toBe('"makan, ""sedap""\nlagi"'));
});
