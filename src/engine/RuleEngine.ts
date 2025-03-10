import { IRuleEngine } from "./IRuleEngine";
import { IRateLimitRule } from "./ruleDefinitions";
import { IRequestMetadata, logger } from "../common";
import { IRateLimitPolicy } from "../rateLimiter";

export class RuleEngine implements IRuleEngine {
  private rules: IRateLimitRule[] = [];

  public addRule(rule: IRateLimitRule): void {
    this.rules.push(rule);
    logger.info("Rule added", { ruleId: rule.id });
  }

  removeRule(ruleId: string): void {
    this.rules = this.rules.filter((rule) => rule.id !== ruleId);
    logger.info("Rule removed", { ruleId });
  }

  evaluate(metadata: IRequestMetadata): IRateLimitPolicy {
    logger.info("Evaluating metadata", { metadata });
    for (const rule of this.rules) {
      if (rule.matches(metadata)) {
        return rule.evaluate(metadata);
      }
    }
    logger.warn("No matching rule found", { metadata });
    throw new Error(
      `No matching rule found for metadata: ${JSON.stringify(metadata)}`,
    );
  }
}
