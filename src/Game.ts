import { Board, GameSymbol, PlayerGameSymbol, Winner } from './types/game.type';
import { Action, State } from './types/qtable.type';
import { getStateFromBoard } from './helpers';

class Game {
  private done: boolean;
  private board: Board[];
  private currentPlayerGameSymbol: PlayerGameSymbol;
  private winner: Winner;

  constructor() {
    this.board = Array(9).fill(null);
    this.currentPlayerGameSymbol = GameSymbol.X;
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
    this.currentPlayerGameSymbol = this.currentPlayerGameSymbol === GameSymbol.X
      ? GameSymbol.O
      : GameSymbol.X;
  }

  public isPlayerWinning(playerGameSymbol: PlayerGameSymbol): boolean {
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
      tupleIndexes.every(index => this.board[index] === playerGameSymbol)
    );
  }

  setBoard(board: Board[]): void {
    this.board = board;
  }

  getBoard(): Board[] {
    return this.board;
  }

  setCurrentPlayerGameSymbol(currentPlayerGameSymbol: PlayerGameSymbol): void {
    this.currentPlayerGameSymbol = currentPlayerGameSymbol;
  }

  getWinner(): Winner {
    return this.winner;
  }

  getCurrentPlayerGameSymbol(): PlayerGameSymbol {
    return this.currentPlayerGameSymbol;
  }

  isGameOver(): boolean {
    return this.done;
  }

  reset(): State {
    this.board = Array(9).fill(null);
    this.currentPlayerGameSymbol = GameSymbol.X;
    this.winner = null;
    this.done = false;
    return this.getState();
  }

  getState(): State {
    return getStateFromBoard(this.board);
  }

  getAvailableActions(): Action[] {
    return this.board
      .map((cell, idx) => (cell === null ? idx : null))
      .filter(idx => idx !== null) as Action[];
  }

  makeMove(action: Action): void {
    if (this.isValidAction(action)) {
      this.board[action] = this.currentPlayerGameSymbol;

      if (this.isPlayerWinning(this.currentPlayerGameSymbol)) {
        this.winner = this.currentPlayerGameSymbol;
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