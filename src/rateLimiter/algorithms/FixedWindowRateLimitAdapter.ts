import { IRateLimiterAdapter } from "./IRateLimiterAdapter";
import { IRateLimiterState } from "../IRateLimiterState";

export class FixedWindowRateLimitAdapter implements IRateLimiterAdapter {
  private state: IRateLimiterState;

  constructor() {
    this.state = {
      tokens: 100, // Initial token count
      lastRefill: Date.now(), // Timestamp of the last refill
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
   * Refills tokens based on the elapsed time and refill rate.
   */
  public refill(): void {
    const now = Date.now();
    const elapsed = now - this.state.lastRefill;
    const refillRate = 10; // Example: 10 tokens per second
    const tokensToAdd = Math.floor((elapsed / 1000) * refillRate);

    if (tokensToAdd > 0) {
      this.state.tokens = Math.min(this.state.tokens + tokensToAdd, 100); // Max capacity is 100
      this.state.lastRefill = now;
    }
  }

  /**
   * Returns the current state of the rate limiter.
   * @returns The `IRateLimiterState` object.
   */
  public getState(): IRateLimiterState {
    return this.state;
  }
}
