import { AlgorithmFactory, AlgorithmType } from './AlgorithmFactory'
import { FixedWindowRateLimitAdapter } from './FixedWindowRateLimitAdapter'

describe("AlgorithmFactory", () => {
  test("returns FixedWindowRateLimitAdapter for 'FixedWindow'", () => {
    const adapter = AlgorithmFactory.getAlgorithm(AlgorithmType.FIXED_WINDOW);
    expect(adapter).toBe(FixedWindowRateLimitAdapter);
  });

  test("throws error for unsupported algorithm type", () => {
    expect(() => AlgorithmFactory.getAlgorithm(AlgorithmType.FIXED_WINDOW)).toThrow(
      "Unsupported algorithm type: Unsupported",
    );
  });
});
