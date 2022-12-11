export const a = 1;

const inputFull = await Deno.readTextFile(Deno.args[0]);
const input = inputFull
  .split("\n\n")
  .map((line) => line.split("\n").filter((line) => line !== ""))
  .map((monkey) => ({
    name: monkey[0].slice(0, -1),
    items: monkey[1].slice(18).split(", ").map(Number),
    operation: (old: number) =>
      eval(monkey[2].slice(19).replaceAll("old", old.toString())) as number,
    test: Number(monkey[3].slice(21)),
    true: Number(monkey[4].split("monkey ")[1]),
    false: Number(monkey[5].split("monkey ")[1]),
  }));

console.log(input);
