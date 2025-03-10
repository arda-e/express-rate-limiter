import { IRateLimitRule } from "../ruleDefinitions";

/**
 * The `IRuleLoader` interface defines the contract for dynamically loading
 * rate-limiting ruleDefinitions into the system.
 *
 * Implementations of this interface can load ruleDefinitions from various sources,
 * such as configuration files, databases, or remote APIs.
 */
export interface IRuleLoader {
  /**
   * Loads all available rate-limiting ruleDefinitions.
   *
   * @returns An array of `IRateLimitRule` objects, each representing
   *          a rate-limiting rule to be used by the system.
   */
  loadRules(): Promise<IRateLimitRule[]>;
}
