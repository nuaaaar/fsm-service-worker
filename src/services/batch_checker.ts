import { pool } from "../db/pool";
import { config } from "../config";

export async function checkIsBatchAvailable() {
  const sql = "SELECT COUNT(1) as is_available FROM fsm_replay_stage WHERE checkpoint_id IS NULL AND used_flag=0 LIMIT 1";
  let conn;
  const t0 = Date.now();
  try {
    conn = await pool.getConnection();
    const result = await conn.query(sql);
    const isAvailable = Number(result[0].is_available) > 0;
    const ms = Date.now() - t0;
    console.log(`[check] source=${config.source} isAvailable=${isAvailable} time=${ms}ms`);
  
    return isAvailable;
  } catch (e) {
    console.error("[check] error:", e);
    return false;
  } finally {
    conn?.release();
  }
}
