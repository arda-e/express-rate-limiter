export interface IRateLimiterState {
    tokens: number;
    lastRefill: number;
}