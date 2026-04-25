import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  dbPath: process.env.DB_PATH || "data/db/storyforge.db",
  dataDir: process.env.DATA_DIR || "data",
  projectsDir: process.env.DATA_DIR ? `${process.env.DATA_DIR}/projects` : "data/projects",
  cacheDir: process.env.DATA_DIR ? `${process.env.DATA_DIR}/cache` : "data/cache",
  templatesDir: process.env.DATA_DIR ? `${process.env.DATA_DIR}/templates` : "data/templates",
};
