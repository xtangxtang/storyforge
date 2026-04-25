import { Router } from "express";
import { db } from "../lib/db";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// POST /api/projects/:id/assets
router.post("/:id/assets", async (req, res, next) => {
  try {
    const { type, name, description, prompt } = req.body;
    if (!type || !name) return res.status(400).json({ error: "type and name are required" });
    const id = `asset_${uuidv4().slice(0, 10)}`;
    await db("assets").insert({
      id,
      project_id: req.params.id,
      type,
      name,
      description: description || null,
      prompt: prompt || null,
      reference_image_url: null,
      state: "pending",
      created_at: Date.now(),
    });
    const asset = await db("assets").where({ id }).first();
    res.status(201).json(asset);
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/:id/assets
router.get("/:id/assets", async (req, res, next) => {
  try {
    const assets = await db("assets").where({ project_id: req.params.id }).orderBy("created_at");
    res.json(assets);
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/:id/assets/:assetId
router.get("/:id/assets/:assetId", async (req, res, next) => {
  try {
    const asset = await db("assets").where({ id: req.params.assetId }).first();
    if (!asset) return res.status(404).json({ error: "Asset not found" });
    res.json(asset);
  } catch (err) {
    next(err);
  }
});

// PUT /api/projects/:id/assets/:assetId
router.put("/:id/assets/:assetId", async (req, res, next) => {
  try {
    const updated = await db("assets")
      .where({ id: req.params.assetId })
      .update({ ...req.body, updated_at: Date.now() });
    if (!updated) return res.status(404).json({ error: "Asset not found" });
    const asset = await db("assets").where({ id: req.params.assetId }).first();
    res.json(asset);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/projects/:id/assets/:assetId
router.delete("/:id/assets/:assetId", async (req, res, next) => {
  try {
    const deleted = await db("assets").where({ id: req.params.assetId }).del();
    if (!deleted) return res.status(404).json({ error: "Asset not found" });
    res.json({ message: "Asset deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
