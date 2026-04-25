import { Router } from "express";
import { db } from "../lib/db";

const router = Router();

// POST /api/projects/:id/brief - Generate brief
router.post("/:id/brief", async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "prompt is required" });
    // TODO: call LLM to generate brief
    await db("briefs").insert({
      project_id: req.params.id,
      genre: "romance",
      duration: 60,
      aspect_ratio: "9:16",
      mood: "warm",
      visual_style: "soft lighting",
      story_outline: prompt,
      created_at: Date.now(),
    });
    const brief = await db("briefs").where({ project_id: req.params.id }).first();
    res.status(201).json(brief);
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/:id/brief
router.get("/:id/brief", async (req, res, next) => {
  try {
    const brief = await db("briefs").where({ project_id: req.params.id }).first();
    if (!brief) return res.status(404).json({ error: "Brief not found" });
    res.json(brief);
  } catch (err) {
    next(err);
  }
});

export default router;
