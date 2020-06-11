
const generateGrid = require('//src/util/generateGrid');

const testGridDimensions = (testGrid, height, width) => {
  test('Row count correct', () => expect(testGrid.length).toBe(height));
  test('Column count correct', () => {
    for (const row of testGrid) {
      expect(row.length).toBe(width);
    }
  });
}
describe('Generates a h10 x w15 grid when called', function() {
  const height = 10;
  const width = 15;
  const testGrid = generateGrid(height, width);
  testGridDimensions(testGrid, height, width);
});

describe('Generates a h5 x w2 grid when called', function() {
  const height = 5;
  const width = 2;
  const testGrid = generateGrid(height, width);
  testGridDimensions(testGrid, height, width);
});