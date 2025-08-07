import Game from '../Game';
import { State } from '../types/qtable.type';
import { getReward } from '../helpers';
import Agent from '../Agent';

export const playGames = (
  numberOfGames: number,
  agent: Agent,
  opponentAgent: Agent,
  logPrefix: string,
  isOpponentAgentLearningEnabled = true
): void => {
  for (let gameCount = 1; gameCount <= numberOfGames; gameCount++) {
    const game = new Game();
    let state: State = game.reset();

    while (!game.isGameOver()) {
      const currentAgent = game.getCurrentPlayerGameSymbol() === agent.getGameSymbol()
        ? agent
        : opponentAgent;
      const availableActions = game.getAvailableActions();

      const action = currentAgent.chooseAction(state, availableActions);
      game.makeMove(action);

      const nextState = game.getState();
      const nextAvailableActions = game.getAvailableActions();
      const reward = getReward(
        game.getWinner(),
        currentAgent.getGameSymbol(),
        nextAvailableActions.length
      );

      if (currentAgent.getGameSymbol() === agent.getGameSymbol()
          || isOpponentAgentLearningEnabled
      ) {
        currentAgent.updateQTable(state, action, reward, nextState, nextAvailableActions);
        currentAgent.decayEpsilon();
      }

      state = nextState;
    }

    if (gameCount % 1000 === 0) {
      const percent = ((gameCount / numberOfGames) * 100).toFixed(2);
      console.log(`${logPrefix} Game finished: ${gameCount} / ${numberOfGames} [${percent}%]`);
    }
  }
};