export const config = {
  intervalMs: Number(process.env.INTERVAL_MS ?? 0), // 0 = langsung next batch
  batchSize: Number(process.env.BATCH_SIZE ?? 5000),
  leaseSecs: Number(process.env.LEASE_SECS ?? 600), // 10 menit
  source: process.env.WORKER_SOURCE || process.env.HOSTNAME || "worker-default",
  db: {
    host: process.env.MDB_HOST ?? "localhost",
    port: Number(process.env.MDB_PORT ?? 3306),
    database: process.env.MDB_DB ?? "db_traccar",
    user: process.env.MDB_USER ?? "appuser",
    password: process.env.MDB_PASS ?? "",
    ssl:
      process.env.MDB_SSL === "true"
        ? { rejectUnauthorized: false }
        : undefined,
    poolSize: Number(process.env.MDB_POOL_SIZE ?? 5),
  },
};

export function printConfigSummary() {
  console.log("[config] intervalMs:", config.intervalMs);
  console.log("[config] batchSize :", config.batchSize);
  console.log(
    "[config] db host   :",
    `${config.db.host}:${config.db.port}/${config.db.database}`
  );
}
