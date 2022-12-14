export const a = 14;

const minMax = (n1: number, n2: number) => [
  Math.min(n1, n2),
  Math.max(n1, n2),
];

const inputFull = await Deno.readTextFile(Deno.args[0]);
const input = inputFull
  .split("\n")
  .filter((line) => line !== "")
  .map((line) =>
    line.split(" -> ").map((coord) => coord.split(",").map(Number))
  );

const [[xmin, xmax], [ymin, ymax]] = input
  .flat()
  .reduce((acc, curr) => [
    [
      Math.min(acc[0][0], curr[1]),
      Math.max(acc[0][1], curr[1]),
    ],
    [
      Math.min(acc[1][0], curr[0]),
      Math.max(acc[1][1], curr[0]),
    ],
  ], [[99999999, -99999999], [99999999, -99999999]]);

console.log(xmin, xmax, ymin, ymax);
let blankMap = [] as string[][];
for (let y = 0; y <= (ymax - ymin); y++) {
  blankMap[y] = [];
  for (let x = 0; x <= xmax; x++) {
    blankMap[y].push(".");
  }
}
blankMap[500 - ymin][0] = "+";

const map = input.reduce((acc, path) => {
  path.forEach((segment, i) => {
    const next = path[i + 1];
    if (next) {
      const [minX, maxX] = minMax(segment[1], next[1]);
      const [minY, maxY] = minMax(segment[0], next[0]);
      if (minX === maxX) {
        for (let y = minY; y <= maxY; y++) {
          acc[y - ymin][minX] = "X";
        }
      } else {
        for (let x = minX; x <= maxX; x++) {
          acc[minY - ymin][x] = "X";
        }
      }
    }
  });
  return acc;
}, blankMap);

function dropSand(col: number, row: number): false | [number, number] | "oob" {
  if (col < 0 || col > (ymax - ymin)) return "oob";
  const sand = map[col]
    .slice(row + 1)
    .findIndex((pos) => pos !== "." && pos !== "+") + row;
  if (sand <= row) {
    return false;
  }
  let left = dropSand(col - 1, sand);
  if (left !== false) return left;
  let right = dropSand(col + 1, sand);
  if (right !== false) return right;

  return [col, sand];
}

let cycle = 0;
while (true) {
  const drop = dropSand(500 - ymin, 0);
  if (drop === "oob") {
    break;
  } else if (drop !== false) {
    map[drop[0]][drop[1]] = String(cycle % 10);
  }
  cycle++;
}

map.forEach((row) => console.log(row.join("")));
console.log(cycle);
