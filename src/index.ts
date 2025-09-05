import readline from 'readline';
import fs from 'fs/promises';
import Agent from './Agent';
import Game from './Game';
import { Action, QTable, State } from './types/qtable.type';
import { GameSymbol, PlayerGameSymbol } from './types/game.type';
import {
  T3AI_BEGINNER_MODEL_O_FILE_NAME,
  T3AI_BEGINNER_MODEL_X_FILE_NAME,
  T3AI_LEARNER_MODEL_O_FILE_NAME,
  T3AI_LEARNER_MODEL_X_FILE_NAME,
  T3AI_NOVICE_MODEL_O_FILE_NAME,
  T3AI_NOVICE_MODEL_X_FILE_NAME
} from './constants';
import { AgentType } from './types/agent.type';
import { getReward } from './helpers';

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
  const history: { state: State, action: Action }[] = [];
  let state: State = game.reset();

  while (!game.isGameOver()) {
    const available: Action[] = game.getAvailableActions();
      
    if (game.getCurrentPlayerGameSymbol() === userSymbol) {
      let move: Action;
      let validMove = false;
      while (!validMove) {
        const input = await ask(`Your move (0-8): `);
        move = parseInt(input, 10) as Action;
        if (available.includes(move)) {
          validMove = true;
          game.makeMove(move);
        } else {
          console.log('Invalid move. Try again.');
          renderBoard(state);
        }
      }
    } else {
      const move = agent.chooseAction(state, available);
      console.log(`AI plays: ${move}`);
      game.makeMove(move);
      history.push({ state, action: move });
    }

    const nextState = game.getState();
    const nextAvailableActions = game.getAvailableActions();
    const reward = getReward(
      game.getWinner(),
      agent.getGameSymbol(),
      nextAvailableActions.length,
      game.isGameOver()
    );

    if (history.length) {
      const lastMove = history[history.length - 1];
      agent.updateQTable(
        lastMove.state,
        lastMove.action,
        reward,
        nextState,
        nextAvailableActions
      );
    }

    state = nextState;
    renderBoard(game.getState());
  }

  const reward = getReward(
    game.getWinner(),
    agent.getGameSymbol(),
    game.getAvailableActions().length,
    game.isGameOver()
  );
  for (const move of history) {
    agent.updateQTable(
      move.state,
      move.action,
      reward,
      state,
      []
    );
  }
}

async function main() {
  console.log('Welcome to Tic-Tac-Toe!');

  const modelsDir = process.cwd() + '/models';
  const models = {
    1: [T3AI_NOVICE_MODEL_X_FILE_NAME, T3AI_NOVICE_MODEL_O_FILE_NAME],
    2: [T3AI_BEGINNER_MODEL_X_FILE_NAME, T3AI_BEGINNER_MODEL_O_FILE_NAME],
    3: [T3AI_LEARNER_MODEL_X_FILE_NAME, T3AI_LEARNER_MODEL_O_FILE_NAME]
  };
  const agentTypes = {
    1: AgentType.NOVICE,
    2: AgentType.BEGINNER,
    3: AgentType.LEARNER
  };

  const userSymbol = (await ask('Do you want to be X or O? ')).toUpperCase();
  if (userSymbol !== GameSymbol.X && userSymbol !== GameSymbol.O) {
    throw new Error('Invalid input. Please choose X or O.');
  }
  const aiSymbol = userSymbol === GameSymbol.X ? GameSymbol.O : GameSymbol.X;

  console.log(
    'Choose your AI opponent\n' +
      '1. Novice\n' +
      '2. Beginner\n' +
      '3. Learner\n'
  );
  const aiType = (await ask('Select [1,2,3]: '));

  let modelPath: string = '';
  if (aiType === '1' || aiType === '2' || aiType === '3') {
    modelPath = modelsDir + '/' + models[aiType][aiSymbol === GameSymbol.X ? 0 : 1];
  } else {
    throw new Error('Invalid AI type');
  }

  const agent = new Agent(
    aiSymbol,
    agentTypes[aiType] as AgentType,
    0.01,
    0.9,
    0,
    0,
    0
  );
  const qTable: QTable = JSON.parse(await fs.readFile(modelPath, 'utf-8'));
  agent.setQTable(qTable);

  const game = new Game();
  renderBoard(game.getState());

  await playGame(game, agent, userSymbol as PlayerGameSymbol);

  printWinner(game, userSymbol, aiSymbol);

  if (agentTypes[aiType] === AgentType.LEARNER) {
    console.log('🤖 Learning from your moves...');
    await fs.writeFile(modelPath, JSON.stringify(agent.getQTable()));
    console.log('🤖 One more round.');
  }
}

main()
  .catch(err => {
    console.error(err.message);
  }).finally(() => {
    rl.close();
  });