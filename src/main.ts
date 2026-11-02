import { getInfo } from "./excel.ts"
import { write } from "./db.ts"
import type { Info, IZipEntry } from "./area/common.ts"

function getAreaName(pattern: string, filename: string): string {
  const res = new RegExp(pattern, "i").exec(filename);
  if(res && res.length >= 1 && res[1]){
    return res[1];
  }
  throw new Error("Illegal file name");
}

export async function main(get: (info: Info) => Promise<IZipEntry[]>, info: Info) {
  const entries = await get(info);
  for (const ent of entries) {
    console.log(ent.name);
    const areaName = getAreaName(info.file, ent.name);
    console.log(areaName);
    const list = await getInfo(ent.getData(), areaName);
    await write(list);
  }
}