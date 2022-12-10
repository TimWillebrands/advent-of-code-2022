export const a = 1;

const inputFull = await Deno.readTextFile(Deno.args[0]);
const input = inputFull
  .split("\n")
  .filter((line) => line !== "")
  .map((line) => line.split(" "))
  .map((line) => ({
    operation: line[0],
    value: line[1] !== undefined ? Number(line[1]) : 0,
    duration: line[0] === "addx" ? 2 : 1,
  }))
  .reduce((acc, instruction) => {
    for (let i = 0; i < instruction.duration - 1; i++) {
      acc.cycles.push(acc.currValue);
    }
    acc.currValue += instruction.value;
    acc.cycles.push(acc.currValue);
    return acc;
  }, {
    cycles: [1],
    currValue: 1,
  });

console.log(
  input.cycles[19] * 20 +
    input.cycles[59] * 60 +
    input.cycles[99] * 100 +
    input.cycles[139] * 140 +
    input.cycles[179] * 180 +
    input.cycles[219] * 220,
);
