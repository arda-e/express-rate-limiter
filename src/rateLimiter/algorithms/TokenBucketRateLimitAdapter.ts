import { IRateLimiterState } from '../IRateLimiterState'
import { AbstractRateLimiterAdapter } from './AbsractRateLimiterAdapter'

export class TokenBucketRateLimitAdapter extends AbstractRateLimiterAdapter {
  constructor(capacity = 100, refillRatePerSecond = 10) {
    super(capacity, refillRatePerSecond);
  }
  /**
   * Refills tokens based on the elapsed time and refill rate.
   */
  public refill(): void {
    const now = Date.now();
    const elapsedSeconds = now - this.state.lastRefill;

    if (elapsedSeconds > 0) {
      const tokensToAdd = elapsedSeconds * this.refillRatePerSecond;
      this.state.tokens = Math.min(this.state.tokens + tokensToAdd, this.capacity);
      this.state.lastRefill = now;
    }
  }

  public get State(): IRateLimiterState {
    return this.state;
  }
}
