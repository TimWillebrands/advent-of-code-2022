export const a = 1;

const calcScenicScore = (
  x: number,
  y: number,
  height: number,
  forest: number[][],
) => {
  const left = forest[y].slice(0, x);
  const leftIndex = left.findLastIndex((tree) => tree >= height);
  const leftScore = leftIndex < 0 ? left.length : left.length - leftIndex;

  const right = forest[y].slice(x + 1);
  const rightIndex = right.findIndex((tree) => tree >= height);
  const rightScore = rightIndex < 0 ? right.length : rightIndex + 1;

  const up = forest.slice(0, y);
  const upIndex = up.findLastIndex((tree) => tree[x] >= height);
  const upScore = upIndex < 0 ? up.length : up.length - upIndex;

  const down = forest.slice(y + 1);
  const downIndex = down.findIndex((tree) => tree[x] >= height);
  const downScore = downIndex < 0 ? down.length : downIndex + 1;

  return leftScore * rightScore * upScore * downScore; //leftScore + "|" + rightScore + "|" + upScore + "|" + downScore;
};

const inputFull = await Deno.readTextFile(Deno.args[0]);
const input = inputFull
  .split("\n")
  .filter((line) => line !== "")
  .map((line) => [...line].map((tree) => Number(tree)))
  .map((row, y, forest) =>
    row.map((tree, x) => calcScenicScore(x, y, tree, forest))
  )
  .map((row) => Math.max(...row));

console.log(Math.max(...input));
