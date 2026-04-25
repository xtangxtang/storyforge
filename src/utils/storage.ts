import fs from "fs";
import path from "path";
import { config } from "../config";

export const storage = {
  ensureProjectDirs(projectId: string): string {
    const base = path.join(config.projectsDir, projectId);
    const dirs = ["assets", "storyboards", "videos", "output"];
    for (const dir of dirs) {
      const dirPath = path.join(base, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    }
    return base;
  },

  getAssetPath(projectId: string, assetId: string, ext: string = "png"): string {
    return path.join(config.projectsDir, projectId, "assets", `${assetId}.${ext}`);
  },

  getStoryboardPath(projectId: string, shotId: string, ext: string = "png"): string {
    return path.join(config.projectsDir, projectId, "storyboards", `${shotId}_frame.${ext}`);
  },

  getVideoPath(projectId: string, clipId: string, version: number = 1): string {
    return path.join(config.projectsDir, projectId, "videos", `${clipId}_v${version}.mp4`);
  },

  getOutputPath(projectId: string): string {
    return path.join(config.projectsDir, projectId, "output", "final_cut.mp4");
  },

  saveFile(filePath: string, buffer: Buffer): void {
    fs.writeFileSync(filePath, buffer);
  },

  fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  },

  getRelativeUrl(filePath: string): string {
    const relative = path.relative(config.projectsDir, filePath);
    return `/files/${relative.replace(/\\/g, "/")}`;
  },
};
