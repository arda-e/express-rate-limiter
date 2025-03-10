import { z } from "zod";

const StaticRuleSchema = z.object({
  type: z.literal("StaticRule"),
  data: z.object({
    endpoint: z.string(),
    capacity: z.number().min(1),
    refillRate: z.number().min(1),
  }),
});

const DynamicRuleSchema = z.object({
  type: z.literal("DynamicRule"),
  data: z.object({
    apiKey: z.string(),
    method: z.string(),
  }),
});

const RuleSchema = z.union([StaticRuleSchema, DynamicRuleSchema]);

const RulesArraySchema = z.array(RuleSchema);

export class RuleSchemaValidator {
  /**
   * Validates raw rule data against the predefined schema.
   * @param rawRules - The raw rules array from the configuration.
   * @throws An error if validation fails.
   */
  public static validate(rawRules: unknown): void {
    RulesArraySchema.parse(rawRules);
  }
}
