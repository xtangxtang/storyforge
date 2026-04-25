import { Agent, AgentContext, AgentResult } from "./agent";

export class PlanningAgent extends Agent {
  name = "PlanningAgent";

  async run(context: AgentContext): Promise<AgentResult> {
    // TODO: integrate with LLM to generate brief
    return {
      success: true,
      data: {
        genre: "romance",
        duration: 60,
        aspect_ratio: "9:16",
        mood: "warm",
        visual_style: "soft lighting, pastel colors",
        story_outline: "A chance encounter at a coffee shop...",
      },
    };
  }
}

export class ScriptAgent extends Agent {
  name = "ScriptAgent";

  async run(context: AgentContext): Promise<AgentResult> {
    // TODO: integrate with LLM to generate script + extract assets
    return {
      success: true,
      data: {
        scenes: [
          {
            scene_num: 1,
            location: "coffee shop",
            description: "Rainy day, sitting alone by the window",
            dialogue: [],
            action: "Looks out the window, sighs",
            duration: 8,
          },
        ],
        assets: [
          { type: "character", name: "protagonist", description: "A young person with a thoughtful expression" },
          { type: "location", name: "coffee shop", description: "Cozy cafe with large windows, warm interior" },
        ],
      },
    };
  }
}

export class ProductionAgent extends Agent {
  name = "ProductionAgent";

  async run(context: AgentContext): Promise<AgentResult> {
    // TODO: integrate with LLM + video models to generate storyboards, videos, final cut
    return {
      success: true,
      data: {
        storyboards: [],
        videoClips: [],
        finalCut: null,
      },
    };
  }
}
