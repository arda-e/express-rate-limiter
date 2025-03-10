import * as fs from "fs/promises";
import { JSONRuleLoader } from "./JSONRuleLoader";
import { StaticRule, DynamicRule } from "../ruleDefinitions/";

jest.mock("fs/promises"); // Mock file system operations

describe("JSONRuleLoader", () => {
  const mockRules = [
    {
      type: "StaticRule",
      data: { endpoint: "/api/resource", capacity: 100, refillRate: 10 },
    },
    {
      type: "DynamicRule",
      data: { apiKey: "key123", method: "POST" },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("loads valid rules successfully", async () => {
    (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockRules));

    const loader = new JSONRuleLoader("./rules.json");
    const rules = await loader.loadRules();

    expect(rules).toHaveLength(2);
    expect(rules[0]).toBeInstanceOf(StaticRule);
    expect(rules[1]).toBeInstanceOf(DynamicRule);
    expect(rules[0].evaluate).toBeDefined(); // StaticRule should implement `evaluate`
  });

  test("throws an error for invalid rule types", async () => {
    const invalidRules = [
      {
        type: "UnknownRuleType",
        data: {},
      },
    ];
    (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(invalidRules));

    const loader = new JSONRuleLoader("./rules.json");
    await expect(loader.loadRules()).rejects.toThrowErrorMatchingSnapshot();
  });

  test("throws an error for missing required fields", async () => {
    const invalidRules = [
      {
        type: "StaticRule",
        data: { capacity: 100 },
      },
    ];

    (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(invalidRules));

    const loader = new JSONRuleLoader("./rules.json");
    await expect(loader.loadRules()).rejects.toThrow(
      "StaticRule requires 'endpoint', 'capacity', and 'refillRate'.",
    );
  });

  test("handles empty rule files gracefully", async () => {
    (fs.readFile as jest.Mock).mockResolvedValue("[]");

    const loader = new JSONRuleLoader("./rules.json");
    const rules = await loader.loadRules();

    expect(rules).toHaveLength(0); // No rules should be loaded
  });

  test("throws an error for invalid JSON", async () => {
    (fs.readFile as jest.Mock).mockResolvedValue("{ invalid json }");

    const loader = new JSONRuleLoader("./rules.json");
    await expect(loader.loadRules()).rejects.toThrow(
      /Failed to parse JSON file/,
    );
  });
});
