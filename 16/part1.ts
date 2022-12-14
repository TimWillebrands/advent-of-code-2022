import { memoizeWith } from "https://deno.land/x/ramda@v0.27.2/mod.ts";

export const a = 16;
const inputFull = await Deno.readTextFile(Deno.args[0]);
const input = inputFull
  .split("\n")
  .filter((line) => line !== "")
  .map((line) => ({
    id: line.slice(6, 8),
    flow: Number(line.match(/\d+/g)?.at(0)),
    tunnels: line.match(/\b[A-Z]{2,}/g)!.slice(1),
  }));

type Node = typeof input[0];

const digraph = input.reduce(
  (graph, node, i) => [
    ...graph,
    `\t${node.id} [label="${node.id}\\nflow: ${node.flow}"]`,
    "\t" + [node.id, ...node.tunnels].join(" -> ") +
    (i === input.length - 1 ? ";\n}" : ";"),
  ],
  ["digraph G {"],
).join("\n");
Deno.writeTextFile("graph.dot", digraph);

const map = input.reduce(
  (acc, node) => ({ ...acc, [node.id]: node }),
  {} as Record<string, Node>,
);

const traverse = memoizeWith(
  (node: Node, time: number, opened: string[]) =>
    node.id + String(time) + opened.join(""),
  (node: Node, time: number, opened: string[]): number => {
    if (time <= 0) return 0;

    let score = Math.max(
      ...node.tunnels.map((nb) => traverse(map[nb], time - 1, opened)),
    );
    if (!opened.includes(node.id) && node.flow > 0) {
      score = Math.max(
        score,
        (time - 1) * node.flow + traverse(node, time - 1, [...opened, node.id]),
      );
    }

    return score;
  },
);

const thething = traverse(map["AA"], 30, []);

console.log(map, thething);
