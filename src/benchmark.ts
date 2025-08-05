import fs from 'fs/promises';
import { QTable } from './types/qtable.type';
import Agent from './Agent';
import { GameSymbol } from './types/game.type';
import Game from './Game';
import { getRandomIndex } from './helpers';
import { T3AI_BEGINNER_MODEL_FILE_NAME, T3AI_NOVICE_MODEL_FILE_NAME } from './constants';

async function main() {
  const modelsDir = process.cwd() + '/models';
  const models = [
    T3AI_NOVICE_MODEL_FILE_NAME,
    T3AI_BEGINNER_MODEL_FILE_NAME
  ];
  const numberOfGames = 10000;

  const playerX = new Agent(GameSymbol.X);

  for (const model of models) {
    const filePath = modelsDir + '/' + model;
    const qTable: QTable = JSON.parse(await fs.readFile(filePath, 'utf-8'));

    playerX.setQTable(qTable);
    playerX.reconfigure(0.1, 0.99999, 0, 1, 1);

    let win = 0, loss = 0, draw = 0;

    for (let episode = 1; episode <= numberOfGames; episode++) {
      const game = new Game();
      game.reset();

      while (!game.isGameOver()) {
        const available = game.getAvailableActions();

        if (game.getCurrentPlayer() === GameSymbol.X) {
          const state = game.getState();
          const action = playerX.chooseAction(state, available);
          game.makeMove(action);
        } else {
          const action = available[getRandomIndex(available)];
          game.makeMove(action);
        }
      }

      if (game.getWinner() === GameSymbol.X) {
        win++;
      } else if (game.getWinner() === GameSymbol.O) {
        loss++;
      } else {
        draw++;
      }
    }

    console.log('======================================================');
    console.log(` Benchmark ${model} against RANDOM player`);
    console.log('======================================================');
    console.log(`Wins: ${win}`);
    console.log(`Losses: ${loss}`);
    console.log(`Draws: ${draw}`);
    console.log(`Win Rate: ${(win / numberOfGames * 100).toFixed(2)}%`);
    console.log(`Draw Rate: ${(draw / numberOfGames * 100).toFixed(2)}%`);
    console.log(`Loss Rate: ${(loss / numberOfGames * 100).toFixed(2)}%`);
  }
}

main().catch(console.error);