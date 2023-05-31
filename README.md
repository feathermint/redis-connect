# @feathermint/redis-connect

Utility function to establish and verify a connection to Redis.

## Installation

Install the package with:

```
npm install @feathermint/redis-connect
```

## Usage

```
import * as redis from "@feathermint/redis-connect";

async function client(url) {
    return await redis.connect(url);
}
```
