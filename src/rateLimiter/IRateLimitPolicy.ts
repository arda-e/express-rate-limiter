import { IRateLimiterAdapter } from "./algorithms/IRateLimiterAdapter";

export interface IRateLimitPolicy {
  capacity: number;
  refillRate: number;
  algorithm: new () => IRateLimiterAdapter;
}
