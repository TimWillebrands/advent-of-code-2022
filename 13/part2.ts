export const a = 13;

type Packet = (number | Packet)[];

function isRightOrder(
  [leftPacket, rightPacket]: [Packet, Packet],
): boolean | "next" {
  while (leftPacket.length > 0) {
    const left = leftPacket.shift();
    const right = rightPacket.shift();
    if (typeof left === "number" && typeof right === "number") {
      // console.log("number", left, right);
      if (left === right) {
        continue;
      } else {
        return left < right;
      }
    } else if (Array.isArray(left) && Array.isArray(right)) {
      const r = isRightOrder([[...left], [...right]]);
      // console.log("array", left, right, r);
      if (r === "next") continue;
      else return r;
    } else if (Array.isArray(left) && typeof right === "number") {
      const r = isRightOrder([[...left], [right]]);
      // console.log("array,number", left, right, r);
      if (r === "next") continue;
      else return r;
    } else if (typeof left === "number" && Array.isArray(right)) {
      const r = isRightOrder([[left], [...right]]);
      // console.log("number,array", left, right, r);
      if (r === "next") continue;
      else return r;
    } else if (left === undefined && right !== undefined) {
      // console.log("undefined,number", left, right);
      return true;
    } else if (left !== undefined && right === undefined) {
      // console.log("number,undefined", left, right);
      return false;
    } else {
      // console.log("idk", left, right);
    }
  }
  if (leftPacket.length <= 0 && rightPacket.length > 0) {
    // console.log("number,undefined");
    return true;
  }
  return "next";
}

let inputFull = await Deno.readTextFile(Deno.args[0]);
inputFull += "\n[[2]]\n[[6]]";
const input = inputFull
  .split("\n\n")
  .flatMap((pair) =>
    pair
      .split("\n")
      .filter((line) => line !== "")
      .map((line) => JSON.parse(line))
  )
  .sort((packetA, packetB) =>
    isRightOrder([[...packetA], [...packetB]] as [Packet, Packet]) ? -1 : 1
  )
  .reduce((acc, signal, i) => {
    if (
      JSON.stringify(signal) === "[[2]]" || JSON.stringify(signal) === "[[6]]"
    ) {
      return acc * (i + 1);
    }
    return acc;
  }, 1);

console.log(input);
