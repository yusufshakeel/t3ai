import { Game } from '../../src';

describe('Game', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
  });

  describe('getWinner', () => {
    it('should return null when there is no winner', () => {
      expect(game.getWinner()).toBeNull();
    });
  });

  describe('getCurrentPlayer', () => {
    it('should return current player', () => {
      expect(game.getCurrentPlayer()).toBe('X');
    });
  });

  describe('isGameOver', () => {
    it('should return game over status', () => {
      expect(game.isGameOver()).toBeFalsy();
    });
  });

  describe('getState', () => {
    it('should return the state of the game', () => {
      expect(game.getState()).toBe('---------');
    });
  });

  describe('getAvailableActions', () => {
    it('should return available action', () => {
      expect(game.getAvailableActions()).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    });
  });

  describe('reset', () => {
    it('should reset game', () => {
      expect(game.reset()).toBe('---------');
    });
  });

  describe('makeMove', () => {
    it('should make the first move', () => {
      const initialState = game.getState();
      game.makeMove(0);
      const newState = game.getState();

      expect(initialState).toBe('---------');
      expect(newState).toBe('X--------');
    });

    it('should do nothing when the move is invalid', () => {
      const initialPlayer = game.getCurrentPlayer();
      const initialState = game.getState();
      const initialAvailableActions = game.getAvailableActions();

      game.makeMove(0);
      const newState = game.getState();

      const newPlayer = game.getCurrentPlayer();
      game.makeMove(0);
      const stateAfterInvalidMove = game.getState();
      const newAvailableActions = game.getAvailableActions();

      expect(initialPlayer).toBe('X');
      expect(newPlayer).toBe('O');

      expect(initialState).toBe('---------');
      expect(newState).toBe('X--------');
      expect(newState).toBe(stateAfterInvalidMove);
      expect(initialAvailableActions).toStrictEqual([0,1,2,3,4,5,6,7,8]);
      expect(newAvailableActions).toStrictEqual([1,2,3,4,5,6,7,8]);
    });

    it('should be able to return winner', () => {
      game.makeMove(0);
      game.makeMove(1);
      game.makeMove(2);
      game.makeMove(3);
      game.makeMove(4);
      game.makeMove(5);
      game.makeMove(6);

      expect(game.getWinner()).toBe('X');
      expect(game.isGameOver()).toBeTruthy();
      expect(game.getCurrentPlayer()).toBe('X');
      expect(game.getState()).toBe('XOXOXOX--');
      expect(game.getAvailableActions()).toStrictEqual([7,8]);
    });

    it('should detech draw', () => {
      game.makeMove(0);
      game.makeMove(1);
      game.makeMove(2);
      game.makeMove(3);
      game.makeMove(5);
      game.makeMove(4);
      game.makeMove(7);
      game.makeMove(8);
      game.makeMove(6);

      expect(game.getWinner()).toBeNull();
      expect(game.isGameOver()).toBeTruthy();
      expect(game.getCurrentPlayer()).toBe('X');
      expect(game.getState()).toBe('XOXOOXXXO');
      expect(game.getAvailableActions()).toStrictEqual([]);
    });
  });
});