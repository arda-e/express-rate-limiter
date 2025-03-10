import { StaticRule } from "./StaticRule";
import { IRequestMetadata } from "../../../common";

class MockAlgorithm {
  consume = jest.fn();
  refill = jest.fn();
  getState = jest.fn(() => ({ tokens: 100, lastRefill: Date.now() }));
}

describe("StaticRule", () => {
  const rule = new StaticRule("/api/resource", 100, 10, MockAlgorithm);

  test("matches returns true for matching endpoint", () => {
    const metadata: IRequestMetadata = {
      endpoint: "/api/resource",
      method: "GET",
      apiKey: "key",
      userId: "user",
    };
    expect(rule.matches(metadata)).toBe(true);
  });

  test("matches returns false for non-matching endpoint", () => {
    const metadata: IRequestMetadata = {
      endpoint: "/api/other",
      method: "GET",
      apiKey: "key",
      userId: "user",
    };
    expect(rule.matches(metadata)).toBe(false);
  });

  test("evaluate returns correct policy", () => {
    const metadata: IRequestMetadata = {
      endpoint: "/api/resource",
      method: "GET",
      apiKey: "key",
      userId: "user",
    };
    const policy = rule.evaluate(metadata);
    expect(policy.capacity).toBe(100);
    expect(policy.refillRate).toBe(10);
    expect(new policy.algorithm()).toBeInstanceOf(MockAlgorithm);
  });
});
