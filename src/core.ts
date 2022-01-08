export interface Cell {
  isLiving: boolean;
  initLiving: boolean;
}

const neighborRange = [-1, 0, 1];
const countLivingNeighbor = (
  grid: Cell[][],
  [cellX, cellY]: [number, number]
) =>
  neighborRange.reduce(
    (count, dx) =>
      count +
      neighborRange.reduce(
        (rowSum, dy) =>
          rowSum +
          (!dx && !dy
            ? 0
            : +(grid[cellX + dx]?.[cellY + dy]?.isLiving ?? false)),
        0
      ),
    0
  );
export const reduceNextGeneration = (grid: Cell[][]): Cell[][] =>
  grid.map((row, x) =>
    row.map((current, y) => {
      const count = countLivingNeighbor(grid, [x, y]);
      return {
        ...current,
        isLiving: count === 3 ? true : count === 2 ? current.isLiving : false,
      };
    })
  );

export const createCell = (living = false): Cell => ({
  isLiving: living,
  initLiving: living,
});

export const createEmptyGird = (rows: number, columns: number) =>
  Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => createCell(false))
  );

export const replaceItemInArray = <T>(array: T[], index: number, item: T) => [
  ...array.slice(0, index),
  item,
  ...array.slice(index + 1),
];

export const toggleLivingState = (cell: Cell): Cell => ({
  isLiving: !cell.isLiving,
  initLiving: !cell.isLiving,
});

export const randomGenerate = (rows: number, colums: number, p: number) =>
  Array.from({ length: rows }, () =>
    Array.from({ length: colums }, () => createCell(Math.random() * 100 < p))
  );
