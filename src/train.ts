import fs from 'fs/promises';
import Configs from './configs';
import { AgentType } from './types/agent.type';
import { QTable } from './types/qtable.type';
import NoviceTrainer from './trainers/NoviceTrainer';
import BeginnerTrainer from './trainers/BeginnerTrainer';
import ExpertTrainer from './trainers/ExpertTrainer';
import {
  T3AI_BEGINNER_MODEL_X_FILE_NAME,
  T3AI_BEGINNER_MODEL_O_FILE_NAME,
  T3AI_EXPERT_MODEL_X_FILE_NAME,
  T3AI_EXPERT_MODEL_O_FILE_NAME,
  T3AI_NOVICE_MODEL_X_FILE_NAME,
  T3AI_NOVICE_MODEL_O_FILE_NAME
} from './constants';

async function trainAgent() {
  console.log('Starting training...');

  let qTableX: QTable = {};
  let qTableO: QTable = {};
  let fileNameX: string;
  let fileNameO: string;

  if (Configs.agentType === AgentType.NOVICE) {
    fileNameX = T3AI_NOVICE_MODEL_X_FILE_NAME;
    fileNameO = T3AI_NOVICE_MODEL_O_FILE_NAME;
    [qTableX, qTableO] = NoviceTrainer.train();
  } else if (Configs.agentType === AgentType.BEGINNER) {
    fileNameX = T3AI_BEGINNER_MODEL_X_FILE_NAME;
    fileNameO = T3AI_BEGINNER_MODEL_O_FILE_NAME;
    [qTableX, qTableO] = BeginnerTrainer.train();
  } else if (Configs.agentType === AgentType.EXPERT) {
    fileNameX = T3AI_EXPERT_MODEL_X_FILE_NAME;
    fileNameO = T3AI_EXPERT_MODEL_O_FILE_NAME;
    [qTableX, qTableO] = ExpertTrainer.train();
  } else {
    throw new Error('Invalid agent type');
  }

  const filePathX = process.cwd() + '/models/' + fileNameX;
  const filePathO = process.cwd() + '/models/' + fileNameO;

  await fs.writeFile(filePathX, JSON.stringify(qTableX));
  await fs.writeFile(filePathO, JSON.stringify(qTableO));

  console.log(`File saved: ${filePathX}`);
  console.log(`File saved: ${filePathO}`);
  console.log('Training completed!');
}

trainAgent().catch(console.error);