import * as logger from "@feathermint/logger";
import { Redis, RedisOptions } from "ioredis";

const log = logger.create("redis");

export async function connect(
  url = "redis://localhost:6379",
  options?: RedisOptions
): Promise<Redis> {
  let safeURL = url;
  if (url.indexOf("@") != -1) {
    const scheme = url.slice(0, url.indexOf("/") + 2);
    safeURL = `${scheme}username:password${url.slice(url.indexOf("@"))}`;
  }
  log.info(`Connecting to ${safeURL}.`);
  const client = new Redis(safeURL, { ...options, lazyConnect: true });
  // A listener is added to avoid the use console.error by ioredis
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  client.on("error", () => {});

  try {
    await client.connect();
  } catch (cause) {
    throw new Error("redis: failed to connect", { cause });
  }

  try {
    await client.ping();
  } catch (cause) {
    throw new Error("redis: failed to verify connection", { cause });
  }
  log.info("Connection established and verified.");
  client.removeAllListeners("error");

  return client;
}
