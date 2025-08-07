import { AgentType } from '../types/agent.type';

export const T3AI_NOVICE_MODEL_X_FILE_NAME = 't3ai-novice-x.json';
export const T3AI_NOVICE_MODEL_O_FILE_NAME = 't3ai-novice-o.json';
export const T3AI_BEGINNER_MODEL_X_FILE_NAME = 't3ai-beginner-x.json';
export const T3AI_BEGINNER_MODEL_O_FILE_NAME = 't3ai-beginner-o.json';
export const T3AI_LEARNER_MODEL_X_FILE_NAME = 't3ai-learner-x.json';
export const T3AI_LEARNER_MODEL_O_FILE_NAME = 't3ai-learner-o.json';

export const xModels = [
  { filename: T3AI_NOVICE_MODEL_X_FILE_NAME, agentType: AgentType.NOVICE },
  { filename: T3AI_BEGINNER_MODEL_X_FILE_NAME, agentType: AgentType.BEGINNER },
  { filename: T3AI_LEARNER_MODEL_X_FILE_NAME, agentType: AgentType.LEARNER }
];

export const oModels = [
  { filename: T3AI_NOVICE_MODEL_O_FILE_NAME, agentType: AgentType.NOVICE },
  { filename: T3AI_BEGINNER_MODEL_O_FILE_NAME, agentType: AgentType.BEGINNER },
  { filename: T3AI_LEARNER_MODEL_O_FILE_NAME, agentType: AgentType.LEARNER }
];