import Agent from '../Agent';
import Game from '../Game';
import Configs from '../configs';
import { GameSymbol } from '../types/game.type';
import { State } from '../types/qtable.type';
import { getReward } from '../helpers';

class BeginnerTrainer {
  static train() {
    const playerX = new Agent(GameSymbol.X);
    const playerO = new Agent(GameSymbol.O);

    console.log('Points', {
      win: Configs.winningPoints,
      loss: Configs.losingPoints,
      draw: Configs.drawPoints,
      gameNotOverYet: Configs.gameNotOverYetPoints
    });

    const phases = Configs.trainingPhases;

    phases.forEach(phase => {
      console.log('Training phase', phase);
      playerX.reconfigure(
        phase.alpha,
        phase.gamma,
        phase.epsilon,
        phase.epsilonDecay,
        phase.epsilonMin
      );
      playerO.reconfigure(
        phase.alpha,
        phase.gamma,
        phase.epsilon,
        phase.epsilonDecay,
        phase.epsilonMin
      );

      for (let gameCount = 1; gameCount <= phase.numberOfGames; gameCount++) {
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
          console.log(`Training ${gameCount} finished.`);
        }
      }
    });

    return playerX.getQTable();
  }
}

export default BeginnerTrainer;