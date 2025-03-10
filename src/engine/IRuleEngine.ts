import { IRequestMetadata } from "../common";
import { IRateLimitPolicy } from '../rateLimiter';
import { IRateLimitRule } from './ruleDefinitions';

export interface IRuleEngine {
  evaluate(metaData: IRequestMetadata): IRateLimitPolicy;
  addRule(rule: IRateLimitRule): void;
  removeRule(ruleId: string): void;
}
