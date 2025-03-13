import { IRateLimiterState } from "../IRateLimiterState";

export interface IRateLimiterAdapter {
  consume(tokens: number): boolean;
  refill(): void;
  get State(): IRateLimiterState;
}
