import { db } from "./db";

async function migrate() {
  console.log("Running migrations...");

  await db.schema.dropTableIfExists("tasks");
  await db.schema.dropTableIfExists("video_clips");
  await db.schema.dropTableIfExists("final_cuts");
  await db.schema.dropTableIfExists("storyboards");
  await db.schema.dropTableIfExists("assets");
  await db.schema.dropTableIfExists("scripts");
  await db.schema.dropTableIfExists("briefs");
  await db.schema.dropTableIfExists("projects");

  await db.schema.createTable("projects", (table) => {
    table.string("id").primary();
    table.string("name").notNullable();
    table.string("user_id").nullable();
    table.string("state").notNullable().defaultTo("planning");
    table.string("template_style").nullable();
    table.string("template_script").nullable();
    table.string("template_storyboard").nullable();
    table.float("budget_limit").nullable();
    table.float("budget_used").notNullable().defaultTo(0);
    table.integer("created_at").notNullable().defaultTo(Date.now());
    table.integer("updated_at").notNullable().defaultTo(Date.now());
  });

  await db.schema.createTable("briefs", (table) => {
    table.string("project_id").primary().references("id").inTable("projects");
    table.string("genre").nullable();
    table.integer("duration").nullable();
    table.string("aspect_ratio").nullable();
    table.string("mood").nullable();
    table.text("visual_style").nullable();
    table.text("story_outline").nullable();
    table.integer("created_at").notNullable().defaultTo(Date.now());
  });

  await db.schema.createTable("scripts", (table) => {
    table.string("project_id").primary().references("id").inTable("projects");
    table.text("content").notNullable();
    table.integer("created_at").notNullable().defaultTo(Date.now());
    table.integer("updated_at").notNullable().defaultTo(Date.now());
  });

  await db.schema.createTable("assets", (table) => {
    table.string("id").primary();
    table.string("project_id").notNullable().references("id").inTable("projects");
    table.string("type").notNullable(); // character, location, style
    table.string("name").notNullable();
    table.text("description").nullable();
    table.text("prompt").nullable();
    table.string("reference_image_url").nullable();
    table.string("state").notNullable().defaultTo("pending");
    table.integer("created_at").notNullable().defaultTo(Date.now());
  });

  await db.schema.createTable("storyboards", (table) => {
    table.string("id").primary();
    table.string("project_id").notNullable().references("id").inTable("projects");
    table.integer("scene_num").notNullable();
    table.integer("shot_num").notNullable();
    table.string("shot_type").nullable();
    table.string("camera_move").nullable();
    table.text("description").nullable();
    table.text("first_frame_prompt").nullable();
    table.text("video_prompt").nullable();
    table.integer("duration").nullable();
    table.text("assets").nullable();
    table.string("state").notNullable().defaultTo("pending");
    table.integer("created_at").notNullable().defaultTo(Date.now());
  });

  await db.schema.createTable("video_clips", (table) => {
    table.string("id").primary();
    table.string("project_id").notNullable().references("id").inTable("projects");
    table.string("storyboard_id").notNullable();
    table.string("video_url").nullable();
    table.string("state").notNullable().defaultTo("generating");
    table.boolean("is_selected").notNullable().defaultTo(false);
    table.string("error_reason").nullable();
    table.integer("version").notNullable().defaultTo(1);
    table.integer("created_at").notNullable().defaultTo(Date.now());
  });

  await db.schema.createTable("final_cuts", (table) => {
    table.string("id").primary();
    table.string("project_id").notNullable().references("id").inTable("projects");
    table.string("video_url").nullable();
    table.text("video_clip_ids").nullable();
    table.string("state").notNullable().defaultTo("rendering");
    table.integer("created_at").notNullable().defaultTo(Date.now());
  });

  await db.schema.createTable("tasks", (table) => {
    table.string("id").primary();
    table.string("project_id").notNullable().references("id").inTable("projects");
    table.string("type").notNullable();
    table.string("state").notNullable().defaultTo("queued");
    table.text("result").nullable();
    table.text("error").nullable();
    table.integer("retry_count").notNullable().defaultTo(0);
    table.integer("created_at").notNullable().defaultTo(Date.now());
    table.integer("finished_at").nullable();
  });

  console.log("Migrations completed.");
  await db.destroy();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
