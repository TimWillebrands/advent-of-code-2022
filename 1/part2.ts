export const a = 2;

const inputFull = await Deno.readTextFile(Deno.args[0]);
const input = inputFull
  .split("\n\n")
  .map((line) =>
    line
      .split("\n")
      .filter((l) => l !== "")
      .map((l) => Number(l))
      .reduce((c, p) => c + p)
  ).reduce((maxs, val) => {
    if (val > maxs.a) {
      return { a: val, b: maxs.a, c: maxs.b };
    } else if (val > maxs.b) {
      return { ...maxs, b: val, c: maxs.b };
    } else if (val > maxs.c) {
      return { ...maxs, c: val };
    }
    return maxs;
  }, { a: 0, b: 0, c: 0 });

console.log(input.a + input.b + input.c);
