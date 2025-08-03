import { PlayerName, Winner } from '../types/game.type';
import Configs from '../configs';

export const getRandomIndex = (arr: any[]) => Math.floor(Math.random() * arr.length);

export const getReward = (winner: Winner, player: PlayerName) => {
  if (winner === null) {
    return Configs.drawPoints;
  }
  if (winner === undefined) {
    return Configs.gameNotOverYetPoints;
  }
  return winner === player ? Configs.winningPoints : Configs.losingPoints;
};