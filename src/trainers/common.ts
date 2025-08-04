import Game from '../Game';
import { State } from '../types/qtable.type';
import { GameSymbol } from '../types/game.type';
import { getReward } from '../helpers';
import Agent from '../Agent';

export const playGames = (
  numberOfGames: number,
  playerX: Agent,
  playerO: Agent,
  logPrefix: string
): void => {
  for (let gameCount = 1; gameCount <= numberOfGames; gameCount++) {
    const game = new Game();
    let state: State = game.reset();

    while (!game.isGameOver()) {
      const currentAgent = game.getCurrentPlayer() === GameSymbol.X
        ? playerX
        : playerO;
      const availableActions = game.getAvailableActions();

      const action = currentAgent.chooseAction(state, availableActions);
      game.makeMove(action);

      const nextState = game.getState();
      const reward = getReward(game.getWinner(), currentAgent.getName());
      const nextAvailable = game.getAvailableActions();

      currentAgent.updateQTable(state, action, reward, nextState, nextAvailable);
      currentAgent.decayEpsilon();

      state = nextState;
    }

    if (gameCount % 1000 === 0) {
      const percent = ((gameCount / numberOfGames) * 100).toFixed(2);
      console.log(`${logPrefix} Game finished: ${gameCount} / ${numberOfGames} [${percent}%]`);
    }
  }
};