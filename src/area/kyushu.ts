import { JSDOM } from "jsdom"
import admZip from "adm-zip"
import { getSite, getZip, IKA, SHIKA, type Info, type IZipEntry } from "./common.ts"

const ROOT = "https://kouseikyoku.mhlw.go.jp";
const SITE_PATH = `${ROOT}/kyushu/gyomu/gyomu/hoken_kikan/index_00006.html`;
//福岡だけ、_ika_が県名の先に来る
const FILE_NAME = "[a-z][0-9]?[0-9]_[0-9]?[0-9]_(ika_)?(?<name>[a-z]+)(_ika)?_02\\.xlsx";
const FILE_NAME3 = "[a-z][0-9]?[0-9]_[0-9]?[0-9]_(shika_)?(?<name>[a-z]+)(_shika)?_02\\.xlsx";

function getZipPaths(root: string, s :string): string[] {
  const dom = new JSDOM(s);
  const elems:NodeListOf<HTMLAnchorElement> = dom.window.document.querySelectorAll<HTMLAnchorElement>("table a");
  let cnt = 8;
  const list = [];
  for(const elem of elems){
    if(elem.href.endsWith(".zip")){
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
    list = [...list,
      ...admzip.getEntries().filter(ent => ent.name.match(FILE_NAME))
        .map(ent => ({...ent, tenCode: IKA})),
      ...admzip.getEntries().filter(ent => ent.name.match(FILE_NAME3))
        .map(ent => ({...ent, tenCode: SHIKA}))];
  }
  return list;
}

export const area = {
  get: getExcels,
  info: {
    root: ROOT,
    site: SITE_PATH,
    file: FILE_NAME,
    file3: FILE_NAME3
  } as const
}