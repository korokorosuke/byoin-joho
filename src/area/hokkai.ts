import { JSDOM } from "jsdom"
import { getSite, type Info, type IZipEntry } from "./common.ts"

const ROOT = "https://kouseikyoku.mhlw.go.jp";
const SITE_PATH = `${ROOT}/hokkaido/gyomu/gyomu/hoken_kikan/code_ichiran.html`;
const FILE_NAME = "(.+).xlsx";

function getPaths(root: string, s :string): string[] {
  const dom = new JSDOM(s);
  const elems:NodeListOf<HTMLAnchorElement> = dom.window.document.querySelectorAll<HTMLAnchorElement>("table a");
  //病院と診療所があるため２つ取得
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
  throw new Error("Can't get xlsx file path");
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

async function getExcels(info: Info): Promise<IZipEntry[]> {
  const html = await getSite(info.site);
  const paths = getPaths(info.root, html);
  const list = [];
  for await (const path of paths){
    const buffer = await getExcel(path);
    list.push({
      name: "北海道.xlsx",
      getData: () => buffer
    });
  }
  return list;
}

export const area = {
  get: getExcels,
  info: {
    root: ROOT,
    site: SITE_PATH,
    file: FILE_NAME
  } as const
}