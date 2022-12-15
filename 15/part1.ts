export const a = 15;

type Pt = [number, number];
const dist = ([x0, y0]: Pt, [x1, y1]: Pt) =>
  Math.abs(x1 - x0) + Math.abs(y1 - y0);

const inputFull = await Deno.readTextFile(Deno.args[0]);
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
// .reduce(intersect van sensor-areas met y-as berekenen en union van die allemaal maken oid);

console.log(input);
