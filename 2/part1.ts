export const a = 1;

const daRules = {
  A: 1, // ROCK
  B: 2, // PAPER
  C: 3, // SCISORS
  X: 1, // ROCK
  Y: 2, // PAPER
  Z: 3, // SCISORS
};

type Key = keyof typeof daRules;

const inputFull = await Deno.readTextFile(Deno.args[0]);
const input = inputFull
  .split("\r\n")
  .map((line) => line.split(" ") as Key[])
  .map((line) => [daRules[line[0]], daRules[line[1]]])
  .map((line) => {
    const d = Math.abs(line[0] - line[1]);
    const winningPiece = d === 0 
        ? -1 
        : d === 1 
            ? Math.max(...line) 
            : Math.min(...line)
    return {
      win: winningPiece === line[1] 
        ? 6 
        : winningPiece === -1 
            ? 3 
            : 0,
      piece: line[1],
    };
  })
  .map(line => line.piece + line.win)
  .reduce((prev, curr) => prev + curr);

console.log(input);
