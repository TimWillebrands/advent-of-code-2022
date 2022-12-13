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
      const r = isRightOrder([left, right]);
      // console.log("array", left, right, r);
      if (r === "next") continue;
      else return r;
    } else if (Array.isArray(left) && typeof right === "number") {
      const r = isRightOrder([left, [right]]);
      // console.log("array,number", left, right, r);
      if (r === "next") continue;
      else return r;
    } else if (typeof left === "number" && Array.isArray(right)) {
      const r = isRightOrder([[left], right]);
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

const inputFull = await Deno.readTextFile(Deno.args[0]);
const input = inputFull
  .split("\n\n")
  .map((pair) =>
    pair
      .split("\n")
      .filter((line) => line !== "")
      .map((line) => JSON.parse(line))
  )
  .map((pair) => isRightOrder(pair as [Packet, Packet]));

console.log(input.reduce((acc, signal, i) => signal ? acc + (i + 1) : acc, 0));
