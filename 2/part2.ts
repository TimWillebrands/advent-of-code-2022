export const a = 1;

const daRules = {
  X: {
    A: 3, // ROCK
    B: 1, // PAPER
    C: 2, // SCISORS
  },
  Y: {
    A: 1, // ROCK
    B: 2, // PAPER
    C: 3, // SCISORS
  },
  Z: {
    A: 2, // ROCK
    B: 3, // PAPER
    C: 1, // SCISORS
  },
};

type Key = keyof typeof daRules;
type Piece = keyof typeof daRules["X"];

const inputFull = await Deno.readTextFile(Deno.args[0]);
const input = inputFull
  .split("\r\n")
  .map((line) => line.split(" ") as [Piece, Key])
  .map((line) => ({
    win: Object.keys(daRules).indexOf(line[1]) * 3, // Look ma, no branches :)
    piece: daRules[line[1]][line[0]],
  }))
  .map((line) => line.piece + line.win)
  .reduce((prev, curr) => prev + curr);

console.log(input);
