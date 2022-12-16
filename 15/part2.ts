export const a = 15;

type Pt = [number, number];
const dist = ([x0, y0]: Pt, [x1, y1]: Pt) =>
  Math.abs(x1 - x0) + Math.abs(y1 - y0);

const inputFull = await Deno.readTextFile(Deno.args[0]);
const max = Number(Deno.args[1]);
const input = inputFull
  .split("\n")
  .filter((line) => line !== "")
  .map((line) => line.slice(12).split(":"))
  .map((line) => ({
    sensor: line[0].split(", y=").map(Number) as Pt,
    beakon: line[1].slice(24).split(", y=").map(Number) as Pt,
  }))
  .map((line) => ({
    ...line,
    distance: dist(line.sensor, line.beakon),
  }));

const findFreeX = (y: number) => {
  const intersections = input
    .map((line) => ({
      ...line,
      distToY: Math.abs(line.sensor[1] - y),
    }))
    .filter((line) => line.distToY < line.distance)
    .map((line) => [
      line.sensor[0] - (line.distance - line.distToY),
      line.sensor[0] + (line.distance - line.distToY),
    ])
    .sort((a, b) => a[0] - b[0])
    .reduce((acc, curr) => {
      const head = acc[acc.length - 1];
      if (head === undefined) return [curr];
      if (head[1] >= curr[0]) {
        acc.pop();
        acc.push([head[0], Math.max(head[1], curr[1])]);
      } else {
        acc.push(curr);
      }
      return acc;
    }, [[0, 0]]);

  return intersections;
};

let cycle = 0;
while (cycle < max) {
  const intersections = findFreeX(cycle);
  if (intersections.length > 1) {
    console.log(cycle, intersections);
    break;
  }

  console.log(cycle++);
}
