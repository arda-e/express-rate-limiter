// file: src/engine/ruleDefinitions/IRawRuleData.ts
import { IStaticRuleData } from "./IStaticRuleData";
import { IDynamicRuleData } from "./IDynamicRuleData";

/**
 * The `IRawRuleData` interface represents a raw rule data object that
 * can be parsed and converted into an instance of `IRateLimitRule`.
 */
export type IRawRuleData = StaticRawRuleData | DynamicRawRuleData;

interface StaticRawRuleData {
  type: "StaticRule";
  data: IStaticRuleData;
}

interface DynamicRawRuleData {
  type: "DynamicRule";
  data: IDynamicRuleData;
}
