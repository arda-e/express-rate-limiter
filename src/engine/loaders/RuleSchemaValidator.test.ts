import { RuleSchemaValidator } from "./RuleSchemaValidator";

describe("RuleSchemaValidator", () => {
  test("validates a correct StaticRule successfully", () => {
    const validStaticRule = {
      type: "StaticRule",
      data: {
        endpoint: "/api/resource",
        capacity: 100,
        refillRate: 10,
      },
    };

    expect(() => RuleSchemaValidator.validate([validStaticRule])).not.toThrow();
  });

  test("validates a correct DynamicRule successfully", () => {
    const validDynamicRule = {
      type: "DynamicRule",
      data: {
        apiKey: "key123",
        method: "POST",
      },
    };

    expect(() =>
      RuleSchemaValidator.validate([validDynamicRule]),
    ).not.toThrow();
  });

  test("throws an error for missing fields in StaticRule", () => {
    const invalidStaticRule = {
      type: "StaticRule",
      data: {
        endpoint: "/api/resource",
        capacity: 100, // Missing `refillRate`
      },
    };

    expect(() => RuleSchemaValidator.validate([invalidStaticRule])).toThrow(
      /refillRate/,
    );
  });

  test("throws an error for missing fields in DynamicRule", () => {
    const invalidDynamicRule = {
      type: "DynamicRule",
      data: {
        method: "POST", // Missing `apiKey`
      },
    };

    expect(() =>
      RuleSchemaValidator.validate(invalidDynamicRule),
    ).toThrowErrorMatchingSnapshot();
  });

  test("throws an error for unsupported rule types", () => {
    const unsupportedRule = {
      type: "UnsupportedRule",
      data: {},
    };

    expect(() =>
      RuleSchemaValidator.validate([unsupportedRule]),
    ).toThrowErrorMatchingSnapshot();
  });

  test("handles an empty array gracefully", () => {
    expect(() => RuleSchemaValidator.validate([])).not.toThrow();
  });

  test("throws an error for null input", () => {
    expect(() =>
      RuleSchemaValidator.validate(null),
    ).toThrowErrorMatchingSnapshot();
  });

  test("throws an error for malformed rule data", () => {
    const malformedRule = {
      type: "StaticRule", // Missing `data` field
    };

    expect(() =>
      RuleSchemaValidator.validate([malformedRule]),
    ).toThrowErrorMatchingSnapshot();
  });
});
