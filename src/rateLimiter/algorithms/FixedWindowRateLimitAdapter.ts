import { AbstractRateLimiterAdapter } from './AbsractRateLimiterAdapter'

export class FixedWindowRateLimitAdapter extends AbstractRateLimiterAdapter {
  constructor(capacity = 100, refillRatePerSecond = 10) {
    super(capacity, refillRatePerSecond);
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
}
