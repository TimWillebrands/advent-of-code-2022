export const a = 1;

const alphabet = [..." abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"];

const inputFull = await Deno.readTextFile(Deno.args[0]);
const input = inputFull
  .split("\n")
  .filter((line) => line !== "")
  .map((line) => [
    [...line.slice(0, Math.floor(line.length / 2))],
    [...line.slice(Math.ceil(line.length / 2))],
  ])
  .map((line) => line[0].filter((char) => line[1].includes(char)))
  .map((line) => line[0])
  .reduce((acc, val) => acc + alphabet.indexOf(val), 0);

console.log(input);
