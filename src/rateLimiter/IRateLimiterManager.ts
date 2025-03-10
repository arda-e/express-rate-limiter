import { IRequestMetadata } from "../common";
import { IRateLimiterResult } from "./index";

/**
 * The `IRateLimiterManager` interface defines the contract for managing rate-limiting operations.
 * It acts as the central orchestrator between metadata input, engine evaluation, and rate-limiting enforcement.
 */
export interface IRateLimiterManager {
  /**
   * Handles an incoming request and applies rate-limiting ruleDefinitions.
   *
   * @param metadata - Metadata about the incoming request, including user information, API key, endpoint, and method.
   * @returns A result indicating whether the request is allowed or denied, along with additional details such as remaining tokens.
   */
  handleRequest(metadata: IRequestMetadata): IRateLimiterResult;

  /**
   * Initializes the rate limiter manager, setting up necessary dependencies such as cache stores,
   * engine engines, and adapters. Should be called during the application startup.
   */
  initialize(): void;
}
