
const { getCell, getAdjacentCells } = require('//src/game/util/gridGetters');
const generateGrid = require('//src/game/util/generateGrid');

describe('Getter utility methods for game grid', () => {
  describe('getCellForGrid()', () => {

    test('Returns false for empty grid', () => {
      expect(getCell(1, 1, false)).toBeFalsy();
      expect(getCell(1, 1, [])).toBeFalsy();
    });

    test('Returns false for out of bounds index', () => {
      const testGrid = generateGrid(3, 3);
      expect(getCell(-1, 1, testGrid)).toBeFalsy();
      expect(getCell(1, -1, testGrid)).toBeFalsy();
      expect(getCell(testGrid.length, 1, testGrid)).toBeFalsy();
      expect(getCell(1, testGrid.length, testGrid)).toBeFalsy();
    });

    test('Returns correct cell from grid position', () => {
      const testGrid = generateGrid(15, 10);
      const needle = 'needle';

      const pos = {
        h: 5, w: 10
      };
      testGrid[pos.h][pos.w] = 'needle';
      expect(getCell(pos.h, pos.w, testGrid)).toEqual('needle');
    });
  });
})