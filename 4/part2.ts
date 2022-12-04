export const a = 1;

const inputFull = await Deno.readTextFile(Deno.args[0]);
const input = inputFull
  .split("\n")
  .filter((line) => line !== "")
  .map((line) =>
    line
      .split(",")
      .map((range) =>
        range
          .split("-")
          .map((n) => Number(n))
      )
  )
  .filter((rangePair) =>
    rangePair[0][0] <= rangePair[1][1] &&
    rangePair[0][1] >= rangePair[1][0]
  );
console.log(input.slice(0, 10), input.length);
