import { Router } from "express";
import { db } from "../lib/db";

const router = Router();

// POST /api/projects/:id/script - Generate script
router.post("/:id/script", async (req, res, next) => {
  try {
    // TODO: call LLM to generate script from brief
    await db("scripts").insert({
      project_id: req.params.id,
      content: JSON.stringify([]),
      created_at: Date.now(),
      updated_at: Date.now(),
    });
    const script = await db("scripts").where({ project_id: req.params.id }).first();
    res.status(201).json(script);
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/:id/script
router.get("/:id/script", async (req, res, next) => {
  try {
    const script = await db("scripts").where({ project_id: req.params.id }).first();
    if (!script) return res.status(404).json({ error: "Script not found" });
    res.json(script);
  } catch (err) {
    next(err);
  }
});

export default router;
