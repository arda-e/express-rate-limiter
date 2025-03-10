# Rate Limiter System

## Overview

This project implements a **Rate Limiting System** that provides flexible rate-limiting rules based on various factors like **IP addresses, API endpoints, and user API keys**. It supports **static and dynamic rules** and integrates well with distributed cache systems like Redis.

## Features

- **Rule-Based Rate Limiting**
    - Static rules based on endpoints.
    - Dynamic rules based on user API keys.
    - IP-based rate limiting.

- **Extensible Rule Engine**
    - Custom rules can be added dynamically.
    - Supports multiple algorithms for rate limiting.

- **Schema Validation**
    - Uses **Zod** for schema validation.
    - Ensures proper rule formats before applying them.

- **Logging & Error Handling**
    - Uses **Winston** for structured logging.
    - Comprehensive error handling with detailed messages.

- **Testing & Snapshot Testing**
    - Unit tests using **Jest**.
    - Snapshot tests for schema validation.

## Project Structure

```
src/
├── cache/                  # Caching interface and implementation
│   ├── ICacheStore.ts
│
├── common/                 # Shared utilities
│   ├── IRequestMetadata.ts # Request metadata interface
│   ├── logger.ts           # Winston-based logging
│   ├── index.ts
│
├── config/                 # Configuration files
│   ├── rules.json          # JSON-based rate limiting rules
│
├── engine/                 # Rate Limiting Engine
│   ├── RuleEngine.ts       # Core engine logic
│   ├── IRuleEngine.ts      # Rule engine interface
│   ├── ruleDefinitions/    # Rule data and implementations
│   ├── loaders/            # Rule loading mechanism
│   ├── index.ts
│
├── rateLimiter/            # Rate limiter logic
│   ├── algorithms/         # Algorithm implementations
│   ├── IRateLimitPolicy.ts
│   ├── IRateLimiterResult.ts
│   ├── RateLimiterManager.ts
│   ├── index.ts
│
├── tests/                  # Unit & integration tests
│
```

## Installation & Setup

### Prerequisites

- **Node.js** (>= 16.x)
- **TypeScript**
- **Redis** (optional, if using Redis as a cache store)

### Install Dependencies

```sh
npm install
```

### Running the Project

Start the application:

```sh
npm start
```

Run the tests:

```sh
npm test
```

## Usage

### 1. Define Rate Limit Rules

Modify `src/config/rules.json` to specify rate limit rules. Example:

```json
[
  {
    "type": "IPRule",
    "ip": "192.168.1.1",
    "capacity": 100,
    "refillRate": 10
  },
  {
    "type": "EndpointRule",
    "endpoint": "/api/v1/resource",
    "capacity": 500,
    "refillRate": 50
  },
  {
    "type": "UserRule",
    "userId": "user123",
    "capacity": 200,
    "refillRate": 20
  }
]
```

### 2. Implement Custom Rules

To add a new rule type, create a class that implements `IRateLimitRule` and register it in `RuleEngine.ts`.

```ts
class CustomRule implements IRateLimitRule {
  matches(metadata: IRequestMetadata): boolean {
    return metadata.userId === "specialUser";
  }

  evaluate(metadata: IRequestMetadata): IRateLimitPolicy {
    return { capacity: 300, refillRate: 30, algorithm: CustomAlgorithm };
  }
}
```

### 3. Integrate with Express

You can integrate this rate limiter with an **Express.js** middleware.

```ts
import { RuleEngine } from "./engine/RuleEngine";
import { IRequestMetadata } from "./common";
import express from "express";

const app = express();
const ruleEngine = new RuleEngine();

app.use((req, res, next) => {
  const metadata: IRequestMetadata = {
    userId: req.headers["user-id"] as string,
    apiKey: req.headers["api-key"] as string,
    endpoint: req.path,
    method: req.method,
    ip: req.ip,
  };

  try {
    const policy = ruleEngine.evaluate(metadata);
    console.log("Rate Limit Applied:", policy);
    next();
  } catch (error) {
    res.status(429).json({ error: "Too many requests" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

## Testing

Run unit tests:

```sh
npm run test
```

Check snapshot tests:

```sh
npm run test:snapshots
```

## Future Enhancements

- **Support Redis-based caching**
- **Support custom rate-limiting algorithms**
- **Add Prometheus/Grafana monitoring**
- **Enhance API response formats**


This README provides a structured overview of the **Rate Limiting System**, helping developers understand, install, and extend the project effectively. 🚀
