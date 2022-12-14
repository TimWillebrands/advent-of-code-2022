export const a = 12;
const heights = "abcdefghijklmnopqrstuvwxyz";
const getHeight = (char:string) => {
    if (char === "S") return heights.indexOf("a");
    if (char === "E") return heights.indexOf("z");
    return heights.indexOf(char);
}

const inputFull = await Deno.readTextFile(Deno.args[0]);
const grid = inputFull
  .split("\n")
  .filter((line) => line !== "")
  .map((line) => [...line].map((char) => char));

const width = grid[0].length;
const heigth = grid.length;
const map = grid.flat();

const getNeighbours = (index: number) => {
  const neighbourhood = new Array<number>();
  const n = index - width;
  const s = index + width;
  if (n >= 0) neighbourhood.push(n);
  if ((index % width) + 1 < width) neighbourhood.push(index + 1);
  if (s < (heigth * width)) neighbourhood.push(s);
  if ((index % width) - 1 >= 0) neighbourhood.push(index - 1);

  return neighbourhood;
};

const start = map.indexOf("S");
const end = map.indexOf("E");

// Dijkstra goes from here
const graph = new Array(width * heigth).fill(null).map((_) => ({
  toStart: Number.MAX_SAFE_INTEGER,
  previous: -1,
  visited: false,
}));

graph[start].toStart = 0;

const toVisit = [start];

while (toVisit.length > 0) {
  const node = toVisit.sort((a,b) => graph[a].toStart - graph[b].toStart).shift()!;

  if (node === end) break;

  const height = getHeight(map[node]);

  getNeighbours(node)
    .filter((neighbour) => (getHeight(map[neighbour]) - (height)) <= 1)
    .forEach((neighbour) => {
      const totalRisk = graph[node].toStart + 1;
      if (totalRisk < graph[neighbour].toStart) {
        graph[neighbour].toStart = totalRisk;
        graph[neighbour].previous = node;
        toVisit.push(neighbour);
      }
    });
}

let path = [end];
while (path[0] !== start) {
  path = [graph[path[0]].previous, ...path];
}

const out = inputFull.split("\r\n").map((line, y) =>
  [...line].map((char, x) => path.includes((width * y) + x) ? char : '.').join("")
).join("\r\n");

console.log(
  end,
  "\r\n",
  path,
  "\r\n",
  //  path.map((node) => [node % width, Math.floor(node / width)]),
  path.map((node) => [node]).join(""),
  "\r\n",
  path.length - 1,
  "\r\n",
  out,
);