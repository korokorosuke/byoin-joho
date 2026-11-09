import { resolve } from "path"

export async function writeFile(buffer: Buffer): Promise<void> {
  const savePath = resolve(__dirname, './temp');
  await Bun.write(savePath + "/a.zip", buffer);
}

export async function readFile(path: string): Promise<Uint8Array> {
  return await Bun.file(path).bytes();
}

export function reFind(pattern: string, text: string): string {
  const re = new RegExp(pattern, "i");
  const res = re.exec(text);
  if (res && res.length >= 2 && res[1]) {
    return res[1];
  }
  return "";
}