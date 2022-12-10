export const a = 1;
const directions = {
  "L": { x: -1, y: 0 },
  "R": { x: 1, y: 0 },
  "U": { x: 0, y: 1 },
  "D": { x: 0, y: -1 },
};

type V2 = { x: number; y: number };

const dist = (va: V2, vb: V2) =>
  Math.sqrt((vb.x - va.x) ** 2 + (vb.y - va.y) ** 2);

const inputFull = await Deno.readTextFile(Deno.args[0]);
const input = inputFull
  .split("\n")
  .filter((line) => line !== "")
  .map((line) => line.split(" "))
  .map((line) => ({
    dir: directions[line[0] as "L"],
    amt: Number(line[1]),
  }))
  .reduce((acc, instr) => {
    for (let i = 0; i < instr.amt; ++i) {
      const prev = { ...acc.head };
      acc.head.x += instr.dir.x;
      acc.head.y += instr.dir.y;
      if (dist(acc.head, acc.tail) >= 2) {
        acc.tail = prev;
        acc.visits[prev.x] = acc.visits[prev.x] || {};
        acc.visits[prev.x][prev.y] = true;
      }
    }
    return acc;
  }, {
    head: { x: 0, y: 0 },
    tail: { x: 0, y: 0 },
    visits: { 0: { 0: true } } as { [x: number]: { [y: number]: boolean } },
  });

const total = Object.values(input.visits)
  .map((x) => Object.keys(x).length)
  .reduce((prev, curr) => prev + curr);

console.log(total);
