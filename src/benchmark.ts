import fs from 'fs/promises';
import { QTable } from './types/qtable.type';
import Agent from './Agent';
import { GameSymbol } from './types/game.type';
import Game from './Game';
import { getRandomIndex } from './helpers';
import { oModels, T3AI_EXPERT_MODEL_O_FILE_NAME, T3AI_EXPERT_MODEL_X_FILE_NAME, xModels } from './constants';
import { AgentType } from './types/agent.type';

const modelsDir = process.cwd() + '/models';
const numberOfGames = 1000;
const report: any[] = [];

async function playAgainstRandomPlayer() {
  const agent = new Agent(GameSymbol.O);

  const opponentGameSymbols = [GameSymbol.X, GameSymbol.O];

  for (const opponentGameSymbol of opponentGameSymbols) {
    const agentGameSymbol = opponentGameSymbol === GameSymbol.X
      ? GameSymbol.O
      : GameSymbol.X;

    const agentModels = agentGameSymbol === GameSymbol.X
      ? xModels
      : oModels;

    for (const agentModel of agentModels) {
      const filePath = modelsDir + '/' + agentModel.filename;
      const qTable: QTable = JSON.parse(await fs.readFile(filePath, 'utf-8'));

      agent.setGameSymbol(agentGameSymbol);
      agent.setAgentType(agentModel.agentType);
      agent.setQTable(qTable);
      agent.reconfigure(0.1, 0.99999, 0, 0, 0);

      agent.printConfig();

      let win = 0, loss = 0, draw = 0;

      for (let episode = 1; episode <= numberOfGames; episode++) {
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

async function playAgainstExpertPlayer() {
  const agent = new Agent(GameSymbol.O);
  const opponentAgent = new Agent(GameSymbol.X);

  const opponentGameSymbols = [GameSymbol.X, GameSymbol.O];
  const opponentAgentModels = {
    [GameSymbol.X]: { filename: T3AI_EXPERT_MODEL_X_FILE_NAME, agentType: AgentType.EXPERT },
    [GameSymbol.O]: { filename: T3AI_EXPERT_MODEL_O_FILE_NAME, agentType: AgentType.EXPERT }
  };

  for (const opponentGameSymbol of opponentGameSymbols) {
    const opponentAgentModel = opponentAgentModels[opponentGameSymbol];
    const filePathOpponentModel = modelsDir + '/' + opponentAgentModel.filename;
    const qTableOpponent: QTable = JSON.parse(await fs.readFile(filePathOpponentModel, 'utf-8'));

    opponentAgent.setGameSymbol(opponentGameSymbol);
    opponentAgent.setAgentType(opponentAgentModel.agentType);
    opponentAgent.setQTable(qTableOpponent);
    opponentAgent.reconfigure(0.1, 0.99999, 0, 0, 0);

    const agentGameSymbol = opponentGameSymbol === GameSymbol.X
      ? GameSymbol.O
      : GameSymbol.X;

    const agentModels = agentGameSymbol === GameSymbol.X
      ? xModels
      : oModels;

    for (const agentModel of agentModels) {
      const filePath = modelsDir + '/' + agentModel.filename;
      const qTable: QTable = JSON.parse(await fs.readFile(filePath, 'utf-8'));

      agent.setGameSymbol(agentGameSymbol);
      agent.setAgentType(agentModel.agentType);
      agent.setQTable(qTable);
      agent.reconfigure(0.1, 0.99999, 0, 0, 0);

      agent.printConfig();

      let win = 0, loss = 0, draw = 0;

      for (let episode = 1; episode <= numberOfGames; episode++) {
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
        against: 'expert player',
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
  await playAgainstExpertPlayer();
  console.table(report);
}

main().catch(console.error);