export const a = 1

const inputFull = await Deno.readTextFile(Deno.args[0]);
const input = inputFull
  .split("\n\n")
  .map((line) => line
    .split('\n')
    .filter(l => l !== "")
    .map(l => Number(l))
    .reduce((c, p ) => c + p)
  ).reduce((max, val) => val > max ? val : max);

console.log(input)
