export const a = 1;

const inputFull = await Deno.readTextFile(Deno.args[0]);
const monkeys = inputFull
  .split("\n\n")
  .map((line) => line.split("\n").filter((line) => line !== ""))
  .map((monkey) => ({
    name: monkey[0].slice(0, -1),
    startItems: monkey[1].slice(18).split(", ").map(Number),
    operation: (old: bigint) =>
      eval(
        monkey[2]
          .slice(19)
          .replace(/\d+/g, (d) => `${d}n`)
          .replaceAll("old", `${old.toString()}n`),
      ) as bigint,
    target: (item: bigint) =>
      (item % BigInt(monkey[3].slice(21))) === BigInt(0)
        ? Number(monkey[4].split("monkey ")[1])
        : Number(monkey[5].split("monkey ")[1]),
    divisor: BigInt(monkey[3].slice(21)),
  }));

// D-: Gestolen van: https://www.reddit.com/r/adventofcode/comments/ziktdy/2022_day_11_part_2_trick_for_part_2_is_off/
const product = monkeys.reduce((acc, monkey) => acc * monkey.divisor, 1n);
const monkeyItems = monkeys.map((monkey) => monkey.startItems.map(BigInt));
const monkeyInspections = new Array<number>(monkeys.length).fill(0);

for (let round = 0; round < 10000; round++) {
  for (let m = 0; m < monkeys.length; m++) {
    const monkey = monkeys[m];
    const items = monkeyItems[m];

    while (items.length > 0) {
      const old = items.shift();
      const item = monkey.operation(old!) % product;
      const target = monkey.target(item);
      monkeyItems[target].push(item);
      monkeyInspections[m]++;
    }
  }
}

console.log(monkeyInspections);
