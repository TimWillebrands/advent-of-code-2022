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

const moveTo = (head: V2, tail: V2) => {
  if (dist(head, tail) < 2) return { x: 0, y: 0 };
  if (head.x === tail.x) return { x: 0, y: (head.y - tail.y) > 0 ? 1 : -1 };
  if (head.y === tail.y) return { x: (head.x - tail.x) > 0 ? 1 : -1, y: 0 };
  return {
    x: (head.x - tail.x) > 0 ? 1 : -1,
    y: (head.y - tail.y) > 0 ? 1 : -1,
  };
};

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
      acc.knots[0].x += instr.dir.x;
      acc.knots[0].y += instr.dir.y;

      for (
        let movedKnot = 1;
        movedKnot < 10;
        movedKnot++
      ) {
        const move = moveTo(
          acc.knots[movedKnot - 1],
          acc.knots[movedKnot],
        );
        acc.knots[movedKnot].x += move.x;
        acc.knots[movedKnot].y += move.y;

        acc.visits[acc.knots[9].x] = acc.visits[acc.knots[9].x] || {};
        acc.visits[acc.knots[9].x][acc.knots[9].y] = true;
      }
    }

    return acc;
  }, {
    knots: new Array<number>(10).fill(1).map((_) => ({ x: 0, y: 0 })),
    visits: { 0: { 0: true } } as { [x: number]: { [y: number]: boolean } },
  });

const total = Object.values(input.visits)
  .map((x) => Object.keys(x).length)
  .reduce((prev, curr) => prev + curr);

console.log(total);
