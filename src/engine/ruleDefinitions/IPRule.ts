import * as ip from "ip";
import { IRateLimitPolicy } from "../../rateLimiter";
import { IRateLimitRule } from "./IRateLimitRule";
import { IRequestMetadata } from "../../common";
import { randomUUID, UUID } from "node:crypto";

/**
 * The `IPRule` class implements the `IRateLimitRule` interface
 * and matches requests based on the client's IP address.
 */
export class IPRule implements IRateLimitRule {
  public readonly id: UUID;
  private readonly ipAddress?: string;
  private readonly ipRange?: string;
  private readonly policy: IRateLimitPolicy;

  constructor(ipAddress: string, policy: IRateLimitPolicy);
  constructor(ipRange: string, policy: IRateLimitPolicy);
  constructor(addressOrRange: string, policy: IRateLimitPolicy) {
    if (!policy) {
      throw new Error("Policy must be provided.");
    }
    if (this.isValidIPAddress(addressOrRange)) {
      this.ipAddress = addressOrRange;
    } else if (this.isValidIPRange(addressOrRange)) {
      this.ipRange = addressOrRange;
    } else {
      throw new Error("Invalid IP address or range format.");
    }
    this.id = randomUUID();
    this.policy = policy;
  }

  /**
   * Checks whether the request's IP address matches this rule's IP address.
   *
   * @param metadata - Metadata about the incoming request.
   * @returns `true` if the request's IP matches, otherwise `false`.
   */
  public matches(metadata: IRequestMetadata): boolean {
    return metadata.ip === this.ipAddress;
  }

  /**
   * Returns the rate-limiting policy if this rule matches.
   *
   * @param metadata - Metadata about the incoming request.
   * @returns The applicable `IRateLimitPolicy`.
   */
  public evaluate() //  metadata: IRequestMetadata
  : IRateLimitPolicy {
    return this.policy;
  }

  private isValidIPAddress(address: string): boolean {
    return ip.isV4Format(address) || ip.isV6Format(address);
  }

  private isValidIPRange(range: string): boolean {
    try {
      ip.cidrSubnet(range);
      return true;
    } catch {
      return false;
    }
  }
}
