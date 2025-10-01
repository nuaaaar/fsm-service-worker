import { pool } from "../db/pool";
import { config } from "../config";

export async function runReplayBatch() {
  const sql = "CALL db_traccar.sp_replay_from_stage_worker(?, ?, ?)";
  let conn;
  const t0 = Date.now();
  try {
    conn = await pool.getConnection();
    await conn.query(sql, [config.batchSize, config.source, config.leaseSecs]);
    const ms = Date.now() - t0;
    console.log(
      `[batch] source=${config.source} size=${config.batchSize} lease=${config.leaseSecs}s time=${ms}ms`
    );
  } finally {
    conn?.release();
  }
}
