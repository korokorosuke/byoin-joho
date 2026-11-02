import { getInfo } from "./excel.ts"
import { write } from "./db.ts"
import type { Info, IZipEntry } from "./area/common.ts"

interface IArea{
  get: (info: Info) => Promise<IZipEntry[]>
  info: Info
}

function getAreaName(pattern: string, filename: string): string {
  const res = new RegExp(pattern, "i").exec(filename);
  if(res && res.length >= 1 && res[1]){
    return res[1];
  }
  throw new Error("Illegal file name");
}

export async function main(area: IArea) {
  const entries = await area.get(area.info);
  for (const ent of entries) {
    console.log(ent.name);
    const areaName = getAreaName(area.info.file, ent.name);
    console.log(areaName);
    const list = await getInfo(ent.getData(), areaName);
    await write(list);
  }
}