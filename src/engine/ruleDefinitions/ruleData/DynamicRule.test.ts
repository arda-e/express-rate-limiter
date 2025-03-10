import { DynamicRule } from "./DynamicRule";
import { IRequestMetadata } from "../../../common";

class MockAlgorithm {
  consume = jest.fn();
  refill = jest.fn();
  getState = jest.fn(() => ({ tokens: 100, lastRefill: Date.now() }));
}

describe("DynamicRule", () => {
  const rule = new DynamicRule("key123", "POST", MockAlgorithm);

  test("matches returns true for matching apiKey and method", () => {
    const metadata: IRequestMetadata = {
      apiKey: "key123",
      method: "POST",
      endpoint: "/api/resource",
      userId: "user",
    };
    expect(rule.matches(metadata)).toBe(true);
  });

  test("matches returns false for non-matching apiKey", () => {
    const metadata: IRequestMetadata = {
      apiKey: "key456",
      method: "POST",
      endpoint: "/api/resource",
      userId: "user",
    };
    expect(rule.matches(metadata)).toBe(false);
  });

  test("matches returns false for non-matching method", () => {
    const metadata: IRequestMetadata = {
      apiKey: "key123",
      method: "GET",
      endpoint: "/api/resource",
      userId: "user",
    };
    expect(rule.matches(metadata)).toBe(false);
  });

  test("evaluate returns correct policy", () => {
    const metadata: IRequestMetadata = {
      apiKey: "key123",
      method: "POST",
      endpoint: "/api/resource",
      userId: "user",
    };
    const policy = rule.evaluate(metadata);

    expect(policy.capacity).toBe(100);
    expect(policy.refillRate).toBe(10);
    expect(new policy.algorithm()).toBeInstanceOf(MockAlgorithm);
  });
});
