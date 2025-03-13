import { FixedWindowRateLimitAdapter } from "./FixedWindowRateLimitAdapter";
import { IRateLimiterAdapter } from "./IRateLimiterAdapter";
import { TokenBucketRateLimitAdapter } from './TokenBucketRateLimitAdapter'

export enum AlgorithmType {
  FIXED_WINDOW = "FIXED_WINDOW",
  TOKEN_BUCKET = "TOKEN_BUCKET",
}

export class AlgorithmFactory {
  /**
   * Returns the appropriate rate limiter adapter class based on the algorithm type.
   * @param type - The type of algorithm (e.g., "FixedWindow", "SlidingWindow").
   * @returns The class constructor for the adapter.
   * @throws An error if the algorithm type is unsupported.
   */
  public static getAlgorithm(
    type: AlgorithmType,
  ): new () => IRateLimiterAdapter {
    switch (type) {
      case AlgorithmType.FIXED_WINDOW:
        return FixedWindowRateLimitAdapter;
      case AlgorithmType.TOKEN_BUCKET:
        return TokenBucketRateLimitAdapter;
      default:
        throw new Error(`Unsupported algorithm type: ${type}`);
    }
  }
}
