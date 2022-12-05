export const a = 1;

function toColumns(line: string) {
  const rows = new Array<string>();

  for (let i = 0; i < line.length; i += 4) {
    rows[Math.floor(i / 4)] = line.slice(i, i + 4);
  }

  return rows.map((row) => row.charAt(1));
}

const rotate = (array: string[][]) =>
  array.reduce((result, a, i, aa) => {
    a.forEach(function (b, j) {
      result[j] = result[j] || [];
      result[j][aa.length - i - 1] = b;
    });
    return result;
  }, new Array<string[]>());

const inputFull = await Deno.readTextFile(Deno.args[0]);
const sections = inputFull
  .split("\n\n")
  .filter((line) => line !== "")
  .map((line) => line.split("\n"));

const columns = rotate(sections[0].slice(0, -1).map(toColumns))
  .map((column) => column.filter((cell) => cell !== " "));

const result = sections[1]
  .map((move) =>
    move.split(" ").filter((_, i) => i % 2 === 1).map((char) => Number(char))
  )
  .filter((move) => move.length > 0)
  .reduce((stacks, move) => {
    console.log(move, move[1] - 1, stacks);
    const moved = stacks[move[1] - 1].splice(-move[0]);
    stacks[move[2] - 1].push(...moved);
    return stacks;
  }, columns)
  .map((stack) => stack.pop())
  .join("");

console.log(result);
