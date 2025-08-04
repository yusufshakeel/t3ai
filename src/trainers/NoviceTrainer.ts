import Agent from '../Agent';
import Configs from '../configs';
import { GameSymbol } from '../types/game.type';
import { playGames } from './common';

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

    playerX.printConfig();
    playerO.printConfig();

    playGames(Configs.numberOfGames, playerX, playerO, '[Novice]');

    return playerX.getQTable();
  }
}

export default NoviceTrainer;