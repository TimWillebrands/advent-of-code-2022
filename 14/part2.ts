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

let [[xmin, xmax], [ymin, ymax]] = input
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

const width = Number(Deno.args[1]) || 40;
ymin -= width / 2;
ymax += width / 2;
xmax += 2;
input.push([[ymin + 1, xmax], [ymax - 1, xmax]]);

console.log(xmin, xmax, ymin, ymax);
let blankMap = [] as string[][];
for (let y = 1; y <= (ymax - ymin); y++) {
  blankMap[y] = [];
  for (let x = 0; x <= xmax; x++) {
    if (x === xmax) {
      blankMap[y].push("#");
    } else {
      blankMap[y].push(".");
    }
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
          acc[y - ymin][minX] = "#";
        }
      } else {
        for (let x = minX; x <= maxX; x++) {
          acc[minY - ymin][x] = "#";
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
map.forEach((row) => console.log(row.join("")));

let cycle = 0;
while (true) {
  const drop = dropSand(500 - ymin, -1);
  if (drop === "oob") {
    break;
  } else if (drop !== false) {
    if (drop[0] === 500 - ymin && drop[1] === 0) break;
    map[drop[0]][drop[1]] = String(cycle % 10);
  } else if (drop === false) {
    break;
  }
  cycle++;

  if ((cycle % 1000) === 0) {
    map.forEach((row) => console.log(row.join("")));
    console.log();
  }
}

map.forEach((row) => console.log(row.join("")));
console.log(cycle);
