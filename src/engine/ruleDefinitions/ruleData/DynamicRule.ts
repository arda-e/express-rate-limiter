import { IRequestMetadata } from "../../../common";
import { IRateLimitRule } from "../IRateLimitRule";
import { IRateLimitPolicy } from "../../../rateLimiter";
import { IRateLimiterAdapter } from "../../../rateLimiter/algorithms/IRateLimiterAdapter";
import { randomUUID, UUID } from "node:crypto";

export class DynamicRule implements IRateLimitRule {
  public readonly id: UUID;
  private apiKey: string;
  private method: string;
  private algorithm: new () => IRateLimiterAdapter;

  constructor(
    apiKey: string,
    method: string,
    algorithm: new () => IRateLimiterAdapter,
  ) {
    this.id = randomUUID();
    this.apiKey = apiKey;
    this.method = method;
    this.algorithm = algorithm;
  }

  matches(metadata: IRequestMetadata): boolean {
    return metadata.apiKey === this.apiKey && metadata.method === this.method;
  }

  evaluate() //metadata: IRequestMetadata
  : IRateLimitPolicy {
    return {
      algorithm: this.algorithm,
      capacity: 100, // Mocked value
      refillRate: 10, // Mocked value
    };
  }
}
