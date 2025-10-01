import mariadb from "mariadb";
import { config } from "../config";

export const pool = mariadb.createPool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password,
  ssl: config.db.ssl,
  connectionLimit: config.db.poolSize,
});
