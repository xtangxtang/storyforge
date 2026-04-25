import { Router } from "express";
import { db } from "../lib/db";
import { v4 as uuidv4 } from "uuid";
import { Project } from "../types";

const router = Router();

// POST /api/projects - Create project
router.post("/", async (req, res, next) => {
  try {
    const { name, user_id, template_style, template_script, template_storyboard, budget_limit } = req.body;
    if (!name) return res.status(400).json({ error: "name is required" });

    const id = `proj_${uuidv4().slice(0, 12)}`;
    const now = Date.now();

    await db("projects").insert({
      id,
      name,
      user_id: user_id || null,
      state: "planning",
      template_style: template_style || null,
      template_script: template_script || null,
      template_storyboard: template_storyboard || null,
      budget_limit: budget_limit || null,
      budget_used: 0,
      created_at: now,
      updated_at: now,
    });

    const project = await db("projects").where({ id }).first();
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
});

// GET /api/projects - List all
router.get("/", async (_req, res, next) => {
  try {
    const projects = await db("projects").orderBy("created_at", "desc");
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/:id - Detail
router.get("/:id", async (req, res, next) => {
  try {
    const project = await db("projects").where({ id: req.params.id }).first();
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/projects/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await db("projects").where({ id: req.params.id }).del();
    if (!deleted) return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project deleted" });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/projects/:id/state
router.patch("/:id/state", async (req, res, next) => {
  try {
    const { state } = req.body;
    if (!state) return res.status(400).json({ error: "state is required" });
    const updated = await db("projects")
      .where({ id: req.params.id })
      .update({ state, updated_at: Date.now() });
    if (!updated) return res.status(404).json({ error: "Project not found" });
    const project = await db("projects").where({ id: req.params.id }).first();
    res.json(project);
  } catch (err) {
    next(err);
  }
});

export default router;
