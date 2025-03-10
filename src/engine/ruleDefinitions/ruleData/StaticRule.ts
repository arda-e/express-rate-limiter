import { IRateLimitRule } from "../IRateLimitRule";
import { IRequestMetadata } from "../../../common";
import { IRateLimitPolicy } from "../../../rateLimiter";
import { IRateLimiterAdapter } from "../../../rateLimiter/algorithms/IRateLimiterAdapter";
import { randomUUID, UUID } from "node:crypto";

export class StaticRule implements IRateLimitRule {
  public readonly id: UUID;
  private endpoint: string;
  private capacity: number;
  private refillRate: number;
  private algorithm: new () => IRateLimiterAdapter;

  constructor(
    endpoint: string,
    capacity: number,
    refillRate: number,
    algorithm: new () => IRateLimiterAdapter,
  ) {
    this.id = randomUUID();
    this.endpoint = endpoint;
    this.capacity = capacity;
    this.refillRate = refillRate;
    this.algorithm = algorithm;
  }

  matches(metadata: IRequestMetadata): boolean {
    return metadata.endpoint === this.endpoint;
  }

  evaluate() //metadata: IRequestMetadata
  : IRateLimitPolicy {
    return {
      algorithm: this.algorithm,
      capacity: this.capacity,
      refillRate: this.refillRate,
    }; // Mocked policy
  }
}
