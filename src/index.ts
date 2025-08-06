import readline from 'readline';
import fs from 'fs/promises';
import Agent from './Agent';
import Game from './Game';
import { Action, QTable, State } from './types/qtable.type';
import { GameSymbol, PlayerGameSymbol } from './types/game.type';
import {
  T3AI_BEGINNER_MODEL_X_FILE_NAME,
  T3AI_BEGINNER_MODEL_O_FILE_NAME,
  T3AI_NOVICE_MODEL_X_FILE_NAME,
  T3AI_NOVICE_MODEL_O_FILE_NAME, T3AI_EXPERT_MODEL_X_FILE_NAME, T3AI_EXPERT_MODEL_O_FILE_NAME
} from './constants';
import { AgentType } from './types/agent.type';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (question: string): Promise<string> => {
  return new Promise(resolve => rl.question(question, resolve));
};

const renderBoard = (state: State): void => {
  const cellEntries = state.split('').map(c => (c === '-' ? ' ' : c));
  console.log(`
   ${cellEntries[0]} | ${cellEntries[1]} | ${cellEntries[2]}
  ---+---+---
   ${cellEntries[3]} | ${cellEntries[4]} | ${cellEntries[5]}
  ---+---+---
   ${cellEntries[6]} | ${cellEntries[7]} | ${cellEntries[8]}
  `);
};

const printWinner = (
  game: Game,
  userSymbol: PlayerGameSymbol,
  aiSymbol: PlayerGameSymbol
): void => {
  if (game.getWinner() === userSymbol) {
    console.log('🎉 You win!');
  } else if (game.getWinner() === aiSymbol) {
    console.log('🤖 AI wins!');
  } else {
    console.log("🤝 It's a draw!");
  }
};

async function playGame(game: Game, agent: Agent, userSymbol: PlayerGameSymbol) {
  while (!game.isGameOver()) {
    if (game.getCurrentPlayerGameSymbol() === userSymbol) {
      const available: Action[] = game.getAvailableActions();
      let move: Action;
      let validMove = false;
      while (!validMove) {
        const input = await ask(`Your move (0-8): `);
        move = parseInt(input, 10) as Action;
        if (available.includes(move)) {
          validMove = true;
        } else {
          console.log('Invalid move. Try again.');
        }
      }
      game.makeMove(move!);
    } else {
      const state = game.getState();
      const available = game.getAvailableActions();
      const move = agent.chooseAction(state, available);
      console.log(`AI plays: ${move}`);
      game.makeMove(move);
    }

    renderBoard(game.getState());
  }
}

async function main() {
  console.log('Welcome to Tic-Tac-Toe!');

  const modelsDir = process.cwd() + '/models';
  const models = {
    1: [T3AI_NOVICE_MODEL_X_FILE_NAME, T3AI_NOVICE_MODEL_O_FILE_NAME],
    2: [T3AI_BEGINNER_MODEL_X_FILE_NAME, T3AI_BEGINNER_MODEL_O_FILE_NAME],
    3: [T3AI_EXPERT_MODEL_X_FILE_NAME, T3AI_EXPERT_MODEL_O_FILE_NAME]
  };
  const agentTypes = {
    1: AgentType.NOVICE,
    2: AgentType.BEGINNER,
    3: AgentType.EXPERT
  };

  const userSymbol = (await ask('Do you want to be X or O? ')).toUpperCase();
  if (userSymbol !== GameSymbol.X && userSymbol !== GameSymbol.O) {
    throw new Error('Invalid input. Please choose X or O.');
  }
  const aiSymbol = userSymbol === GameSymbol.X ? GameSymbol.O : GameSymbol.X;

  console.log('Choose your AI opponent\n1. Novice\n2. Beginner\n3. Expert');
  const aiType = (await ask('Select [1,3]: '));

  let modelPath: string = '';
  if (aiType === '1' || aiType === '2') {
    modelPath = modelsDir + '/' + models[aiType][aiSymbol === GameSymbol.X ? 0 : 1];
  } else {
    throw new Error('Invalid AI type');
  }

  const agent = new Agent(
    aiSymbol,
    0,
    0,
    0,
    0,
    0,
    false,
    agentTypes[aiType]
  );
  const qTable: QTable = JSON.parse(await fs.readFile(modelPath, 'utf-8'));
  agent.setQTable(qTable);

  const game = new Game();
  renderBoard(game.getState());

  await playGame(game, agent, userSymbol as PlayerGameSymbol);

  printWinner(game, userSymbol, aiSymbol);
}

main()
  .catch(err => {
    console.error(err.message);
  }).finally(() => {
    rl.close();
  });