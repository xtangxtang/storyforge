import { Router } from "express";
import { db } from "../lib/db";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// POST /api/projects/:id/storyboards
router.post("/:id/storyboards", async (req, res, next) => {
  try {
    const { scene_num, shot_num, shot_type, camera_move, description, video_prompt, duration } = req.body;
    if (scene_num == null || shot_num == null) {
      return res.status(400).json({ error: "scene_num and shot_num are required" });
    }
    const id = `shot_${uuidv4().slice(0, 10)}`;
    await db("storyboards").insert({
      id,
      project_id: req.params.id,
      scene_num,
      shot_num,
      shot_type: shot_type || null,
      camera_move: camera_move || null,
      description: description || null,
      first_frame_prompt: null,
      video_prompt: video_prompt || null,
      duration: duration || null,
      assets: null,
      state: "pending",
      created_at: Date.now(),
    });
    const storyboard = await db("storyboards").where({ id }).first();
    res.status(201).json(storyboard);
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/:id/storyboards
router.get("/:id/storyboards", async (req, res, next) => {
  try {
    const storyboards = await db("storyboards")
      .where({ project_id: req.params.id })
      .orderBy("scene_num")
      .orderBy("shot_num");
    res.json(storyboards);
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/:id/storyboards/:shotId
router.get("/:id/storyboards/:shotId", async (req, res, next) => {
  try {
    const storyboard = await db("storyboards").where({ id: req.params.shotId }).first();
    if (!storyboard) return res.status(404).json({ error: "Storyboard not found" });
    res.json(storyboard);
  } catch (err) {
    next(err);
  }
});

// PUT /api/projects/:id/storyboards/:shotId
router.put("/:id/storyboards/:shotId", async (req, res, next) => {
  try {
    const updated = await db("storyboards")
      .where({ id: req.params.shotId })
      .update(req.body);
    if (!updated) return res.status(404).json({ error: "Storyboard not found" });
    const storyboard = await db("storyboards").where({ id: req.params.shotId }).first();
    res.json(storyboard);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/projects/:id/storyboards/:shotId
router.delete("/:id/storyboards/:shotId", async (req, res, next) => {
  try {
    const deleted = await db("storyboards").where({ id: req.params.shotId }).del();
    if (!deleted) return res.status(404).json({ error: "Storyboard not found" });
    res.json({ message: "Storyboard deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
