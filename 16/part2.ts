import { ld } from "https://x.nest.land/deno-lodash@1.0.0/mod.ts";

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

let traversal = 0;
const traverse = ld.memoize(
  (node: Node, time: number, opened: string[], wait: boolean): number => {
    if (time <= 0) return wait ? traverse(map["AA"], 26, opened, false) : 0;

    let score = Math.max(
      ...node.tunnels.map((nb) => traverse(map[nb], time - 1, opened, wait)),
    );
    if (!opened.includes(node.id) && node.flow > 0) {
      score = Math.max(
        score,
        (time - 1) * node.flow +
          traverse(node, time - 1, [...opened, node.id], wait),
      );
    }

    if (traversal++ % 10000 === 0) console.log(traversal);
    return score;
  },
  (node: Node, time: number, opened: string[], wait: boolean) =>
    node.id + String(time) + opened.join("") + String(wait),
);

console.log(map, traverse(map["AA"], 26, [], true));
