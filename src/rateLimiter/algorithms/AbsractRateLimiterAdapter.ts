import { IRateLimiterAdapter } from "./IRateLimiterAdapter";
import { IRateLimiterState } from "../IRateLimiterState";

/**
 * Abstract base class for rate limiter adapters that provides common functionality
 * and enforces the implementation of algorithm-specific methods.
 */
export abstract class AbstractRateLimiterAdapter implements IRateLimiterAdapter {
  protected state: IRateLimiterState;
  protected capacity: number;
  protected refillRatePerSecond: number;

  /**
   * @param capacity Maximum number of tokens the bucket can hold
   * @param refillRatePerSecond Number of tokens added per second
   */
  constructor(capacity = 100, refillRatePerSecond = 10) {
    this.capacity = capacity;
    this.refillRatePerSecond = refillRatePerSecond;
    this.state = {
      tokens: capacity,
      lastRefill: Date.now(),
    };
  }

  /**
   * Consumes a specific number of tokens.
   * @param tokens - Number of tokens to consume.
   * @returns `true` if tokens were successfully consumed; otherwise, `false`.
   */
  public consume(tokens: number): boolean {
    this.refill();

    if (this.state.tokens >= tokens) {
      this.state.tokens -= tokens;
      return true;
    }
    return false;
  }

  /**
   * Refills tokens based on the algorithm-specific implementation.
   * This method must be implemented by subclasses.
   */
  public abstract refill(): void;

  /**
   * Returns the current state of the rate limiter.
   * @returns The `IRateLimiterState` object.
   */
  public get State(): IRateLimiterState {
    return this.state;
  }

  /**
   * Resets the state to initial values.
   */
  public reset(): void {
    this.state.tokens = this.capacity;
    this.state.lastRefill = Date.now();
  }
}
