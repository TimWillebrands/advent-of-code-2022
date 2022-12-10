export const a = 1;

const encoder = new TextEncoder();
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
  })
  .cycles.forEach((x, c) => {
    const position = (c) % 40;
    const pixel = [x - 1, x, x + 1].includes(position) ? "#" : ".";

    Deno.writeAllSync(
      Deno.stdout,
      encoder.encode(pixel.toString()),
    );
    if (position === 39) console.log("");
  });
