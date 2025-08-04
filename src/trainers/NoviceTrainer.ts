import Agent from '../Agent';
import Game from '../Game';
import Configs from '../configs';
import { getReward } from '../helpers';
import { GameSymbol } from '../types/game.type';

class NoviceTrainer {
  static train() {
    const playerX = new Agent(GameSymbol.X);
    const playerO = new Agent(GameSymbol.O);

    console.log('Points', {
      win: Configs.winningPoints,
      loss: Configs.losingPoints,
      draw: Configs.drawPoints,
      gameNotOverYet: Configs.gameNotOverYetPoints
    });

    for (let gameCount = 1; gameCount <= Configs.numberOfGames; gameCount++) {
      const game = new Game();
      let state = game.reset();

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
        console.log(`Training ${gameCount} finished.`);
      }
    }

    return playerX.getQTable();
  }
}

export default NoviceTrainer;