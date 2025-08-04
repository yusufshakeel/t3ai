import Agent from '../Agent';
import Configs from '../configs';
import { GameSymbol } from '../types/game.type';
import { playGames } from './common';

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

      playGames(phase.numberOfGames, playerX, playerO, `[Beginner - ${phase.name}]`);
    });

    return playerX.getQTable();
  }
}

export default BeginnerTrainer;