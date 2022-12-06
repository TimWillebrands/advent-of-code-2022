const isFirst = (char: number, buffer: string) =>
  [...buffer].findIndex((c) => c === buffer.charAt(char)) === char;

const isMarker = (buffer: string) =>
  [...buffer].every((_, i) => isFirst(i, buffer));

const inputFull = await Deno.readTextFile(Deno.args[0]);
for (let i = 0; i < inputFull.length; i++) {
  const part = inputFull.slice(i, i + 14);
  if (isMarker(part)) {
    console.log(part, i + 14);
    break;
  }
}
