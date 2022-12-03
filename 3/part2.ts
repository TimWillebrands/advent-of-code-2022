export const a = 1;

const alphabet = [..." abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"];

const inputFull = await Deno.readTextFile(Deno.args[0]);
const lines = inputFull
  .split("\n")
  .filter((line) => line !== "");

const stuff = lines
  .reduce(
    (acc, line, index) => {
      const trupleIndex = Math.floor(index / 3);
      if (acc[trupleIndex] === undefined) acc[trupleIndex] = [];
      acc[trupleIndex].push([...line]);
      return acc;
    },
    new Array<string[][]>(Math.floor(lines.length / 3)),
  )
  .map((line) =>
    line[0].filter((char) => line[1].includes(char) && line[2].includes(char))
  )
  .map((line) => line[0])
  .reduce((acc, val) => acc + alphabet.indexOf(val), 0);

console.log(stuff);
