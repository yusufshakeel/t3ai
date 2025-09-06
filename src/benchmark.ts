import fs from 'fs/promises';
import { QTable } from './types/qtable.type';
import Agent from './Agent';
import { GameSymbol } from './types/game.type';
import Game from './Game';
import { getRandomIndex } from './helpers';
import {
  T3AI_LEARNER_MODEL_FILE_NAME,
  T3AI_LEARNER_MODEL_O_FILE_NAME,
  T3AI_LEARNER_MODEL_X_FILE_NAME,
  models,
  oModels,
  xModels
} from './constants';
import { AgentType } from './types/agent.type';
import Configs from './configs';

const modelsDir = process.cwd() + '/models';
const numberOfGames = 1000;
const report: any[] = [];

const getAgentModels = (agentGameSymbol: GameSymbol): {
    filename: string
    agentType: AgentType
}[] => {
  if (Configs.generateSingleModel) {
    return models;
  }
  return agentGameSymbol === GameSymbol.X
    ? xModels
    : oModels;
};

async function playAgainstRandomPlayer() {
  const agent = new Agent(GameSymbol.O, AgentType.NOVICE);

  const opponentGameSymbols = [GameSymbol.X, GameSymbol.O];

  for (const opponentGameSymbol of opponentGameSymbols) {
    const agentGameSymbol = opponentGameSymbol === GameSymbol.X
      ? GameSymbol.O
      : GameSymbol.X;

    const agentModels = getAgentModels(agentGameSymbol);

    for (const agentModel of agentModels) {
      const filePath = modelsDir + '/' + agentModel.filename;
      const qTable: QTable = JSON.parse(await fs.readFile(filePath, 'utf-8'));

      agent.setGameSymbol(agentGameSymbol);
      agent.setAgentType(agentModel.agentType);
      agent.setQTable(qTable);
      agent.reconfigure(0.1, 0.95, 0, 0, 0);

      let win = 0, loss = 0, draw = 0;

      for (let gameCount = 1; gameCount <= numberOfGames; gameCount++) {
        const game = new Game();
        game.reset();

        while (!game.isGameOver()) {
          const available = game.getAvailableActions();

          if (game.getCurrentPlayerGameSymbol() === agent.getGameSymbol()) {
            const state = game.getState();
            const action = agent.chooseAction(state, available);
            game.makeMove(action);
          } else {
            const action = available[getRandomIndex(available)];
            game.makeMove(action);
          }
        }

        if (game.getWinner() === agent.getGameSymbol()) {
          win++;
        } else if (game.getWinner() === opponentGameSymbol) {
          loss++;
        } else {
          draw++;
        }
      }

      report.push({
        model: agentModel.filename,
        against: 'random player',
        wins: win,
        losses: loss,
        draws: draw,
        winRate: `${(win / numberOfGames * 100).toFixed(2)}%`,
        lossRate: `${(loss / numberOfGames * 100).toFixed(2)}%`,
        drawRate: `${(draw / numberOfGames * 100).toFixed(2)}%`
      });
    }
  }
}

async function playAgainstLearnerPlayer() {
  const agent = new Agent(GameSymbol.O, AgentType.NOVICE);
  const opponentAgent = new Agent(GameSymbol.X, AgentType.NOVICE);

  const opponentGameSymbols = [GameSymbol.X, GameSymbol.O];
  const opponentAgentModels = Configs.generateSingleModel
    ? {
      [GameSymbol.X]: { filename: T3AI_LEARNER_MODEL_FILE_NAME, agentType: AgentType.LEARNER },
      [GameSymbol.O]: { filename: T3AI_LEARNER_MODEL_FILE_NAME, agentType: AgentType.LEARNER }
    }
    : {
      [GameSymbol.X]: { filename: T3AI_LEARNER_MODEL_X_FILE_NAME, agentType: AgentType.LEARNER },
      [GameSymbol.O]: { filename: T3AI_LEARNER_MODEL_O_FILE_NAME, agentType: AgentType.LEARNER }
    };

  for (const opponentGameSymbol of opponentGameSymbols) {
    const opponentAgentModel = opponentAgentModels[opponentGameSymbol];
    const filePathOpponentModel = modelsDir + '/' + opponentAgentModel.filename;
    const qTableOpponent: QTable = JSON.parse(await fs.readFile(filePathOpponentModel, 'utf-8'));

    opponentAgent.setGameSymbol(opponentGameSymbol);
    opponentAgent.setAgentType(opponentAgentModel.agentType);
    opponentAgent.setQTable(qTableOpponent);
    opponentAgent.reconfigure(0.1, 0.95, 0, 0, 0);

    const agentGameSymbol = opponentGameSymbol === GameSymbol.X
      ? GameSymbol.O
      : GameSymbol.X;

    const agentModels = getAgentModels(agentGameSymbol);

    for (const agentModel of agentModels) {
      const filePath = modelsDir + '/' + agentModel.filename;
      const qTable: QTable = JSON.parse(await fs.readFile(filePath, 'utf-8'));

      agent.setGameSymbol(agentGameSymbol);
      agent.setAgentType(agentModel.agentType);
      agent.setQTable(qTable);
      agent.reconfigure(0.1, 0.95, 0, 0, 0);

      let win = 0, loss = 0, draw = 0;

      for (let gameCount = 1; gameCount <= numberOfGames; gameCount++) {
        const game = new Game();
        game.reset();

        while (!game.isGameOver()) {
          const available = game.getAvailableActions();
          const currentPlayerAgent = game.getCurrentPlayerGameSymbol() === agent.getGameSymbol()
            ? agent
            : opponentAgent;
          const state = game.getState();
          const action = currentPlayerAgent.chooseAction(state, available);
          game.makeMove(action);
        }

        if (game.getWinner() === agent.getGameSymbol()) {
          win++;
        } else if (game.getWinner() === opponentGameSymbol) {
          loss++;
        } else {
          draw++;
        }
      }

      report.push({
        model: agentModel.filename,
        against: 'learner player',
        wins: win,
        losses: loss,
        draws: draw,
        winRate: `${(win / numberOfGames * 100).toFixed(2)}%`,
        lossRate: `${(loss / numberOfGames * 100).toFixed(2)}%`,
        drawRate: `${(draw / numberOfGames * 100).toFixed(2)}%`
      });
    }
  }
}

async function main() {
  await playAgainstRandomPlayer();
  await playAgainstLearnerPlayer();
  console.table(report);
}

main().catch(console.error);