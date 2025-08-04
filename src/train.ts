import fs from 'fs/promises';
import NoviceTrainer from './trainers/NoviceTrainer';
import Configs from './configs';
import { AgentType } from './types/agent.type';
import { QTable } from './types/qtable.type';

async function trainAgent() {
  let qTable: QTable = {};
  const fileName = `t3ai-${Configs.agentType}.json`;
  const filePath = process.cwd() + '/models/' + fileName;

  console.log('Starting training...');

  if (Configs.agentType === AgentType.NOVICE) {
    qTable = NoviceTrainer.train();
  }

  await fs.writeFile(filePath, JSON.stringify(qTable));

  console.log(`QTable saved to ${filePath}`);
  console.log('Training completed!');
}

trainAgent().catch(console.error);