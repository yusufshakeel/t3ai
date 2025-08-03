import Agent from '../Agent';
import Game from '../Game';
import Configs from '../configs';
import { getReward } from '../helpers';

class NoviceTrainer {
  static train() {
    const playerX = new Agent('X');
    const playerO = new Agent('O');

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
        const currentAgent = game.getCurrentPlayer() === 'X' ? playerX : playerO;
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

      // Optionally print progress
      if (gameCount % 1000 === 0) {
        console.log(`Training ${gameCount} finished.`);
      }
    }

    return playerX.getQTable();
  }
}

export default NoviceTrainer;