import {IRateLimitRule} from "./IRateLimitRule";

export interface IRuleLoader {
    loadRules(): IRateLimitRule[];
}