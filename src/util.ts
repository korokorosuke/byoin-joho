import * as pathmo from "path"
import * as fs from "fs"

export function saveFile(buffer: Buffer) {
  const savePath = pathmo.resolve(__dirname, './temp');
  fs.writeFileSync(savePath + "/a.zip", buffer);
}

export function readFile(path: string): Buffer {
  return fs.readFileSync(path);
}

export function reFind(pattern: string, text: string): string {
  const re = new RegExp(pattern, "i");
  const res = re.exec(text);
  if (res && res.length >= 2 && res[1]) {
    return res[1];
  }
  return "";
}