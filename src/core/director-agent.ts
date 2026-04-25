import { Agent, AgentContext, AgentResult } from "./agent";
import { PlanningAgent, ScriptAgent, ProductionAgent } from "./agents";

export type WorkflowStage =
  | "planning"
  | "scripting"
  | "asseting"
  | "storyboarding"
  | "generating"
  | "cutting"
  | "done";

const stageOrder: WorkflowStage[] = [
  "planning",
  "scripting",
  "asseting",
  "storyboarding",
  "generating",
  "cutting",
  "done",
];

export class DirectorAgent extends Agent {
  name = "DirectorAgent";

  private planningAgent = new PlanningAgent();
  private scriptAgent = new ScriptAgent();
  private productionAgent = new ProductionAgent();

  async run(context: AgentContext): Promise<AgentResult> {
    const { projectId } = context;
    const currentStage = (context.currentStage as WorkflowStage) || "planning";

    switch (currentStage) {
      case "planning":
        return this.runPlanning(context);
      case "scripting":
        return this.runScripting(context);
      case "asseting":
        return this.runAsseting(context);
      case "storyboarding":
        return this.runStoryboarding(context);
      case "generating":
        return this.runGenerating(context);
      case "cutting":
        return this.runCutting(context);
      default:
        return { success: true, data: { message: "Project complete" } };
    }
  }

  private async runPlanning(context: AgentContext): Promise<AgentResult> {
    const result = await this.planningAgent.run(context);
    return this.advanceIfOk(context, result, "scripting");
  }

  private async runScripting(context: AgentContext): Promise<AgentResult> {
    const result = await this.scriptAgent.run(context);
    return this.advanceIfOk(context, result, "asseting");
  }

  private async runAsseting(context: AgentContext): Promise<AgentResult> {
    // Asset extraction is part of ScriptAgent output
    const result = await this.scriptAgent.run(context);
    return this.advanceIfOk(context, result, "storyboarding");
  }

  private async runStoryboarding(context: AgentContext): Promise<AgentResult> {
    const result = await this.productionAgent.run(context);
    return this.advanceIfOk(context, result, "generating");
  }

  private async runGenerating(context: AgentContext): Promise<AgentResult> {
    const result = await this.productionAgent.run(context);
    return this.advanceIfOk(context, result, "cutting");
  }

  private async runCutting(context: AgentContext): Promise<AgentResult> {
    const result = await this.productionAgent.run(context);
    if (result.success) {
      return { success: true, data: { ...result.data, stage: "done" } };
    }
    return result;
  }

  private advanceIfOk(
    context: AgentContext,
    result: AgentResult,
    nextStage: WorkflowStage
  ): AgentResult {
    if (result.success) {
      return {
        success: true,
        data: { ...result.data, nextStage },
      };
    }
    return result;
  }

  getCurrentStageIndex(state: WorkflowStage): number {
    return stageOrder.indexOf(state);
  }

  getNextStage(state: WorkflowStage): WorkflowStage | null {
    const idx = this.getCurrentStageIndex(state);
    return idx >= 0 && idx < stageOrder.length - 1 ? stageOrder[idx + 1] : null;
  }
}
