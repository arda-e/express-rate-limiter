import { FixedWindowRateLimitAdapter } from "./FixedWindowRateLimitAdapter";
import { IRateLimiterAdapter } from "./IRateLimiterAdapter";

export enum AlgorithmType {
  FIXED_WINDOW = "FIXED_WINDOW",
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
      case "FIXED_WINDOW":
        return FixedWindowRateLimitAdapter;
      // Add cases for other algorithms here
      default:
        throw new Error(`Unsupported algorithm type: ${type}`);
    }
  }
}
