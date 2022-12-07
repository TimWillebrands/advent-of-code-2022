export const a = 1;

const inputFull = await Deno.readTextFile(Deno.args[0]);
const lines = inputFull
  .split("\n")
  .filter((line) => line !== "")
  .map((line) => line.split(" "))
  .reduce((acc, line) => {
    if (line[1] === "cd") {
      if (line[2] === "..") acc.path.pop();
      else acc.path.push(line[2]);
    } else if (line[0] === "dir" || line[1] === "ls") {
    } else {
      acc.path.forEach((d, i) => {
        const dir = [...acc.path.slice(0, i), d].join("/");
        acc.dirs[dir] = acc.dirs[dir] || 0;
        acc.dirs[dir] += Number(line[0]);
      });
    }
    return acc;
  }, {
    dirs: {} as Record<string, number>,
    path: new Array<string>(),
  });

const freePlz = 30_000_000 - (70_000_000 - lines.dirs["/"]);
const stuff = Object.values(lines.dirs)
  .filter((dirSize) => dirSize >= freePlz)
  .reduce((smoll, dirSize) => dirSize < smoll ? dirSize : smoll, 99999999999);

console.log(stuff);
