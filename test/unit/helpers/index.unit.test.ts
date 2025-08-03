import { getRandomIndex } from '../../../src/helpers';

describe('helpers', () => {
  describe('getRandomIndex', () => {
    it('should be able to return a random index', () => {
      const arr = [1, 2, 3, 4, 5];
      const randomIndex = getRandomIndex(arr);
      expect(randomIndex).toBeLessThan(arr.length);
      expect(randomIndex).toBeGreaterThan(-1);
    });
  });
});