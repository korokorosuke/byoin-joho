import { JSDOM } from "jsdom"
import admZip from "adm-zip"
import iconv from "iconv-lite"
import { getSite, getZip, getPath, type Info, type IZipEntry } from "./common.ts"

const ROOT = "https://kouseikyoku.mhlw.go.jp";
const SITE_PATH = `${ROOT}/tokaihokuriku/newpage_00287.html`;
const FILE_NAME = "[0-9]{4}（(.+)医科）コード内容別医療機関一覧表.xlsx";

async function getExcels(info: Info): Promise<IZipEntry[]> {
  const html = await getSite(info.site);
  const path = getPath(info.root, html, ".zip", "ul a");
  const buffer = await getZip(path);
  const admzip = new admZip(buffer,
    {
      decoder: {
        decode: (buf: Buffer) => iconv.decode(buf, "cp932"),
        encode: (str: string) => iconv.encode(str, "cp932"),
      }
    });
  return admzip.getEntries().filter(ent => !ent.isDirectory);
}

export const area = {
  get: getExcels,
  info: {
    root: ROOT,
    site: SITE_PATH,
    file: FILE_NAME
  } as const
}