import { RuleEngine } from "./RuleEngine";
import { IRateLimitRule } from "./ruleDefinitions";
import { IRequestMetadata } from "../common";
import { randomUUID, UUID } from "node:crypto";
import { IRateLimitPolicy } from "../rateLimiter";
import {
  AlgorithmFactory,
  AlgorithmType,
} from "../rateLimiter/algorithms/AlgorithmFactory";

class MockRule implements IRateLimitRule {
  readonly id: UUID;
  private readonly shouldMatch: boolean;
  private readonly policy: IRateLimitPolicy;

  constructor(id: UUID, shouldMatch: boolean, policy: IRateLimitPolicy) {
    this.id = id;
    this.shouldMatch = shouldMatch;
    this.policy = policy;
  }

  matches(): boolean {
    return this.shouldMatch;
  }

  evaluate(): IRateLimitPolicy {
    return this.policy;
  }
}

describe("RuleEngine", () => {
  let engine: RuleEngine;

  beforeEach(() => {
    engine = new RuleEngine();
  });

  test("adds a rule to the engine", () => {
    const ruleId = randomUUID();
    const algorithm = AlgorithmFactory.getAlgorithm(AlgorithmType.FIXED_WINDOW);
    const rule = new MockRule(ruleId, true, {
      capacity: 100,
      refillRate: 10,
      algorithm,
    });
    engine.addRule(rule);

    const metadata: IRequestMetadata = {
      apiKey: "key123",
      method: "GET",
      endpoint: "/api/resource",
      userId: "user",
    };
    expect(engine.evaluate(metadata)).toEqual(rule.evaluate());
  });

  test("removes a rule from the engine", () => {
    const ruleId = randomUUID();
    const algorithm = AlgorithmFactory.getAlgorithm(AlgorithmType.FIXED_WINDOW);
    const rule = new MockRule(ruleId, true, {
      capacity: 100,
      refillRate: 10,
      algorithm,
    });
    engine.addRule(rule);
    engine.removeRule(ruleId);

    const metadata: IRequestMetadata = {
      apiKey: "key123",
      method: "GET",
      endpoint: "/api/resource",
      userId: "user",
    };
    expect(() => engine.evaluate(metadata)).toThrow("No matching rule found");
  });

  test("evaluates metadata against the first matching rule", () => {
    const rule1id = randomUUID();
    const rule2id = randomUUID();
    const algorithm = AlgorithmFactory.getAlgorithm(AlgorithmType.FIXED_WINDOW);
    const rule1 = new MockRule(rule1id, false, {
      capacity: 100,
      refillRate: 10,
      algorithm,
    });
    const rule2 = new MockRule(rule2id, true, {
      capacity: 200,
      refillRate: 20,
      algorithm,
    });
    engine.addRule(rule1);
    engine.addRule(rule2);

    const metadata: IRequestMetadata = {
      apiKey: "key123",
      method: "GET",
      endpoint: "/api/resource",
      userId: "user",
    };
    expect(engine.evaluate(metadata)).toEqual(rule2.evaluate());
  });

  test("throws error when no rules match", () => {
    const ruleId = randomUUID();
    const algorithm = AlgorithmFactory.getAlgorithm(AlgorithmType.FIXED_WINDOW);

    const rule = new MockRule(ruleId, false, {
      capacity: 100,
      refillRate: 10,
      algorithm,
    });
    engine.addRule(rule);

    const metadata: IRequestMetadata = {
      apiKey: "key123",
      method: "GET",
      endpoint: "/api/resource",
      userId: "user",
    };
    expect(() => engine.evaluate(metadata)).toThrow("No matching rule found");
  });

  test("throws error when no rules exist", () => {
    const metadata: IRequestMetadata = {
      apiKey: "key123",
      method: "GET",
      endpoint: "/api/resource",
      userId: "user",
    };
    expect(() => engine.evaluate(metadata)).toThrow("No matching rule found");
  });
});
