import { IRequestMetadata } from "../../common/";
import { IRateLimitPolicy } from "../../rateLimiter";
import { UUID } from "node:crypto";

/**
 * The `IRateLimitRule` interface defines the contract for a rate-limiting rule.
 *
 * Each rule determines whether it applies to a given request and, if so,
 * evaluates and provides the applicable rate-limiting policy.
 */
export interface IRateLimitRule {
  id: UUID;
  /**
   * Checks whether this rule matches the given request metadata.
   *
   * @param metadata - Metadata about the incoming request, such as user ID, API key, endpoint, and method.
   * @returns `true` if the rule matches the request, otherwise `false`.
   */
  matches(metadata: IRequestMetadata): boolean;

  /**
   * Evaluates the rule and returns the rate-limiting policy to be applied
   * if the rule matches the request.
   *
   * @param metadata - Metadata about the incoming request, such as user ID, API key, endpoint, and method.
   * @returns The `IRateLimitPolicy` that specifies the capacity, refill rate,
   *          and algorithm for rate limiting.
   */
  evaluate(metadata: IRequestMetadata): IRateLimitPolicy;
}
