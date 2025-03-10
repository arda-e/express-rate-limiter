import { IRuleLoader } from './IRuleLoader'
import { DynamicRule, IRateLimitRule, IRawRuleData, StaticRule } from '../ruleDefinitions'
import { AlgorithmFactory, AlgorithmType } from '../../rateLimiter/algorithms/AlgorithmFactory'

/**
 * The `AbstractRuleLoader` class provides shared functionality for all
 * rule loaders, including rule creation and validation.
 */
export abstract class AbstractRuleLoader implements IRuleLoader {
  /**
   * Loads all rate-limiting ruleDefinitions. Subclasses must implement this method
   * to fetch raw rule data from their specific source.
   *
   * @returns An array of `IRateLimitRule` objects.
   */
  public abstract loadRules(): Promise<IRateLimitRule[]>;

  /**
   * Converts raw rule data into a specific `IRateLimitRule` instance.
   *
   * @param ruleData - The raw rule data to convert.
   * @returns An instance of `IRateLimitRule`.
   * @throws Error if the rule type is unsupported.
   */
  protected createRule(ruleData: IRawRuleData): IRateLimitRule {
    const Algorithm = AlgorithmFactory.getAlgorithm(AlgorithmType.FIXED_WINDOW);

    switch (ruleData.type) {
      case "StaticRule": {
        // Validate and create a StaticRule
        const staticData = ruleData.data;
        if (
          !staticData.endpoint ||
          !staticData.capacity ||
          !staticData.refillRate
        ) {
          throw new Error(
            "StaticRule requires 'endpoint', 'capacity', and 'refillRate'.",
          );
        }
        return new StaticRule(
          staticData.endpoint,
          staticData.capacity,
          staticData.refillRate,
          Algorithm,
        );
      }
      case "DynamicRule": {
        const dynamicData = ruleData.data;
        if (!dynamicData.apiKey || !dynamicData.method) {
          throw new Error("DynamicRule requires 'apiKey' and 'method'.");
        }
        return new DynamicRule(
          dynamicData.apiKey,
          dynamicData.method,
          Algorithm,
        );
      }
      default:
        throw new Error(`Unsupported rule type: ${String(ruleData)}`);
    }
  }
}
