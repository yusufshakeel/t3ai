import Agent from '../Agent';
import Configs from '../configs';
import { GameSymbol } from '../types/game.type';
import { playGames } from './common';
import { AgentType } from '../types/agent.type';

class BeginnerTrainer {
  static train() {
    const playerX = new Agent(GameSymbol.X, AgentType.BEGINNER);
    const playerO = new Agent(GameSymbol.O, AgentType.BEGINNER);

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

      playerX.printConfig();
      playerO.printConfig();

      playGames(
        phase.numberOfGames,
        playerX,
        playerO,
        `[Beginner - ${phase.name}]`
      );
    });

    return [playerX.getQTable(), playerO.getQTable()];
  }
}

export default BeginnerTrainer;