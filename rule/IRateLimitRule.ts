import {IRequestMetadata} from "../common/IRequestMetadata";
import {IRateLimitPolicy} from "../rateLimiter/IRateLimitPolicy";

export interface IRateLimitRule {
    matches(metadata: IRequestMetadata):boolean
    evaluate(metadata: IRequestMetadata): IRateLimitPolicy
}