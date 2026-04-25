import { Router } from "express";
import { db } from "../lib/db";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// POST /api/projects/:id/videos - Trigger video generation for a storyboard
router.post("/:id/videos", async (req, res, next) => {
  try {
    const { storyboard_id } = req.body;
    if (!storyboard_id) return res.status(400).json({ error: "storyboard_id is required" });
    const id = `clip_${uuidv4().slice(0, 10)}`;
    await db("video_clips").insert({
      id,
      project_id: req.params.id,
      storyboard_id,
      video_url: null,
      state: "generating",
      is_selected: false,
      error_reason: null,
      version: 1,
      created_at: Date.now(),
    });
    // TODO: enqueue video generation task
    const clip = await db("video_clips").where({ id }).first();
    res.status(201).json(clip);
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/:id/videos
router.get("/:id/videos", async (req, res, next) => {
  try {
    const clips = await db("video_clips")
      .where({ project_id: req.params.id })
      .orderBy("created_at");
    res.json(clips);
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/:id/videos/:clipId
router.get("/:id/videos/:clipId", async (req, res, next) => {
  try {
    const clip = await db("video_clips").where({ id: req.params.clipId }).first();
    if (!clip) return res.status(404).json({ error: "Video clip not found" });
    res.json(clip);
  } catch (err) {
    next(err);
  }
});

export default router;
