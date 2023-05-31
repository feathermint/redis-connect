import * as logger from "@feathermint/logger";
import { createClient } from "@redis/client";
import assert from "node:assert";

const log = logger.create("redis");

export type RedisClient = ReturnType<typeof createClient>;

export async function connect(
  url = "redis://localhost:6379"
): Promise<ReturnType<typeof createClient>> {
  let safeURL = url;
  if (url.indexOf("@") != -1) {
    const scheme = url.slice(0, url.indexOf("/") + 2);
    safeURL = `${scheme}username:password${url.slice(url.indexOf("@"))}`;
  }
  log.info(`Connecting to ${safeURL}.`);

  const client = createClient({ url });
  try {
    await client.connect();
  } catch (err) {
    throw new Error("redis: failed to connect", {
      cause: err as Error,
    });
  }

  try {
    const reply = await client.ping();
    assert(reply === "PONG");
  } catch (err) {
    throw new Error("redis: failed to verify connection", {
      cause: err as Error,
    });
  }
  log.info("Connection established and verified.");

  return client;
}
