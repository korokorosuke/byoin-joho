import { styleText } from "util"
import { getInfo } from "./excel.ts"
import { write } from "./db.ts"
import type { Info, IZipEntry } from "./area/common.ts"

interface IArea{
  get: (info: Info) => Promise<IZipEntry[]>
  info: Info
}

function getAreaName(pattern: string, pattern3: string, filename: string): string {
  let res = new RegExp(pattern, "i").exec(filename);
  if(res && res.groups && res.groups.name){
    return res.groups.name;
  }
  res = new RegExp(pattern3, "i").exec(filename);
    if(res && res.groups && res.groups.name){
    return res.groups.name;
  }
  throw new Error("Illegal file name");
}

export async function main(area: IArea) {
  const entries = await area.get(area.info);
  await Promise.allSettled(
    entries.map(async (ent) => {
      process.stdout.write(styleText("cyan","開始: "))
      console.log(ent.name);
      const areaName = getAreaName(area.info.file, area.info.file3, ent.name);
      const list = await getInfo(ent.getData(), areaName, ent.tenCode);
      write(list);
      process.stdout.write(styleText("green","終了: "))
      console.log(ent.name);
    }));
}