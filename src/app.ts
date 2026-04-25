import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import fs from "fs";
import { config } from "./config";

// Ensure data directories exist
const dirs = [config.dbPath, config.projectsDir, config.cacheDir, config.templatesDir];
dirs.forEach((dir) => {
  const dirPath = dir.includes(".") ? path.dirname(dir) : dir;
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
});

// Routes
import projectsRouter from "./routes/projects";
import briefsRouter from "./routes/briefs";
import scriptsRouter from "./routes/scripts";
import assetsRouter from "./routes/assets";
import storyboardsRouter from "./routes/storyboards";
import videosRouter from "./routes/videos";
import tasksRouter from "./routes/tasks";
import templatesRouter from "./routes/templates";

const app: Express = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", version: "0.1.0" });
});

// Static files - serve project files
app.use("/files", express.static(config.projectsDir));

// API routes
app.use("/api/projects", projectsRouter);
app.use("/api/projects", briefsRouter);
app.use("/api/projects", scriptsRouter);
app.use("/api/projects", assetsRouter);
app.use("/api/projects", storyboardsRouter);
app.use("/api/projects", videosRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/templates", templatesRouter);

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error", message: err.message });
});

// 404
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(config.port, () => {
  console.log(`Storyforge server running on http://localhost:${config.port}`);
});

export default app;
