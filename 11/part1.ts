export const a = 1;

const inputFull = await Deno.readTextFile(Deno.args[0]);
const monkeys = inputFull
  .split("\n\n")
  .map((line) => line.split("\n").filter((line) => line !== ""))
  .map((monkey) => ({
    name: monkey[0].slice(0, -1),
    startItems: monkey[1].slice(18).split(", ").map(Number),
    operation: (old: number) =>
      eval(monkey[2].slice(19).replaceAll("old", old.toString())) as number,
    target: (item: number) =>
      (item % Number(monkey[3].slice(21))) === 0
        ? Number(monkey[4].split("monkey ")[1])
        : Number(monkey[5].split("monkey ")[1]),
  }));

const monkeyItems = monkeys.map((monkey) => monkey.startItems);
const monkeyInspections = new Array<number>(monkeys.length).fill(0);

for (let round = 0; round < 20; round++) {
  for (let m = 0; m < monkeys.length; m++) {
    const monkey = monkeys[m];
    const items = monkeyItems[m];

    while (items.length > 0) {
      const item = Math.floor(monkey.operation(items.shift()!) / 3);
      const target = monkey.target(item);
      monkeyItems[target].push(item);
      monkeyInspections[m]++;
    }
  }
}

console.log(monkeyItems, monkeyInspections);
