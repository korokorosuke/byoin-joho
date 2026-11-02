import { JSDOM } from "jsdom"
import admZip from "adm-zip"
import iconv from "iconv-lite"
import { getSite, getZip, type Info, type IZipEntry } from "./common.ts"

const ROOT = "https://kouseikyoku.mhlw.go.jp";
const SITE_PATH = `${ROOT}/tokaihokuriku/newpage_00287.html`;
const FILE_NAME = "[0-9]{4}（(.+)医科）コード内容別医療機関一覧表.xlsx";

export const INFO = {
  root: ROOT,
  site: SITE_PATH,
  file: FILE_NAME
} as const;

export function getZipPath(root: string, s :string): string{
  const dom = new JSDOM(s);
  const elems:NodeListOf<HTMLAnchorElement> = dom.window.document.querySelectorAll<HTMLAnchorElement>("ul a");
  for(const elem of elems){
    if(elem.href.endsWith(".zip")){
      return `${root}${elem.href}`;
    }
  }
  throw new Error("Can't get zip file path");
}

export async function getExcels(info: Info): Promise<IZipEntry[]> {
  const html = await getSite(info.site);
  const path = getZipPath(info.root, html);
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