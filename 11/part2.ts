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
  }));

const monkeyItems = monkeys.map((monkey) => monkey.startItems.map(BigInt));
const monkeyInspections = new Array<number>(monkeys.length).fill(0);
let lastInstpections = [...monkeyInspections];

for (let round = 0; round < 10000; round++) {
  let inspections = 0;
  for (let m = 0; m < monkeys.length; m++) {
    const monkey = monkeys[m];
    const items = monkeyItems[m];

    while (items.length > 0) {
      const old = items.shift();
      const item = monkey.operation(old!);
      const target = monkey.target(item);
      monkeyItems[target].push(item);
      monkeyInspections[m]++;
      inspections++;
    }
  }
  const meta = monkeyInspections.map((insp, i) => insp - lastInstpections[i]);
  if (meta[2] === 2) {
    console.log(
      round,
      inspections,
      "\t",
      monkeyInspections,
      "\t",
      meta,
    );
  }
  lastInstpections = [...monkeyInspections];
}

// console.log(monkeyItems, monkeyInspections);
