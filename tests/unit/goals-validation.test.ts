import { describe, expect, it } from "vitest";
import { mutation } from "@/features/finance/validation";
const valid = {
  kind: "goal",
  id: "00000000-0000-4000-8000-000000000061",
  name: "Synthetic savings",
  target_amount: "100.00",
  saved_amount: "0.10",
  target_date: "2027-01-01",
  edit: false,
};
describe("savings goal validation", () => {
  it("preserves exact decimals and allows zero starting savings", () => {
    expect(mutation.parse(valid)).toEqual(valid);
    expect(mutation.parse({ ...valid, saved_amount: "0" })).toMatchObject({
      saved_amount: "0.00",
    });
  });
  it("rejects forged owner fields and invalid money or dates", () => {
    expect(
      mutation.safeParse({
        ...valid,
        user_id: "00000000-0000-4000-8000-000000000002",
      }).success,
    ).toBe(false);
    for (const v of [
      "0",
      "-1",
      "1.001",
      "NaN",
      "Infinity",
      "1e3",
      "10000000000000000",
    ])
      expect(mutation.safeParse({ ...valid, target_amount: v }).success).toBe(
        false,
      );
    for (const v of ["-1", "1.001", "NaN", "Infinity"])
      expect(mutation.safeParse({ ...valid, saved_amount: v }).success).toBe(
        false,
      );
    expect(
      mutation.safeParse({ ...valid, target_date: "2027-02-30" }).success,
    ).toBe(false);
  });
});
