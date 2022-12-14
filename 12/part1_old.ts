export const a = 12;

const heights = "SabcdefghijklmnopqrstuvwxyzE";
const inputFull = await Deno.readTextFile(Deno.args[0]);
const grid = inputFull
  .split("\n")
  .filter((line) => line !== "")
  .map((line) => [...line].map((char) => heights.indexOf(char)));

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

const start = map.indexOf(0);
const end = map.indexOf(27);

// Dijkstra goes from here

const graph = new Array(width * heigth).fill(null).map((i) => ({
  toStart: 999999999999999,
  previous: -1,
  visited: false,
}));

graph[start].toStart = 0;

const toVisit = [start];

while (toVisit.length > 0) {
  const node = toVisit.pop()!;
  const height = map[node];

  getNeighbours(node)
    .filter((neighbour) => map[neighbour] <= (height + 1))
    .forEach((neighbour) => {
      if (graph[node].toStart + 1 < graph[neighbour].toStart) {
        graph[neighbour].toStart = graph[node].toStart + 1;
        graph[neighbour].previous = node;
        toVisit.push(neighbour);
      }
    });

  graph[node].visited = true;
}

let path = [end];
while (path[0] !== start) {
  path = [graph[path[0]].previous, ...path];
}

const out = inputFull.split("\n").map((line, y) =>
  [...line].map((char, x) => path.includes((width * y) + x) ? "." : char).join(
    "",
  )
).join("\n");

console.log(
  end,
  path,
  //  path.map((node) => [node % width, Math.floor(node / width)]),
  path.map((node) => heights.charAt(map[node])).join(""),
  path.length - 1,
  "\n",
  out,
);
