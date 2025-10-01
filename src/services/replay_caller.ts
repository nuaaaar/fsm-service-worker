import { pool } from "../db/pool";
import { config } from "../config";

export async function runReplayBatch() {
  const callSql = "CALL db_traccar.sp_replay_from_stage_worker(?, ?, ?)";
  const lastCheckpointSql = `
    SELECT last_event_id 
    FROM fsm_replay_checkpoint_sim 
    WHERE source = ?
  `;

  let conn;
  const t0 = Date.now();
  const now = new Date(t0).toISOString();

  try {
    conn = await pool.getConnection();

    await conn.query(callSql, [config.batchSize, config.source, config.leaseSecs]);

    const rows = await conn.query(lastCheckpointSql, [config.source]);
    const lastEventId = rows[0]?.last_event_id ?? null;

    const lastEventIdStr =
      lastEventId == null
        ? "null"
        : typeof lastEventId === "bigint"
        ? lastEventId.toString()
        : String(lastEventId);
    const ms = Date.now() - t0;
    console.log(
      `[batch] ${now} source=${config.source} size=${config.batchSize} lease=${config.leaseSecs}s time=${ms}ms lastCheckpoint=${lastEventIdStr}`
    );
  } catch (e: any) {
    if(e.code === "ER_DUP_ENTRY") {
      console.warn("duplicate entry, ignored.");
      return;
    }
    console.error("[batch] error:", e);
    throw e;
  } finally {
    conn?.release();
  }
}