import { Board, PlayerGameSymbol, Winner } from '../types/game.type';
import Configs from '../configs';
import { State } from '../types/qtable.type';

export const getRandomIndex = (arr: any[]) => Math.floor(Math.random() * arr.length);

export const getReward = (winner: Winner, player: PlayerGameSymbol) => {
  if (winner === null) {
    return Configs.drawPoints;
  }
  if (winner === undefined) {
    return Configs.gameNotOverYetPoints;
  }
  return winner === player ? Configs.winningPoints : Configs.losingPoints;
};

export const getBoardFromState = (state: State): Board[] =>
  state.split('').map(c => (c === '-' ? null : c)) as Board[];

export const getStateFromBoard = (board: Board[]): State =>
  board.map(c => c ?? '-').join('');