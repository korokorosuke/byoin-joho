import { JSDOM } from "jsdom"
import { getSite, IKA, SHIKA, type Info, type IZipEntry } from "./common.ts"

const ROOT = "https://kouseikyoku.mhlw.go.jp";
const SITE_PATH = `${ROOT}/hokkaido/gyomu/gyomu/hoken_kikan/code_ichiran.html`;
const FILE_NAME = "(?<name>.+)_(.+).xlsx";

function getPaths(root: string, s: string): string[] {
  const dom = new JSDOM(s);
  const elems:NodeListOf<HTMLAnchorElement> = dom.window.document.querySelectorAll<HTMLAnchorElement>("table a");
  let cnt = 3;
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
  const list: IZipEntry[] = [];
  let cnt = 1;
  for await (const path of paths){
    let name = "";
    let tenCode = "";
    if (cnt === 1) {
      name = "北海道_病院.xlsx";
      tenCode = IKA;
    } else if (cnt === 2) {
      name = "北海道_診療所.xlsx";
      tenCode = IKA;
    } else if (cnt === 3) {
      name = "北海道_歯科.xlsx";
      tenCode = SHIKA;
    } else {
      throw new Error("Wrong array index");
    }
    const buffer = await getExcel(path);
    list.push({
      name: name,
      getData: () => buffer,
      tenCode: tenCode
    });
    cnt++;
  }
  return list;
}

export const area = {
  get: getExcels,
  info: {
    root: ROOT,
    site: SITE_PATH,
    file: FILE_NAME,
    file3: FILE_NAME
  } as const
}