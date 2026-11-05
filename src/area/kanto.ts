import { JSDOM } from "jsdom"
import admZip from "adm-zip"
import { getSite, getZip, IKA, SHIKA, type Info, type IZipEntry } from "./common.ts"

const ROOT = "https://kouseikyoku.mhlw.go.jp";
const SITE_PATH = `${ROOT}/kantoshinetsu/chousa/shitei.html`;
const FILE_NAME = "[0-9]{3}コード内容別一覧表（医科）(?<name>[\\W]+)[\\w]+.xlsx";
const FILE_NAME3 = "[0-9]{3}コード内容別一覧表（歯科）(?<name>[\\W]+)[\\w]+.xlsx";

interface Value{
  path: string
  tenCode: string
}

function getZipPaths(root: string, s :string): Value[] {
  const dom = new JSDOM(s);
  const elems:NodeListOf<HTMLAnchorElement> = dom.window.document.querySelectorAll<HTMLAnchorElement>("table a");
  const list: Value[] = [];
  for(const elem of elems){
    if ((elem.text === "医科（ZIP）" || elem.text === "医科（歯科併設）（ZIP）") && elem.href.endsWith(".zip")) {
      list.push({
        path: `${root}${elem.href}`,
        tenCode: IKA
      });
    }else if((elem.text === "歯科（ZIP）" || elem.text === "歯科（医科併設）（ZIP）") && elem.href.endsWith(".zip")){
      list.push({
        path: `${root}${elem.href}`,
        tenCode: SHIKA
      });
    } else if(elem.text === "薬局（ZIP）" && elem.href.endsWith(".zip")) {
      break;
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
    const buffer = await getZip(path.path);
    const admzip = new admZip(buffer);
    list = [...list, ...admzip.getEntries().filter(ent => ent.name.match(FILE_NAME))
      .map(ent => ({...ent, tenCode: path.tenCode}))];
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