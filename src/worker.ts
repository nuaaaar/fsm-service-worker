import { runReplayBatch } from "./services/replay_caller";
import { config } from "./config";
import { pool } from "./db/pool";
import { checkIsBatchAvailable } from "./services/batch_checker";

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

      const isAvailable = await checkIsBatchAvailable();
      if (!isAvailable) {
        await Bun.sleep(30000) // backoff saat next batch tidak tersedia
        continue;
      } 

      if (config.intervalMs > 0) {
        await Bun.sleep(config.intervalMs);
      }
    } catch (e) {
      console.error("[worker] error:", e);
      await Bun.sleep(3000); // backoff saat error
    }
  }

  console.log("[worker] stopping…");
  await pool.end();
  console.log("[worker] stopped.");
}

main();
