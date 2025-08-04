import { Board, GameSymbol, PlayerName, Winner } from './types/game.type';
import { Action, State } from './types/qtable.type';

class Game {
  private done: boolean;
  private board: Board[];
  private currentPlayer: PlayerName;
  private winner: Winner;

  constructor() {
    this.board = Array(9).fill(null);
    this.currentPlayer = GameSymbol.X;
    this.winner = null;
    this.done = false;
  }

  private isBoardFilled(): boolean {
    return !this.board.includes(null);
  }

  private isValidAction(action: Action): boolean {
    return !this.done && this.board[action] === null;
  }

  private switchCurrentPlayer(): void {
    this.currentPlayer = this.currentPlayer === GameSymbol.X
      ? GameSymbol.O
      : GameSymbol.X;
  }

  private isCurrentPlayerWinning(player: PlayerName): boolean {
    const winningIndexTuples = [
      [0, 1, 2], // row 1
      [3, 4, 5], // row 2
      [6, 7, 8], // row 3
      [0, 3, 6], // col 1
      [1, 4, 7], // col 2
      [2, 5, 8], // col 3
      [0, 4, 8], // diagonal top left to bottom right
      [2, 4, 6]  // diagonal bottom left to top right
    ];
    return winningIndexTuples.some(tupleIndexes =>
      tupleIndexes.every(index => this.board[index] === player)
    );
  }

  getWinner(): Winner {
    return this.winner;
  }

  getCurrentPlayer(): PlayerName {
    return this.currentPlayer;
  }

  isGameOver(): boolean {
    return this.done;
  }

  reset(): State {
    this.board = Array(9).fill(null);
    this.currentPlayer = GameSymbol.X;
    this.winner = null;
    this.done = false;
    return this.getState();
  }

  getState(): State {
    return this.board.map(c => c ?? '-').join('');
  }

  getAvailableActions(): Action[] {
    return this.board
      .map((cell, idx) => (cell === null ? idx : null))
      .filter(idx => idx !== null) as Action[];
  }

  makeMove(action: Action): void {
    if (this.isValidAction(action)) {
      this.board[action] = this.currentPlayer;

      if (this.isCurrentPlayerWinning(this.currentPlayer)) {
        this.winner = this.currentPlayer;
        this.done = true;
      } else if (this.isBoardFilled()) {
        this.done = true;
      } else {
        this.switchCurrentPlayer();
      }
    }
  }
}

export default Game;