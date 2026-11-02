import { JSDOM } from "jsdom"
import { getSite, type Info, type IZipEntry } from "./common.ts"

const ROOT = "https://kouseikyoku.mhlw.go.jp";
const SITE_PATH = `${ROOT}/tohoku/gyomu/gyomu/hoken_kikan/itiran.html`;
const FILE_NAME = "(.+).xlsx";

export const INFO = {
  root: ROOT,
  site: SITE_PATH,
  file: FILE_NAME
} as const;

export function getPaths(root: string, s :string): string[] {
  const dom = new JSDOM(s);
  const elems:NodeListOf<HTMLAnchorElement> = dom.window.document.querySelectorAll<HTMLAnchorElement>("table a");
  //医科と医科歯科併用があるため２つ取得
  let cnt = 2;
  const list = [];
  for(const elem of elems){
    if(elem.href.endsWith(".xlsx")){
      list.push(`${root}${elem.href}`);
      cnt--;
      if (cnt === 0) {
        break;
      }
    }
  }
  if (list.length > 0) {
    return list;
  }
  throw new Error("Can't get zip file path");
}

async function getExcel(path: string): Promise<Buffer> {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error("download error");
  }

  const zip = await res.blob();
  const arrayBuffer = await zip.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function getExcels(info: Info): Promise<IZipEntry[]> {
  const html = await getSite(info.site);
  const paths = getPaths(info.root, html);
  let list: IZipEntry[] = [];
  for(const path of paths){
    const buffer = await getExcel(path);
    list.push({
      name: "東北.xlsx",
      getData: () => buffer
    });
  }
  return list;
}
