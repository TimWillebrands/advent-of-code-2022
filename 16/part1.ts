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

let digraph = input.reduce(
  (graph, node, i) => [
    ...graph,
    `\t${node.id} [label="${node.id}\\nflow: ${node.flow}"]`,
    "\t" + [node.id, ...node.tunnels].join(" -> ") +
    (i === input.length - 1 ? ";\n}" : ";"),
  ],
  ["digraph G {"],
).join("\n");

Deno.writeTextFile("graph.dot", digraph);

console.log(input, digraph);
