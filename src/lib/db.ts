import knex from "knex";
import { config } from "../config";

export const db = knex({
  client: "better-sqlite3",
  connection: {
    filename: config.dbPath,
  },
  useNullAsDefault: true,
});
