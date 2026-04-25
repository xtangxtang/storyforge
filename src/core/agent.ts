import { v4 as uuidv4 } from "uuid";

export interface AgentContext {
  projectId: string;
  [key: string]: unknown;
}

export interface AgentResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export abstract class Agent {
  abstract name: string;

  abstract run(context: AgentContext): Promise<AgentResult>;

  async review(context: AgentContext, result: AgentResult): Promise<AgentResult> {
    // Default: accept. Subclasses can override for quality checks.
    if (!result.success) {
      return this.retry(context, result);
    }
    return result;
  }

  async retry(context: AgentContext, _result: AgentResult): Promise<AgentResult> {
    // Default: just run again. Subclasses can override with smarter retry logic.
    return this.run(context);
  }

  protected createTaskId(): string {
    return `task_${uuidv4().slice(0, 8)}`;
  }
}
