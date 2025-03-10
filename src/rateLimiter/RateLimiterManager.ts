import { IRateLimiterManager } from "./IRateLimiterManager";
import { IRequestMetadata, logger } from "../common";
import { IRateLimiterResult } from "./index";
import { RuleEngine, JSONRuleLoader } from "../engine";

const JSON_RULE_PATH = require.resolve("../../config/rules.json");

export class RateLimiterManager implements IRateLimiterManager {
  private engine: RuleEngine;

  constructor(engine: RuleEngine) {
    this.engine = engine;
  }

  public async initialize(): Promise<void> {
    const loader = new JSONRuleLoader(JSON_RULE_PATH);
    const rules = await loader.loadRules();
    rules.forEach((rule) => this.engine.addRule(rule));
  }

  public handleRequest(metadata: IRequestMetadata): IRateLimiterResult {
    logger.info("Handling request", { metadata });
    try {
      const policy = this.engine.evaluate(metadata);
      const adapter = new policy.algorithm();

      const allowed = adapter.consume(1);
      const result = {
        allowed,
        message: allowed ? "Request allowed" : "Rate limit exceeded",
        remainingTokens: adapter.getState().tokens,
      };
      logger.info("Request handled", { metadata, result });
      return result;
    } catch (error) {
      if (error instanceof Error) {
        const result = {
          allowed: false,
          message: error.message,
          remainingTokens: 0,
        };
        logger.error("Request handling failed", {
          metadata,
          error: error.message,
        });
        return result;
      } else {
        throw error;
      }
    }
  }
}
