import {IRequestMetadata} from "../common/IRequestMetadata";
import {IRateLimitPolicy} from "../rateLimiter/IRateLimitPolicy";
import {IRateLimitRule} from "./IRateLimitRule";

export interface IRuleEngine {
    evaluate(metaData: IRequestMetadata): IRateLimitPolicy
    addRule(rule: IRateLimitRule): void
    removeRule(ruleId: string): void
}