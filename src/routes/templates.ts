import { Router } from "express";
import fs from "fs";
import path from "path";
import { config } from "../config";

const router = Router();

function loadTemplates(type: string) {
  const dir = path.join(config.templatesDir, type);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  return files.map((f) => {
    const content = JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8"));
    return { id: f.replace(".json", ""), type, ...content };
  });
}

// GET /api/templates - List all
router.get("/", (_req, res) => {
  const styles = loadTemplates("styles");
  const scripts = loadTemplates("scripts");
  const storyboards = loadTemplates("storyboards");
  res.json({ styles, scripts, storyboards });
});

// GET /api/templates/:type
router.get("/:type", (req, res) => {
  const templates = loadTemplates(req.params.type);
  res.json(templates);
});

// GET /api/templates/:type/:name
router.get("/:type/:name", (req, res) => {
  const filePath = path.join(config.templatesDir, req.params.type, `${req.params.name}.json`);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: "Template not found" });
  const template = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  res.json({ id: req.params.name, type: req.params.type, ...template });
});

export default router;
