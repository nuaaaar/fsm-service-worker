import { runReplayBatch } from "./services/replay_caller";
import { config } from "./config";
import { pool } from "./db/pool";

let stopping = false;
process.on("SIGTERM", () => (stopping = true));
process.on("SIGINT", () => (stopping = true));

async function main() {
  console.log("[worker] start:", {
    source: config.source,
    batch: config.batchSize,
    lease: config.leaseSecs,
    interval: config.intervalMs,
  });

  while (!stopping) {
    try {
      await runReplayBatch();
    } catch (e) {
      console.error("[worker] error:", e);
      await Bun.sleep(2000); // backoff saat error
    }
    if (config.intervalMs > 0 && !stopping) {
      await Bun.sleep(config.intervalMs);
    }
  }

  console.log("[worker] stopping…");
  await pool.end();
  console.log("[worker] stopped.");
}

main();
