import { Router } from "express";
import { db } from "../lib/db";

const router = Router();

// GET /api/tasks
router.get("/", async (req, res, next) => {
  try {
    const { project_id } = req.query;
    const query = db("tasks").orderBy("created_at", "desc");
    if (project_id) query.where({ project_id });
    const tasks = await query;
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// GET /api/tasks/:id
router.get("/:id", async (req, res, next) => {
  try {
    const task = await db("tasks").where({ id: req.params.id }).first();
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    next(err);
  }
});

export default router;
