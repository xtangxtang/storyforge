export interface Project {
  id: string;
  name: string;
  user_id: string | null;
  state: ProjectState;
  template_style: string | null;
  template_script: string | null;
  template_storyboard: string | null;
  budget_limit: number | null;
  budget_used: number;
  created_at: number;
  updated_at: number;
}

export type ProjectState =
  | "planning"
  | "scripting"
  | "asseting"
  | "storyboarding"
  | "generating"
  | "cutting"
  | "done";

export interface Brief {
  project_id: string;
  genre: string | null;
  duration: number | null;
  aspect_ratio: string | null;
  mood: string | null;
  visual_style: string | null;
  story_outline: string | null;
  created_at: number;
}

export interface Script {
  project_id: string;
  content: string; // JSON string of scenes array
  created_at: number;
  updated_at: number;
}

export interface Scene {
  scene_num: number;
  location: string;
  description: string;
  dialogue: DialogueItem[];
  action: string;
  duration: number;
}

export interface DialogueItem {
  character: string;
  line: string;
}

export type AssetType = "character" | "location" | "style";
export type AssetState = "pending" | "generating" | "done" | "failed";

export interface Asset {
  id: string;
  project_id: string;
  type: AssetType;
  name: string;
  description: string | null;
  prompt: string | null;
  reference_image_url: string | null;
  state: AssetState;
  created_at: number;
}

export type StoryboardState =
  | "pending"
  | "generating"
  | "done"
  | "failed"
  | "redone";

export interface Storyboard {
  id: string;
  project_id: string;
  scene_num: number;
  shot_num: number;
  shot_type: string | null;
  camera_move: string | null;
  description: string | null;
  first_frame_prompt: string | null;
  video_prompt: string | null;
  duration: number | null;
  assets: string | null; // JSON array of asset IDs
  state: StoryboardState;
  created_at: number;
}

export type VideoClipState = "generating" | "done" | "failed";

export interface VideoClip {
  id: string;
  project_id: string;
  storyboard_id: string;
  video_url: string | null;
  state: VideoClipState;
  is_selected: boolean;
  error_reason: string | null;
  version: number;
  created_at: number;
}

export type FinalCutState = "rendering" | "done" | "failed";

export interface FinalCut {
  id: string;
  project_id: string;
  video_url: string | null;
  video_clip_ids: string | null; // JSON array
  state: FinalCutState;
  created_at: number;
}

export type TaskType =
  | "brief_gen"
  | "script_gen"
  | "asset_extract"
  | "asset_image_gen"
  | "storyboard_gen"
  | "video_gen"
  | "final_cut";

export type TaskState = "queued" | "running" | "done" | "failed";

export interface Task {
  id: string;
  project_id: string;
  type: TaskType;
  state: TaskState;
  result: string | null; // JSON
  error: string | null;
  retry_count: number;
  created_at: number;
  finished_at: number | null;
}
