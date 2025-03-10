import * as fs from "fs/promises";
import { AbstractRuleLoader } from "./AbstractRuleLoader";
import { RuleSchemaValidator } from "./RuleSchemaValidator";
import { IRateLimitRule, IRawRuleData } from "../ruleDefinitions";
import { logger } from "../../common/";

/**
 * The `JSONRuleLoader` class loads rate-limiting ruleDefinitions from a local JSON file.
 */
export class JSONRuleLoader extends AbstractRuleLoader {
  private readonly filePath: string;

  constructor(filePath: string) {
    super();
    this.filePath = filePath;
  }

  public async loadRules(): Promise<IRateLimitRule[]> {
    try {
      const rawRules = await this.parseJSONFile();
      RuleSchemaValidator.validate(rawRules);
      logger.info("Rules loaded successfully", { ruleCount: rawRules.length });
      return rawRules.map(this.createRule);
    } catch (error) {
      if (error instanceof Error) {
        logger.error("Failed to load rules", { error: error.message });
      } else {
        logger.error("Failed to load rules due to an unknown error.");
      }
      throw error;
    }
  }

  private async parseJSONFile(): Promise<IRawRuleData[]> {
    try {
      const fileContent = await this.readFile(this.filePath, "utf8");
      const parsedData = JSON.parse(fileContent);

      if (!Array.isArray(parsedData)) {
        throw new Error("Invalid JSON structure: Expected an array.");
      }

      return parsedData as IRawRuleData[];
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error(`Failed to parse JSON file: ${error.message}`);
      } else if (error instanceof Error) {
        console.error(`Error during file parsing: ${error.message}`);
      } else {
        logger.error("Failed to parse JSON file due to an unknown error.");
      }
      throw error;
    }
  }

  private async readFile(
    filePath: string,
    encoding: BufferEncoding,
  ): Promise<string> {
    try {
      const content = await fs.readFile(filePath, { encoding });
      return content.toString();
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Failed to read file: ${error.message}`);
      } else {
        logger.error("Failed to read file due to an unknown error.");
      }
      throw error;
    }
  }
}
