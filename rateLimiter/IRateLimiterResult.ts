export interface IRateLimiterResult {
    allowed: boolean;
    message: string;
    remainingTokens: number;
}