import { JSDOM } from "jsdom"
import admZip from "adm-zip"
import { getSite, getZip, type Info, type IZipEntry } from "./common.ts"

const ROOT = "https://kouseikyoku.mhlw.go.jp";
const SITE_PATH = `${ROOT}/kantoshinetsu/chousa/shitei.html`;
const FILE_NAME = "[0-9]{3}コード内容別一覧表（医科）([\\W]+)[\\w]+.xlsx";

function getZipPaths(root: string, s :string): string[] {
  const dom = new JSDOM(s);
  const elems:NodeListOf<HTMLAnchorElement> = dom.window.document.querySelectorAll<HTMLAnchorElement>("table a");
  let cnt = 2;
  const list = [];
  for(const elem of elems){
    if((elem.text === "医科（ZIP）" || elem.text === "医科（歯科併設）（ZIP）") && elem.href.endsWith(".zip")){
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

async function getExcels(info: Info): Promise<IZipEntry[]> {
  const html = await getSite(info.site);
  const paths = getZipPaths(info.root, html);
  let list: IZipEntry[] = [];
  for(const path of paths){
    const buffer = await getZip(path);
    const admzip = new admZip(buffer);
    list = [...list, ...admzip.getEntries().filter(ent => ent.name.match(FILE_NAME))];
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