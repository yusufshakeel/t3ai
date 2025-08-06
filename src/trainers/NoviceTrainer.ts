import Agent from '../Agent';
import Configs from '../configs';
import { GameSymbol } from '../types/game.type';
import { playGames } from './common';

class NoviceTrainer {
  static train() {
    const agentX = new Agent(GameSymbol.X);
    const agentO = new Agent(GameSymbol.O);

    agentX.setIsTraining(true);
    agentO.setIsTraining(true);

    console.log('Points', {
      win: Configs.winningPoints,
      loss: Configs.losingPoints,
      draw: Configs.drawPoints,
      gameNotOverYet: Configs.gameNotOverYetPoints
    });

    agentX.printConfig();
    agentO.printConfig();

    playGames(
      Configs.numberOfGames,
      agentX,
      agentO,
      '[Novice]'
    );

    return [agentX.getQTable(), agentO.getQTable()];
  }
}

export default NoviceTrainer;