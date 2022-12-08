export const a = 1;

const isVisible = (x: number, y: number, height: number, forest: number[][]) =>
  forest[y].slice(0, x).every((tree) => height > tree) ||
  forest[y].slice(x + 1).every((tree) => height > tree) ||
  forest.slice(0, y).every((row) => height > row[x]) ||
  forest.slice(y + 1).every((row) => height > row[x]);

const inputFull = await Deno.readTextFile(Deno.args[0]);
const input = inputFull
  .split("\n")
  .filter((line) => line !== "")
  .map((line) => [...line].map((tree) => Number(tree)))
  .map((row, y, forest) => row.map((tree, x) => isVisible(x, y, tree, forest)))
  .reduce(
    (acc, row) => acc + row.reduce((accCol, tree) => accCol + (+tree), 0),
    0,
  );

console.log(input);
